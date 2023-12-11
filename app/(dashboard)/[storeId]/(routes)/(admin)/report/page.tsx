import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { auth } from "@clerk/nextjs";

import Navbar from "@/components/navbar";

import { ProductsClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const SellerPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const sells = await prismadb.sell.findMany({
    include:{
      sellItems: true
    }
  });
  let income = 0;

  for (const order of sells) {
    for (const item of order.sellItems) {
      income += item.price;
    }
  }

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    sells: sells.length,
    income,
    stockQuantity: item.stockQuantity.toString(),
  }));

  const { userId, user } = auth();

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ProductsClient data={formattedProducts} />
        </div>
      </div>
    </>
  );
};

export default SellerPage;
