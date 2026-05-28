const express = require("express");
const axios = require("axios");
const admin = require("firebase-admin");

const serviceAccount = require("./pique-9ca6a-firebase-adminsdk-fbsvc-6dc238b5f6.json");

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

const response = await axios.get(
"https://www.thesportsdb.com/api/v1/json/3/eventslastleague.php?id=4387"
);

const eventos = response.data.events;

if (!eventos) {

return res.send("Sin eventos");

}

for (const evento of eventos) {

await db.collection("eventos").doc(evento.idEvent).set({

equipoA: evento.strHomeTeam,
equipoB: evento.strAwayTeam,
fecha: evento.strTimestamp,
competicion: "NBA",

});

}

res.send("Eventos guardados");

} catch (e) {

console.log(e);

res.status(500).send("Error");

}

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

console.log(`Servidor iniciado en puerto ${PORT}`);

});