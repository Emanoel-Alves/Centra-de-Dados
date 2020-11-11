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

  const resultado_button = await page.$x("//input[contains(@Name, 'mostre')]");

  if (resultado_button.length > 0) {
    //encontra o primeiro button é seleciona
    await resultado_button[0].click();
  }

  await page.waitForNavigation(); //navega pra proxima pagina

  await page.screenshot({ path: "newexem.png" }); //tira um screenshot

  const doencas_estado = await page.evaluate(() => {
    // guarda os dados de cidade, doenças e quantidade em vetores
    let coluna_cidade = [];
    let colunaalor = [];
    let colunaDoenca = [];

    document
      .querySelector("table > tbody > tr")
      .querySelectorAll("th")
      .forEach((cidade) => {
        colunaCidade.push(cidade.innerText.replace(".... ", ""));
      });
    colunaCidade.shift();

    document.querySelectorAll("table > tbody tr > td").forEach((quantidade) => {
      colunaValor.push(quantidade.innerText);
    });

    document.querySelectorAll("table > tbody > tr > th").forEach((doenca) => {
      colunaDoenca.push(
        doenca.innerText.replace(". ", "").replace("... ", "").replace("..", "")
      );
    });

    colunaDoenca = colunaDoenca.slice(187, colunaDoenca.length); //reduz o vetor de doenças retirando as cidades que vieram
    colunaValor = colunaValor.slice(colunaCidade.length, colunaValor.length); // reduz o vetor das quantidades tirando a linha do total de doenças por cidade
    dados = [];

    for (i = 0; i < colunaDoenca.length; i++) {
      ciadades = [];
      newObj = {};
      newObj.doenca = colunaDoenca[i];

      for (j = 0; j < colunaCidade.length; j++) {
        cidadeAux = {};
        cidadeAux.nome = colunaCidade[j];
        cidadeAux.total = colunaValor.shift();
        ciadades.push(cidadeAux);
      }
      // colunaValor.shift();

      newObj.ciadades = ciadades;

      dados.push(newObj);
    }

    obj = { dados };

    return obj;
  });

  browser.close();
  // fs.appendFile("dados.json", JSON.stringify(result) + " " + "\n", function (
  //   err
  // ) {
  //   if (err) throw err;
  //   console.log("Arquivo salvo com sucesso!");
  // });

  return result;
};
