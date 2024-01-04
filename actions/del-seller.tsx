"use server";

import prismadb from "@/lib/prismadb";

export async function dellSeller(id: any,) {

  try {


    const seller = await prismadb.seller.delete({
     where:{
        id,
     }
    });
    return "seller deleted"
  } catch (error) {
    console.log("====================================");
    console.log("");
    console.log("====================================");
    return "something went wrong";
  }
}
