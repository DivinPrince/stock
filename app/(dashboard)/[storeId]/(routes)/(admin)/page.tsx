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
    orderBy: {
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
  const getTotal = (id: string) => {
    let revenue = 0;
    if (sells) {
      let sel = sells.find((d) => d.id === id)
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
      <div className="flex-1 space-y-4 p-2 pt-6">
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
          <Card>
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
                          <p className="text-red-500">
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
          </Card>

        </div>
        {sells.map((sell) => (
          <>
            <Card className="col-span-4">
              <CardContent className="pl-2">
                <Table className="w-full">
                  <TableCaption>Product Sold on {format(new Date(sell.createdAt), "MM/dd/yyyy")}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>ProductName</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>SellerName</TableHead>
                      <TableHead>CustomerName</TableHead>
                      <TableHead>CustomerNumber</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>SoldAt</TableHead>
                    </TableRow>
                  </TableHeader>
                    {sell.sellItems.map((g: SellItem) => (
                      <TableRow key={g.id}>
                        <TableCell>
                          {format(new Date(g.createdAt), "h:mm a")}
                        </TableCell>
                        <TableCell>{g.name}</TableCell>
                        <TableCell>{g.descriptio}</TableCell>
                        <TableCell>{g.sellerName}</TableCell>
                        <TableCell>{g.customerName}</TableCell>
                        <TableCell>{g.customerNumber}</TableCell>
                        <TableCell>{g.Qty}</TableCell>
                        <TableCell>{formatter(g.price)}</TableCell>
                      </TableRow>
                    ))}
                  <div className="">
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
