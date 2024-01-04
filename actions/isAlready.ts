'use server'

import prismadb from "@/lib/prismadb";

export async function isAlready(storeId: any, name: any,pId = '') {
  if(!!pId){
    let product = await prismadb.product.findFirst({
      where: {
        storeId: storeId,
        name: name.toLowerCase().trimEnd(),
        NOT:{
          id: pId
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if(product) return true
    return false
  }else{
    let product = await prismadb.product.findFirst({
      where: {
        storeId: storeId,
        name: name.toLowerCase().trimEnd(),
  
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if(product) return true
    return false
  }

}