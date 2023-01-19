#!/usr/bin/env node
"use strict";
import yargs from "yargs";
import runProgramAggregation from '../app'


const options: any = yargs
  .usage( "Usage: -n <name>")
  .option( "p", { alias: "file", describe: "CSV File Name With Extention", type: "string", demandOption: true } )
  .argv;


  
(async () => {
  // console.log('start');
  await runProgramAggregation(options.file)
  // console.log('done');
})();



