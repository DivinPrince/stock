"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";
import { ThemeToggle } from "@/components/theme-toggle";

import { ProductColumn, columns } from "./columns";
import { auth, useAuth,UserButton } from "@clerk/nextjs";

interface ProductsClientProps {
  data: ProductColumn[];
};

export const ProductsClient: React.FC<ProductsClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <> 
      <div className="flex items-center justify-between">
        <Heading title={`Mothly report`} description="search by index" />
      </div>
      <Separator />
      <DataTable searchKey="sells" columns={columns} data={data} pageCount={12}/>
      {/* <Heading title="API" description="API Calls for Products" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" /> */}
    </>
  );
};
