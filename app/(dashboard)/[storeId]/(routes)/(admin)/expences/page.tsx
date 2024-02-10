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
  const expences = await prismadb.expence.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedexpences: ProductColumn[] = expences.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    money: formatter(Number(item.money)),
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-2 pt-6">
        <ProductsClient data={formattedexpences} />
      </div>
    </div>
  );
};

export default ProductsPage;
