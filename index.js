const express = require("express");
const axios = require("axios");
const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

app.get("/ligas", async (req, res) => {
  try {

    const response = await axios.get(
      "https://www.thesportsdb.com/api/v1/json/3/all_leagues.php"
    );

    res.json(response.data);

  } catch (e) {

    console.log(e);

    res.status(500).send("Error");

  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});