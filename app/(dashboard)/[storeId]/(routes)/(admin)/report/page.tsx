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
  const currentYear = currentDate.getFullYear()

  const sells = await prismadb.sell.findMany({
    where:{
      storeId: params.storeId,
  }
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

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function getexpencesByMonth(month:number) {  
    let sum = 0
    for (const expence of expences) {
      if (expence.createdAt.getMonth() + 1 === month && expence.createdAt.getFullYear() === currentYear) {
        sum += expence.money
      }
    }
    for (const p of products) {
      if(p.createdAt.getMonth() + 1 === month && p.createdAt.getFullYear() === currentYear){
        sum += p.purchaseCost*p.stockQuantity
      }
      
    }
    return sum
  }
  function getIncomeByMonth(month:number){
    let income = 0;
    for (const order of sells) {
      if (order.createdAt.getMonth() + 1 === month && order.createdAt.getFullYear() === currentYear) {
        for (const item of order.sellItems) {
          income += item.price;
        }
      }
    }
    return income
  }
  function getSellsByMonth(month:number) {
    let sellsCount = 0;
    for (const order of sells) {
      if (order.createdAt.getMonth() + 1 === month && order.createdAt.getFullYear() === currentYear) {
        sellsCount++
      }
    }
    return sellsCount
    
  }
  for (const order of expences) {
    if (order.createdAt.getMonth() + 1 === currentMonth && order.createdAt.getFullYear() === currentYear) {
      expencecount += 1;
    }
  }
  const formattedProducts: ProductColumn[] = months.map((item, index)=>({
    month: item,
    expences: getexpencesByMonth(index+1) == 0 ? 'None' : formatter(getexpencesByMonth(index+1)),
    income: getIncomeByMonth(index+1) == 0 ? 'None' : formatter(getIncomeByMonth(index+1)),
    profit: (getIncomeByMonth(index+1)-getexpencesByMonth(index+1)) == 0 ? 'None' : formatter(getIncomeByMonth(index+1)-getexpencesByMonth(index+1)),
    sells: getSellsByMonth(index+1)
  }));


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
