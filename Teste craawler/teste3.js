const { Builder, By, Key, until } = require("selenium-webdriver");

(async function example() {
  let driver = await new Builder().forBrowser("firefox").build();

  await driver.get("http://www.google.com");
  await driver.findElement(By.name("q")).sendKeys("Selenium", Key.RETURN);
  //     await driver.wait(until.titleIs("webdriver - Google Search"), 1000);
})();
