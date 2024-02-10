import { Package } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { getStockCount } from "@/actions/get-stock-count";
import { formatter } from "@/lib/utils";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import prismadb from "@/lib/prismadb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTodayRevenue } from "@/actions/get-today-revenue";
import Link from "next/link";
import { format } from "date-fns";
import { SellItem } from "@prisma/client";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const stockCount = await getStockCount(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);
  const totalRevenue = graphRevenue.reduce(
    (total, dataPoint) => total + dataPoint.total,
    0
  );
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7); // You can adjust the number of days as needed

  const sells = await prismadb.sell.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy:{
      createdAt: "desc"
    },
    include: {
      sellItems: true,
    },
  });

  const todayRevenue = await getTodayRevenue(params.storeId);
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const getTotal = (id: string)=>{
    let revenue = 0;
    if (sells) {
      let sel = sells.find((d)=> d.id === id)
      let revenueForOrder = 0;
        
        for (const item of sel?.sellItems!) {
          revenueForOrder += item.price;
        }
        // Adding the revenue for this order to the respective month
        revenue += revenueForOrder;  
    }
    return revenue
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Statements" description="All of your sells" />
        <Separator />
        {sells.map((sell) => (
          <>
            <Card className="col-span-4">
              <CardContent className="pl-2">
                <Table className="w-full">
                  <TableCaption>Product Sold on {format(new Date(sell.createdAt), "MM/dd/yyyy")}</TableCaption>
                  <TableHeader>
                    <TableRow className="flex justify-between items-center">
                      <TableHead className="text-right">Time</TableHead>
                      <TableHead>ProductName</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">SoldAt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sell.sellItems.map((g: SellItem) => (
                      <TableRow key={g.id} className="flex justify-between">
                        <TableCell>
                          {format(new Date(g.createdAt), "h:mm a")}
                        </TableCell>
                        <TableCell className="font-medium">{g.name}</TableCell>
                        <TableCell>{g.Qty}</TableCell>
                        <TableCell>{formatter(g.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <div className="w-full flex justify-between">
                    <TableCell className="font-medium">Total</TableCell>
                    <TableCell>
                    {formatter(Number(getTotal(sell.id)))}
                    </TableCell>
                  </div>
                </Table>
              </CardContent>
            </Card>
          </>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
