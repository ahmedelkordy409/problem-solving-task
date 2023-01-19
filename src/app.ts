#!/usr/bin/env node
"use strict";
import * as path from 'path';
import _ from 'lodash'
import {
  parseCSVFile,
  writeCSVFile,
  createPathWithPrefix
} from './CsvParser';

import { Item } from './types';




export default async function runProgramAggregation(
  filePath: string,
){

  // 1- parse CSV file
  const headers =  [
    'id', 
    'area', 
    'name',
    'quantity', 
    'brand'
  ];

    
  let  chunkArray: any = await parseCSVFile(filePath, headers);

  // // console.log(chunkArray);

  // common_product_and_ratio
  const commonProduct = await commonProductData(chunkArray as any, chunkArray.length);
  // // console.log(commonProduct, "commonProduct");

  const commonProductPath = await createPathWithPrefix('0_', filePath);
  
  await writeCSVFile(commonProductPath, commonProduct);

  // // console.log(commonProduct);

  //--------------------------------------------------------------
  // common_brand
  const commonBrand = await commonBrandData(chunkArray as any, chunkArray.length);
  // // console.log(commonBrand, "commonBrand");

  const commonBrandPath = await createPathWithPrefix('1_', filePath);

  await writeCSVFile(commonBrandPath, commonBrand);

  // // console.log(commonBrand);

  //--------------------------------------------------------------
 
}

/***
 * 
 *  reutrun array of object with common product and ratio
 */
  export async function commonProductData(chunkArray: any[], row_number: number ){
      let data: any = []
      const groupProductByName = _.groupBy(chunkArray, 'name')
      // get product avrage based on order number and row_number
      _.mapValues(groupProductByName, (productOrders: Item[]) => {
        // // console.log(productOrders, "productOrders");
        let productOrderQ = 0;
        _.forEach(productOrders, (productOrder: any) => {
          productOrderQ = Number(productOrder.quantity) + productOrderQ;
        });
        data.push([productOrders[0].name , productOrderQ / row_number])
      });
      return data
  }



  /**
   * 
   * 
   */
  export async function commonBrandData(chunkArray: any[], row_number: number ){

    // getBrandsOrdersCount 
    const getBrandsOrdersCount = _.countBy(chunkArray, 'brand');
    // // console.log(getBrandsOrdersCount , "brandsOrdersCount");


    const groupProductByBrand = _.groupBy(chunkArray, 'brand');
    // // console.log(groupProductByBrand, "groupProductByBrand");


     // get pouular brand for each group
     let arr:any = []
     Object.keys(groupProductByBrand).map(function (key) {
         arr.push({
             name: groupProductByBrand[key][0].name,
             brand: key,
             count: groupProductByBrand[key].length
         })
     });
    
     
     // // console.log(arr, "arr");

     let data = arr.filter((element: any, index: any) => {


      return arr.findIndex((item: any) => {
        // // console.log(item, "x");

           return item.name == element.name && item.count >= element.count;

      }) == index;

     });

      data = data.map((i: any)=>{

       return [i.name,i.brand]

      })

      return data

  }

