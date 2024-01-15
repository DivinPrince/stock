import { CreditCard, DollarSign, Package } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { getStockCount } from "@/actions/get-stock-count";
import { formatter } from "@/lib/utils";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import prismadb from "@/lib/prismadb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTodayRevenue } from "@/actions/get-today-revenue";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { Sell, SellItem } from "@prisma/client";
import { Key, ReactElement, JSXElementConstructor, ReactNode, PromiseLikeOfReactNode, ReactPortal } from "react";

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

  const paidOrders = await prismadb.sell.findMany({
    where: {
      storeId: params.storeId,
      createdAt: {
        gte: sevenDaysAgo,
        lt: today,
      },
    },
    include: {
      sellItems: true,
    },
  });
  let TS: SellItem[] = [];
  let d: Sell[] = [];
  for (const order of paidOrders) {
    if (order.createdAt.toDateString() === new Date().toDateString()) {
      d.push(order);
      for (const items of order.sellItems) {
        TS.push(items);
      }
    }
  }
  const groupedOrders: Record<string, any> = {};
  paidOrders.forEach((order) => {
    const dateKey = format(new Date(order.createdAt), "MM/dd/yyyy");
    if (!groupedOrders[dateKey]) {
      groupedOrders[dateKey] = [];
    }
    order.sellItems
    groupedOrders[dateKey].push(order.sellItems);
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

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="flex flex-wrap gap-2">
          <Card className="flex-1">
            <Link href={`/${params.storeId}/products`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Products In Stock
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stockCount}</div>
              </CardContent>
            </Link>
          </Card>
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today&lsquo;s sells
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayRevenue.sells}</div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today&lsquo;s income
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter(Number(todayRevenue.todayRevenue))}
              </div>
            </CardContent>
          </Card>
          <ScrollArea className="h-40 w-48 rounded-md border flex-1">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">
                About to finish
              </h4>
              {products.map((product) => (
                <>
                  {product.stockQuantity - product.sold < 5 && (
                    <Link href={`/${params.storeId}/products/${product.id}`}>
                      <div key={product.id} className="text-sm cursor-pointer">
                        {product.name}
                        <p className="text-muted-foreground">
                          reamining {product.stockQuantity - product.sold}
                        </p>
                      </div>
                      <Separator className="my-2" />
                    </Link>
                  )}
                </>
              ))}
              {!products.length ? (
                <p className="text-muted-foreground">No Results</p>
              ) : (
                <></>
              )}
            </div>
          </ScrollArea>
        </div>
        {Object.entries(groupedOrders).map(([date, orders]) => (
          <>
              <Card className="col-span-4">
                <CardHeader></CardHeader>
                <CardContent className="pl-2">
                  <Table className="w-full">
                    <TableCaption>Product Sold on {date}</TableCaption>
                    <TableHeader>
                      <TableRow className="flex justify-between">
                        <TableHead className="text-right">Time</TableHead>
                        <TableHead>ProductName</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">SoldAt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((g: SellItem) => (
                        <TableRow key={g.id} className="flex justify-between">
                          <TableCell>
                            {format(new Date(g.createdAt), "h:mm a")}
                          </TableCell>
                          <TableCell className="font-medium">
                            {g.name}
                          </TableCell>
                          <TableCell>{g.Qty}</TableCell>
                          <TableCell>{formatter(g.price)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <div className="w-full flex justify-between">
                      <TableCell className="font-medium">Total</TableCell>
                      <TableCell>
                        {formatter(Number(todayRevenue.todayRevenue))}
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
