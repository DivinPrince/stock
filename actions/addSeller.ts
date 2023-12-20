"use server";

import prismadb from "@/lib/prismadb";

export async function addSeller(storeId: any, id: any) {

  try {
    const oldStore = await prismadb.store.findFirst({
      where: {
        id: storeId,
      },
    });
    let sellerIds = oldStore?.sellerIds
    sellerIds?.push(id)


    const store = await prismadb.store.update({
      where: {
        id: storeId,
      },
      data: {
        sellerIds
      },
    });
    return "seller added"
  } catch (error) {
    console.log("====================================");
    console.log("");
    console.log("====================================");
    return "something went wrong";
  }
}
