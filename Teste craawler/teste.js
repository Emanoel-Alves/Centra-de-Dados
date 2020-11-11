var request = require("request");
var cheerio = require("cheerio");
var fs = require("fs");

request(
  "https://github.com/wcota/covid19br/blob/master/cases-brazil-total.csv",
  function (err, res, body) {
    if (err) console.log("Erro: " + err);

    var $ = cheerio.load(body);
    var estado = [];

    $("#LC8 td").each(function () {
      console.log("OLaa");

      estado.push($(this).text().trim());
    });
    console.log(estado);

    var obj = {
      country: estado[1],
      state: estado[2],
      totalDeCasos: estado[3],
      totalDeCasosMS: estado[4],
      naoConfirmadosMs: estado[5],
      mortes: estado[6],
      mortesMs: estado[7],
      fonte: estado[8],
      mortesPor100khabitantes: estado[9],
      totalCasosPor100kHabita: estado[10],
      mortesPorTotalDeCasos: estado[11],
      recuperados: estado[12],
      supeitos: estado[13],
      testes: estado[14],
      testePor100KHabita: estado[15],
    };

    console.log(obj);
  }
);
