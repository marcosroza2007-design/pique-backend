const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (req, res) => {

res.send("Backend funcionando");

});

app.get("/sync", async (req, res) => {

try {

const response = await axios.get(
"https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4335"
);

res.json(response.data);

} catch (e) {

res.status(500).send("Error");

}

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

console.log(`Servidor iniciado en puerto ${PORT}`);

});