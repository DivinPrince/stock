'use server'

import prismadb from "@/lib/prismadb";

export async function isAlready(storeId: any, name: any,) {
  let product = await prismadb.product.findFirst({
    where: {
      storeId: storeId,
      name: name.toUpperCase(),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if(product) return true
  return false
}