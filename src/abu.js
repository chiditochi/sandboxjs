import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import path from "path";
import colors from "colors/safe.js";
import { fileURLToPath } from "node:url";
import * as fs from "node:fs";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

/*
    1. abu-processed.json { '2024-01': [], ...}
    2. abu-2023-12.json

*/

function writeStoreFile(data) {
  let filePath = path.join(
    __dirname,
    "..",
    "data",
    "res",
    "abu-processed.json"
  );
  fs.writeFileSync(filePath, data, "utf-8");
  console.log(colors.green("store (abu-processed.json) was updated ..."));
}

function readFile(fileName) {
  let f = fs.readFileSync(fileName, { encoding: "utf-8", flag: "r" });
  return f;
}

function readArgFiles(fileArray) {
  let result = [];

  if (!fileArray.length) return result;

  for (let f of fileArray) {
    let filePath = path.join(__dirname, "..", "data", "req", f);
    let fileData = readFile(filePath);
    fileData = fileData.trim().split("\n");
    let key = f.replace("abu-", "").replace(".txt", "");
    let r = {};
    r[key] = fileData;
    result.push(r);

    //console.log(fileData, key);
  }
  return result;
}

function readStoreData() {
  let filePath = path.join(
    __dirname,
    "..",
    "data",
    "res",
    "abu-processed.json"
  );
  let fileData = readFile(filePath);
  return fileData;
}

function getUniqueMonthIds(storeIds, monthIds) {
  let result = [];
  let storeSet = new Set(storeIds);
  for (let id of monthIds) {
    if (!storeSet.has(id)) result.push(id);
  }
  return result;
}

function getStoreData(storeData, newData) {
  let result = {
    hasNewMonth: false,
    store: storeData,
    newMonths: [],
    existingMonths: [],
  };

  let m = storeData.months;
  let ids = Array.from(new Set(storeData.totalIds));
  let monthKeysArray = m.map((item) => Object.keys(item)[0]);
  let months = new Set(monthKeysArray);
  //console.log(ids);

  for (let d of newData) {
    let k = Object.keys(d)[0];
    let monthIds = Object.values(d)[0];
    if (months.has(k)) {
      //if month exist in store, do not treat again
      result.existingMonths.push(k);
      continue;
    }

    let uniqueIds = getUniqueMonthIds(ids, monthIds);
    console.log(colors.yellow(uniqueIds));
    let item = {};
    item[k] = uniqueIds;
    m.push(item);
    result.newMonths.push(item);
    ids.push(...uniqueIds);
  }

  result.store.months = m;
  result.store.totalIds = ids;
  result.hasNewMonth = result.newMonths.length > result.existingMonths.length;
  if (result.existingMonths.length) {
    console.log(
      colors.yellow(
        `These existing months have already treated:  ${result.existingMonths.join(
          " | "
        )}`
      )
    );
  }
  //console.log(m, ids, newData)
  //console.log(JSON.stringify(result, null, 2))
  return result;
}

//file process section

function getRandomNumber(min, max, isDecimal) {
  return isDecimal
    ? Math.random() * (max - min) + min
    : Math.round(Math.random() * (max - min) + min);
}


function extractFileData(cardIds) {
  return cardIds.map((element) => {
    let r = {};
    r.id = uuidv4();
    r.cardId = element;
    r.created = moment().format("YYYY-MM-DD HH:mm:ss");
    r.updated = moment().format("YYYY-MM-DD HH:mm:ss");
    return r;
  });
}

function getQueryData(fileData) {
  return fileData.map(
    (entry) =>
      `INSERT INTO mastercard_abu_data (id, card_id, created, updated) VALUES ('${entry.id}', '${entry.cardId}', '${entry.created}', '${entry.updated}');\n`
  );
}

function saveQueryData(queryString, fileName) {
  let file = path.join(__dirname, "..", "data", "res", fileName);
  fs.writeFileSync(file, queryString, { flag: "w" });
  console.log(colors.yellow(`Query Data written in file ${file}`));
}

/*  main functions  */

function storeInsertFile(monthObj) {
  /*
      1. given an array of ids
      2. generate insert statements
      3. write file 
          - filename `abu-yearMon.sql`

  */
  let yearMonth = (Object.keys(monthObj))[0];
  let cardIds = (Object.values(monthObj))[0];

  let queryData = extractFileData(cardIds);
  let queryString = getQueryData(queryData);

  saveQueryData(queryString.join(""), `abu-${yearMonth}.sql`);
}

export default function runAbuProcess(fileArray) {
  console.log(colors.green(`-------------- Application Run -----------`));

  let f = readArgFiles(fileArray);
  //console.log(f);
  let storeData = JSON.parse(readStoreData());
  //console.log(storeData);
  let currentStore = getStoreData(storeData, f);
  //console.log(colors.green(JSON.stringify(currentStore, null, 2)));

  if (currentStore.hasNewMonth) {
    for (let monthItem of currentStore.newMonths) {
      storeInsertFile(monthItem);
    }
    
    console.log(`storing updated data at ...${path.join(__dirname, '..', 'data/req')}`);
    console.log(JSON.stringify(currentStore.store, null, 2));


    writeStoreFile(JSON.stringify(currentStore.store));
  }else{
    console.log(colors.red(`\nNo new month data to process!`));
  }
  console.log(colors.green('\nApplication run completed!!!\n\n'));
}

export function printtAbuStats() {
  let storeData = JSON.parse(readStoreData());
  let summary = [];
  let countMonth = storeData.months.length;
  let months = storeData.months.map((item) => Object.keys(item));

  summary.push(`--------------- Summary-------------------`);
  summary.push(`Id count: ${storeData.totalIds.length}`);
  summary.push(
    `${storeData.months.length} ${
      countMonth > 1 ? "Months have" : "Month has"
    } been processed`
  );
  

  summary.push(
    `${countMonth > 1 ? "Months : " : "Month: "}`
  );

  let runningCount = 0;
  for(let month of storeData.months){
    let yearMonth = (Object.keys(month))[0];
    let cardIds = (Object.values(month))[0];
    runningCount += cardIds.length;
    summary.push(colors.yellow(`\t${yearMonth} has ${cardIds.length} ID(s)`));
  }
  summary.push(colors.red(`\n\tRunning Month id Count is ${runningCount}`))
  console.log(colors.cyan(summary.join("\n")));
}
