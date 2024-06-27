import process  from "./src/process.js";
import { getCSVData, getUniqueRRN as getUnique, runGetCSVData } from "./src/rrn.js";
import runAbuProcess, {printtAbuStats} from "./src/abu.js";

//process
//process();

//rrn
//runGetCSVData()
//console.log(getUnique([1,2,3,43,,3,2,7]));


/*  abu scripts ...*/
//runAbuProcess(['abu-2023-12.txt', 'abu-2023-11.txt']);
runAbuProcess(['abu-2023-10.txt'])
printtAbuStats();