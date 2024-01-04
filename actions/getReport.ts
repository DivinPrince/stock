import prismadb from "@/lib/prismadb";

interface ReportData {
  month: string;
  sells: number;
}

export const getGraphRevenue = async (storeId: string): Promise<ReportData[]> => {
  const paidOrders = await prismadb.sell.findMany({
    where: {
      storeId,
    },
    include: {
      sellItems: true
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  // Grouping the orders by month and summing the revenue
  for (const order of paidOrders) {
    const month = order.createdAt.getMonth(); // 0 for Jan, 1 for Feb, ...
    let revenueForOrder = 0;

    for (const item of order.sellItems) {
      revenueForOrder += item.price;
    }

    // Adding the revenue for this order to the respective month
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  // Converting the grouped data into the format expected by the graph
  const reportData: ReportData[] = [
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
  
  for (const month in monthlyRevenue) {
    reportData[parseInt(month)].sells = monthlyRevenue[parseInt(month)];
  }

  return reportData;
};
