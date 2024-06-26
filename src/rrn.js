//const csv = require("csvtojson/v2");
//const path = require("node:path");

import { fileURLToPath } from "node:url";
import * as fs from "node:fs";
import csv from "csvtojson/v2/index.js";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const idList = [
  "11984378",
  "11976804",
  "10541500",
  "10248516",
  "10149620",
  "9620631",
  "9532964",
  "9347216",
  "9279989",
  "8676079",
  "8404735",
  "7963542",
  "5805872",
  "5593120",
  "3058856",
  "3004138",
  "2852540",
  "2726320",
  "2681143",
  "2666238",
  "2399734",
  "2281193",
  "1224890",
  "600029",
];

function printRRN(list) {
  list.forEach((element) => {
    console.log(element.padStart(12, "0"));
  });
}

const rrnList = [
  "000012240965",
  "000012247531",
  "000012099651",
  "000011806807",
  "000012240965",
  "000012247531",
  "000012099651",
  "000011806807",
  "000008588843",
  "000008856775",
  "000009006090",
  "000009006432",
  "000009006526",
  "000009008188",
  "000009008496",
  "000009008823",
  "000009198028",
  "000009269247",
  "000009552856",
  "000010751653",
  "000011424815",
  "000011984378",
  "000011976804",
  "000010541500",
  "000010248516",
  "000010149620",
  "000009620631",
  "000009532964",
  "000009347216",
  "000009279989",
  "000008676079",
  "000008404735",
  "000007963542",
  "000005805872",
  "000005593120",
  "000003058856",
  "000003004138",
  "000002852540",
  "000002726320",
  "000002681143",
  "000002666238",
  "000002399734",
  "000002281193",
  "000001224890",
  "000000600029",
];

export function getUniqueRRN(list, printToConsole = false) {
  let s = new Set();
  list.forEach((element) => {
    s.add(element);
  });
  if (printToConsole) {
    s.forEach((element) => {
      console.log(+element);
    });
  }
  return Array.from(s);
}

//getUniqueRRN(rrnList, true);

export async function getCSVData(csvFile) {
  return await csv().fromFile(csvFile);
}

function generateUpdateStatements(data, updateList) {
  //const q = `UPDATE tranlog SET date = '2023-07-01 11:14:40.985', transmissiondate = '2023-07-01 10:13:28' WHERE id = '9468070';`;
  let result = [];
  result = data
    .filter((x) => updateList.includes(x.rrn) > -1)
    .map((element) => {
      return `UPDATE tranlog SET date = '${element.date}', transmissiondate = '${element.transmissiondate}' WHERE id = '${element.id}'; ${element.rrn}`;
    });
  return result.join("\n");
}

export async function runGetCSVData(printToConsole = false) {
  let fileRequest = path.join(
    __dirname,
    "..",
    "data",
    "req",
    "rrn-2024-06-24.csv"
  );

  let jsonData = await getCSVData(fileRequest);
  const field25RRN = [
    "000008856775",
    "000009006090",
    "000009006432",
    "000009006526",
    "000009008188",
    "000009008496",
    "000009008823",
    "000009198028",
    "000009269247",
    "000009347216",
    "000009279989",
    "000008676079",
    "000007963542",
    "000005805872",
    "000005593120",
    "000003058856",
    "000003004138",
    "000002852540",
    "000002726320",
    "000002681143",
    "000002666238",
    "000002399734",
    "000002281193",
    "000001224890",
    "000000600029",
  ];
  let queries = generateUpdateStatements(jsonData, field25RRN);
  let filePath = path.join(__dirname, "..", "data", "res", "rrn.txt");
  fs.writeFileSync(filePath, queries, "utf-8");
  printToConsole && console.log(queries);
}
