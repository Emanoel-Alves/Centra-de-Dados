const puppeteer = require("puppeteer");
var fs = require("fs");

let tabNet = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "http://extranet.saude.ce.gov.br/tabulacao/deftohtm.exe?sim/obito.def"
  );
  //seleciona os dados nas caixas selects
  await page.select("select#L", "Causa_(CID10_BR)");
  await page.select("select#C", "Regional_de_Saude_Mun/Ocor");
  await page.select("select#I", "Frequencia");
  await page.select("select#A", "doce20.dbf");

  const resultado_button = await page.$x("//input[contains(@Name, 'mostre')]"); //procura um botão com o atributo @name com valor "mostre"

  if (resultado_button.length > 0) {
    //encontra o primeiro button é seleciona
    await resultado_button[0].click();
  }

  await page.waitForNavigation(); //navega pra proxima pagina

  await page.screenshot({ path: "tabNet.png" }); //tira um screenshot

  const doencas_estado = await page.evaluate(() => {
    let nome_cidades = [];
    let nome_doencas = [];
    lista_doencas_cidade = [];

    document
      .querySelector("table > tbody > tr")
      .querySelectorAll("th")
      .forEach((coluna) => {
        nome_cidades.push(coluna.innerText.replace(".... ", ""));
      });

    nome_cidades.shift(); //refinamento
    nome_cidades.pop(); //refinamento

    document.querySelectorAll("table > tbody > tr").forEach((linha, index) => {
      if (index != 0) {
        //exclue a primeira tr (refinamento)
        linha.querySelectorAll("th").forEach((value) => {
          nome_doencas.push(
            value.innerText
              .replace(". ", "")
              .replace("... ", "")
              .replace("..", "")
          );
        });
      }
    });

    nome_doencas.shift();

    document.querySelectorAll("table > tbody > tr").forEach((linha, index) => {
      let total_casos_doenca = [];
      if (index != 0 && index != 1) {
        //exclue a primeira e segunda tr (refinamento)
        nova_doenca = {};
        linha.querySelectorAll("td").forEach((value) => {
          total_casos_doenca.push(value.innerText);
        });

        total_casos_doenca.pop();

        let lista_cidades = [];

        for (let i = 0; i < total_casos_doenca.length; i++) {
          lista_cidades.push({
            nome: nome_cidades[i],
            valor: total_casos_doenca[i],
          });
        }

        lista_doencas_cidade.push({
          doenca: nome_doencas.shift(),
          cidades: lista_cidades,
        });
      }
    });

    return lista_doencas_cidade;
  });

  browser.close();
  fs.appendFile(
    "dados-tabNet.json",
    JSON.stringify(doencas_estado) + " " + "\n",
    function (err) {
      if (err) throw err;
      console.log("Arquivo salvo com sucesso!");
    }
  );

  return doencas_estado;
};
//-----------------------------------------------------------------------------------------------

let covidBR = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://github.com/wcota/covid19br/blob/master/cases-brazil-cities.csv"
  );

  const cidades_do_estado = await page.evaluate(() => {
    let coluna_titulos = [];
    let casos_por_cidades = [];
    //seleciona os nomes da colunas
    document
      .querySelector("table > thead > tr")
      .querySelectorAll("th")
      .forEach((coluna) => {
        coluna_titulos.push(coluna.innerText);
      });
    // realiza a raspagem dos dados e os reorganiza
    document.querySelectorAll("table > tbody > tr").forEach((linha) => {
      let nova_cidade = {};
      let dados_nova_cidade = [];

      linha.querySelectorAll("td").forEach((value) => {
        dados_nova_cidade.push(value.innerText);
      });

      dados_nova_cidade.shift(); //refinamento

      if (dados_nova_cidade[1] == "CE") {
        for (let i = 0; i < coluna_titulos.length; i++) {
          nova_cidade[coluna_titulos[i]] = dados_nova_cidade[i];
        }
        casos_por_cidades.push(nova_cidade);
      }
    });
    return casos_por_cidades;
  });

  await page.goto(
    "https://github.com/wcota/covid19br/blob/master/cases-brazil-total.csv"
  );

  const total_pais_e_estado = await page.evaluate(() => {
    let coluna_titulos = [];
    let dados_estado = [];
    let dados_pais = [];
    let estado = {};
    let pais = {};
    // let resultado = [];

    //seleciona as o nome das colunas da tabela
    document
      .querySelector("table > thead > tr")
      .querySelectorAll("th")
      .forEach((coluna) => {
        coluna_titulos.push(coluna.innerText);
      });

    //seleciona os dados da tag referente a busca
    document
      .querySelector("#LC8")
      .querySelectorAll("td")
      .forEach((value) => {
        dados_estado.push(value.innerText);
      });

    dados_estado.shift(); //retira dado indesejado

    for (let i = 0; i < coluna_titulos.length; i++) {
      estado[coluna_titulos[i]] = dados_estado[i];
    }

    document
      .querySelector("#LC2")
      .querySelectorAll("td")
      .forEach((value) => {
        dados_pais.push(value.innerText);
      });

    dados_pais.shift(); //retira dados indesejados

    for (let i = 0; i < coluna_titulos.length; i++) {
      pais[coluna_titulos[i]] = dados_pais[i];
    }

    return { pais, estado };
  });

  browser.close(); // fecha a instancia do browser
  fs.appendFile(
    "dados-covid.json",
    JSON.stringify({ total_pais_e_estado, cidades_do_estado }) + " " + "\n",
    function (err) {
      if (err) throw err;
      console.log("Arquivo salvo com sucesso!");
    }
  );
  return { total_pais_e_estado, cidades_do_estado };
};

covidBR().then((value) => {
  console.log(value);
});

tabNet().then((value) => {
  console.log(value);
});
