const express = require("express");
const axios = require("axios");
const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

app.get("/sync", async (req, res) => {
  try {

    const deportes = [
      "Soccer",
      "Basketball",
      "Tennis",
      "Motorsport",
      "American Football"
    ];

    const competicionesPermitidas = [
      "NBA",
      "ATP World Tour"
    ];

    let totalEventos = 0;

    const hoy = new Date().toISOString().split("T")[0];

    for (const deporte of deportes) {

      const response = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${hoy}&s=${encodeURIComponent(deporte)}`
      );

      const eventos = response.data.events;

      if (!eventos) continue;

      for (const evento of eventos) {

        const competicion = evento.strLeague || "";

        console.log(evento.strLeague, "-", evento.strSport);

        if (!competicionesPermitidas.includes(competicion)) {
          continue;
        }

        await db.collection("eventos").doc(evento.idEvent).set({
          deporte: evento.strSport || deporte,
          competicion: competicion,
          equipoA: evento.strHomeTeam || "",
          equipoB: evento.strAwayTeam || "",
          fecha: evento.strTimestamp || "",
          estado: "pendiente",
        });

        totalEventos++;
      }
    }

    res.send(`Eventos guardados: ${totalEventos}`);

  } catch (e) {

    console.log(e);
    res.status(500).send("Error");

  }
});

app.get("/ligas", async (req, res) => {
  try {

    const deportes = [
      "Soccer",
      "Basketball",
      "Tennis",
      "Motorsport",
      "American Football"
    ];

    let resultado = [];

    for (const deporte of deportes) {

      const response = await axios.get(
        `https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php?s=${encodeURIComponent(deporte)}`
      );

      if (response.data.countries) {
        resultado.push(...response.data.countries);
      }
    }

    res.json(resultado);

  } catch (e) {

    console.log(e);
    res.status(500).send("Error");

  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});