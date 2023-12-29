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
  const paidOrders = await prismadb.sell.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      sellItems: true,
    },
  });
  let TS:SellItem[] = []
  for (const order of paidOrders) {
    if (order.createdAt.toDateString() === new Date().toDateString()) {
      for (const items of order.sellItems) {
        TS.push(items) 
      }
    }
  }
  const todayRevenue = await getTodayRevenue(params.storeId);
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
      stockQuantity: {
        lt: 5,
      },
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
                  <Link href={`/${params.storeId}/products/${product.id}`}>
                    <div key={product.id} className="text-sm cursor-pointer">
                      {product.name}
                      <p className="text-muted-foreground">
                        reamining {product.stockQuantity}
                      </p>
                    </div>
                    <Separator className="my-2" />
                  </Link>
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
        <Card className="col-span-4">
          <CardHeader>
          </CardHeader>
          <CardContent className="pl-2">
            <Table className="w-full">
              <TableCaption>Products Sold Today.</TableCaption>
              <TableHeader>
                <TableRow className="flex justify-between">
                  <TableHead>ProductName</TableHead>
                  <TableHead className="text-right">SellingPrice</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TS.map((g) => (
                  <TableRow key={g.name} className="flex justify-between">
                    <TableCell className="font-medium">{g.name}</TableCell>
                    <TableCell>{formatter(g.price)}</TableCell>
                    <TableCell>{formatter(g.Qty)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <div className="w-full flex justify-between">
                <TableCell className="font-medium">Total</TableCell>
                <TableCell>{formatter(totalRevenue)}</TableCell>
              </div>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
