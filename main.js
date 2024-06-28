import process from "./src/process.js";
import {
  getCSVData,
  getUniqueRRN as getUnique,
  runGetCSVData,
} from "./src/rrn.js";
import runAbuProcess, { printtAbuStats } from "./src/abu.js";

//process
//process();

//rrn
//runGetCSVData()
//console.log(getUnique([1,2,3,43,,3,2,7]));

/*  abu scripts ...*/
//runAbuProcess(['abu-2023-12.txt', 'abu-2023-11.txt']);
//runAbuProcess(['abu-2023-10.txt'])

//runAbuProcess(['abu-2024-01.txt', 'abu-2024-02.txt','abu-2024-03.txt', 'abu-2024-04.txt', 'abu-2024-05.txt']);
//runAbuProcess(["abu-2024-05.txt"]);
// runAbuProcess([
//   "abu-2023-12.txt",
//   "abu-2023-11.txt",
//   "abu-2023-10.txt",
//   "abu-2023-09.txt",
//   "abu-2023-08.txt",
//   "abu-2023-07.txt",
//   "abu-2023-06.txt",
//   "abu-2023-05.txt",
//   "abu-2023-04.txt",
//   "abu-2023-03.txt",
//   "abu-2023-02.txt",
//   "abu-2023-01.txt",
// ]);
printtAbuStats();
