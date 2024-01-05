"use server";

import prismadb from "@/lib/prismadb";

export async function addSeller(storeId: any, id: any,name: any) {

  try {


    const seller = await prismadb.seller.create({
      data: {
        storeId,
        userId: id,
        name,
      }
    });
    return "seller added"
  } catch (error) {
    console.log("====================================");
    console.log("");
    console.log("====================================");
    return "something went wrong";
  }
}
