const express = require("express");
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
    await db.collection("eventos").doc("prueba").set({
      mensaje: "Firebase conectado correctamente",
      fecha: new Date().toISOString(),
    });

    res.send("Documento guardado en Firebase");
  } catch (e) {
    console.log(e);
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});