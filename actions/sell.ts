"use server";

import prismadb from "@/lib/prismadb";

export async function myAction(storeId: any, id: any, name: string, form: any) {
  try {
    const Oproduct = await prismadb.product.findUnique({
      where: {
        id,
      },
    });
    if (!Oproduct) {
      return "no product found";
    }
    if (Oproduct.stockQuantity >= form.qty) {
      let bought = Oproduct.purchaseCost * form.qty;
      let selling = form.price * form.qty;

      let profit = selling - bought;
      await prismadb.sell.create({
        data: {
          storeId: storeId,
          sellItems: {
            create: {
              Qty: form.qty,
              name: name,
              price: form.price * form.qty,
              profit,
            },
          },
        },
      });
      await prismadb.product.update({
        where: {
          id,
        },
        data: {
          sold: Oproduct?.sold + form.qty,
        },
      });
      return "success";
    }else{
      return "product outof stock";
    }
  } catch (error) {
    return "something went wrong";
  }
}
