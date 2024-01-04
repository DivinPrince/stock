import prismadb from "@/lib/prismadb";

interface revenue {
  todayRevenue: number;
  sells: number;
}

export const getTodayRevenue = async (
  storeId: string
): Promise<revenue> => {
  const paidOrders = await prismadb.sell.findMany({
    where: {
      storeId,
    },
    include: {
      sellItems: true,
    },
  });

  let todayRevenue = 0;
  let sells = 0

  // Grouping the orders by month and summing the revenue
  for (const order of paidOrders) {
    if (order.createdAt.toDateString() === new Date().toDateString()) {
        const month = order.createdAt.getDay(); // 0 for Jan, 1 for Feb, ...
        let revenueForOrder = 0;
        
        for (const item of order.sellItems) {
          revenueForOrder += item.price;
          sells+=item.Qty
        }
    
        // Adding the revenue for this order to the respective month
        todayRevenue += revenueForOrder;
    }
  }
  return {
    todayRevenue,
    sells
  }
};
