const express = require("express");

const scraper = require("/home/emanoel/Documents/Teste craawler/api-node/dados_saude.js");
const app = express();

app.set("view engine", "pug");

// app.get("/", (req, res) => {
//   const tab = new Promise((resolve, reject) => {
//     scraper
//       .tabNet()
//       .then((data) => {
//         resolve(data);
//       })
//       .catch((err) => reject("Medium scrape failed"));
//   });

//   Promise.all([tab])
//     .then((data) => {
//       res.render("index", { data: { articles: data[0], videos: data[1] } });
//     })
//     .catch((err) => res.status(500).send(err));
// });

app.get("/maps", function (req, res) {
  const tab = new Promise((resolve, reject) => {
    scraper
      .covidBR()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => reject("Medium scrape failed"));
  });

  Promise.all([tab])
    .then((data) => {
      res.send(JSON.stringify(data));
    })
    .catch((err) => res.status(500).send(err));
});

app.listen(8000, function () {
  console.log("Servidor rodando na porta 8000.");
});

// app.listen(process.env.PORT || 3000);
