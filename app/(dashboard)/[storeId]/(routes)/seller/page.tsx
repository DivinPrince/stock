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

  const {userId} = auth()

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    stockQuantity: item.stockQuantity - item.sold,
    price: formatter(Number(item.price)),
    priceNum: item.price,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <>
    {userId === "user_2YxJdWWmZfzFMbi192obx0KMBbY" && (
      <Navbar />
    )}
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ProductsClient data={formattedProducts} />
        </div>
      </div>
    </>
  );
};

export default SellerPage;
