"use server"
import prismadb from "@/lib/prismadb";
import { Product,Sell } from "@prisma/client";

interface SellForm {
  qty: number;
  price: number;
  customer: string;
  customerNumber: string;
}

export async function myAction(storeId: any, id: any, name: any, sellerId: string, form: SellForm): Promise<string> {
  try {
    const existingProduct: Product | null = await prismadb.product.findUnique({
      where: { id },
    });
    let dbseller = await prismadb.seller.findFirst({
      where:{
        userId: sellerId
      }
    })
    if (!existingProduct) {
      return "No product found";
    }
    if (!dbseller && sellerId != process.env.ADMIN_ID) {
      return "Bad Request";
      
    }
    let seller = dbseller?.name
    if(sellerId === process.env.ADMIN_ID){
      seller = 'Admin'
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
        data: {
          sellItems: {
            create: {
              Qty: form.qty,
              name,
              price: selling,
              profit,
              customerName: form.customer,
              customerNumber: form.customerNumber,
              sellerName: seller as string,
              descriptio: existingProduct.description
            },
          },
        },
      });
    } else {
      await prismadb.sell.create({
        data: {storeId,
          sellItems: {
            create: {
              Qty: form.qty,
              customerName: form.customer,
              customerNumber: form.customerNumber,
              sellerName: seller as string,
              name,
              price: selling,
              profit,  
              descriptio: existingProduct.description
            },
          },},
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
