// require
const puppeteer = require('puppeteer');

(async() => {
  // option
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  // コマンドライン引数からページのURLを取得。
  // 提出するコードが完成したら、変更する必要あり。
  const url = process.argv[2];

  // ページのインスタンスを作る。
  const page = await browser.newPage();


  // URLのページに移動する。
  await page.goto(url);

  // スクレイピングによりデータを取得する。
  const scrapingData = await page.evaluate(() => {
    let dataList = [];
    const tableList = document.querySelectorAll("table");
    tableList.forEach(_node => {
      dataList.push(_node.innerText);
    })
    dataList = dataList[2];
    dataList = dataList.split("\n");
    for(let i = 0; i < dataList.length; i++) dataList[i] = dataList[i].split("\t");
    return dataList;
  });

  // console.log(scrapingData);
  console.log("case\tstat\ttime");
  for(let i = 1; i < scrapingData.length; i++)
  {
    for(let j = 0; j < scrapingData[i].length-1; j++)
    {
      if(j == 0) {
        process.stdout.write(scrapingData[i][j].substr(0, 5));
        if(scrapingData[i][j].length > 5) process.stdout.write("..");
        process.stdout.write("\t");
      }
      else
      {
        process.stdout.write(scrapingData[i][j]);
        process.stdout.write("\t");
      }
    }
    console.log("");
  }
  await browser.close();
})();
