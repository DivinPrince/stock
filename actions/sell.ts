import prismadb from "@/lib/prismadb";
import { Product,Sell } from "@prisma/client";

interface SellForm {
  qty: number;
  price: number;
}

export async function myAction(storeId: number, id: number, name: string, form: SellForm): Promise<string> {
  try {
    const existingProduct: Product | null = await prismadb.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return "No product found";
    }

    if (existingProduct.stockQuantity - existingProduct.sold < form.qty) {
      return "Product out of stock";
    }

    const bought = existingProduct.purchaseCost * form.qty;
    const selling = form.price * form.qty;
    const profit = selling - bought;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySell: Sell | null = await prismadb.sell.findFirst({
      where: {
        createdAt: {
          gte: today,
          lt: new Date(today.getTime() + 86400000),
        },
      },
    });

    const sellData = {
      storeId,
      sellItems: {
        create: {
          Qty: form.qty,
          name,
          price: selling,
          profit,
        },
      },
    };

    if (todaySell) {
      await prismadb.sell.update({
        where: { id: todaySell.id },
        data: sellData,
      });
    } else {
      await prismadb.sell.create({
        data: sellData,
      });
    }

    await prismadb.product.update({
      where: { id },
      data: {
        sold: existingProduct.sold + form.qty,
      },
    });

    return "Success";
  } catch (error) {
    console.error("Error:", error);
    return "Something went wrong";
  } finally {
    await prismadb.$disconnect();
  }
}
