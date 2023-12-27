import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProductsClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ProductsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const { userId,user } = auth();
  
  if (userId != 'user_2YxJdWWmZfzFMbi192obx0KMBbY') {
    redirect(`/${params.storeId}/seller`);
  }
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    stockQuantity: item.stockQuantity,
    sold: item.sold,
    purchaseCost: formatter(Number(item.price)),
    price: formatter(Number(item.price)),
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
