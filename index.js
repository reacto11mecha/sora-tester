const puppeteer = require("puppeteer");

const prompt = require("prompt-sync")();

const paslonNo = prompt("Pilih paslon mana? ");
const nomorPaslon = parseInt(paslonNo);

if (!(nomorPaslon > 0 && nomorPaslon < 4))
  throw new Error("Pilih paslon dari 1-3");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  await Promise.all([
    page.waitForSelector("button"),
    page.waitForSelector(".chakra-stack:nth-of-type(2)"),
  ]);

  const buttons = await page.$$(".tombol-pilih");

  for (let i = 0; i <= 300; i++) {
    await buttons[nomorPaslon - 1].click();

    await page.waitForSelector(".dialog-pilih");

    await page.click(".dialog-pilih");

    await page.waitForSelector(".chakra-alert");

    const alert = await page.$eval(
      ".chakra-alert",
      (el) => window.getComputedStyle(el).backgroundColor
    );

    if (alert !== "rgb(56, 161, 105)")
      throw new Error(
        `Terjadi sebuah kesalahan! | Paslon ${nomorPaslon} | Iterasi ke ${i}`
      );
    else
      console.log(`Berhasil vote paslon urut ${nomorPaslon} | Iterasi ke ${i}`);

    await page.waitForSelector(".dialog-pilih", { hidden: true });
  }

  await browser.close();
})();
