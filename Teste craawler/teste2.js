var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

request(
  "http://extranet.saude.ce.gov.br/tabulacao/deftohtm.exe?sim/obito.def",
  function (err, res, body) {
    if (err) console.log("Erro: " + err);

    var $ = cheerio.load(body);
    var estado = [];
    $.root().html();
    //     $("p").each(function () {
    //       console.log("OLaa");

    //       estado.push($(this).text().trim());

    //       //       console.log("Titulo:" + title);

    //       //       fs.appendFile("imdb.text", title + " " + "\n", function (err) {
    //       //         if (err) throw err;
    //       //       console.log("Arquivo salvo com sucesso!");
    //       //       });
    //     });
    console.log(estado);
  }
);
