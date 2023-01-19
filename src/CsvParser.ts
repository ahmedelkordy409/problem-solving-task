#!/usr/bin/env node
"use strict";
import * as path from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { parse } from '@fast-csv/parse';
import { format } from '@fast-csv/format';




/***
* @desc  to parse csv file and return array objects with header 
* @param filePath   string
*/
export async function parseCSVFile(fileName: string, headers: string[]) {

  // console.log('parseCSVFile');
  const filePath = path.resolve(__dirname,'./..', fileName);
  // console.log('filePath', filePath);

  return new Promise(function(resolve, reject) {
 
      let chunkArray: any[] = [];

      createReadStream(filePath)
  
      .pipe(parse({ headers }))
  
      .on('error',( error: Error )=> { 
         // console.log(error);
         reject
       })
  
      .on('data', chunk => {
           // remove unnecessary properties
           chunkArray.push({
               name: chunk.name,
               quantity: chunk.quantity,
               brand: chunk.brand,
           });
       })

      .on('end', (rowCount: number) =>{ 
          resolve(chunkArray)
       });
    })
  }
  


/**
 * @desc  to parse csv file and return array objects with header 
 * @param filePath   string
 */
 export async function writeCSVFile(fileName: string,data: any) {

    const writableStream = createWriteStream(fileName);

    const stream = format({ headers:false });

    stream.pipe(writableStream);

    await data.forEach((row: any) => {
        stream.write(row);
    })

    stream.end();
  }

 
  /**
   * @param fileName 
   * @param prefix 
   * @returns 
   */
  export async function createPathWithPrefix(prefix: string, filePath: string) {
    return prefix+filePath
  }
