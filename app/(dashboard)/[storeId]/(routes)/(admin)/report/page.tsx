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

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  const sells = await prismadb.sell.findMany({
    include: {
      sellItems: true,
    },
  });
  const expences = await prismadb.expence.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  let expencecount = 0;

  let income = 0;
  const reportData = [
    { month: "Jan", sells: 0 },
    { month: "Feb", sells: 0 },
    { month: "Mar", sells: 0 },
    { month: "Apr", sells: 0 },
    { month: "May", sells: 0 },
    { month: "Jun", sells: 0 },
    { month: "Jul", sells: 0 },
    { month: "Aug", sells: 0 },
    { month: "Sep", sells: 0 },
    { month: "Oct", sells: 0 },
    { month: "Nov", sells: 0 },
    { month: "Dec", sells: 0 },
  ];
  for (const order of sells) {
    if (order.createdAt.getMonth() + 1 === currentMonth) {
      for (const item of order.sellItems) {
        income += item.price;
      }
    }
  }
  for (const order of expences) {
    if (order.createdAt.getMonth() + 1 === currentMonth) {
      expencecount += 1;
    }
  }
  let 
  const formattedProducts: ProductColumn[] = months.map((item, index)=>({
    month: item,
    expences: expences.
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
