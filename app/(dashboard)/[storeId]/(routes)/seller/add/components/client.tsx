"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";
import { ThemeToggle } from "@/components/theme-toggle";

import { SellerColumn, columns } from "./columns";
import { useAuth, UserButton } from "@clerk/nextjs";

interface SellersClientProps {
  data: SellerColumn[];
}

export const SellersClient: React.FC<SellersClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  const auth = useAuth()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sellers (${data.length})`}
          description="available sellers"
        />
        {auth.userId == "user_2ZFkhqgvmyN8kO9H7HyhS8FRYIN" && (
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        )}
      </div>
      <Separator />
      <DataTable searchKey="username" columns={columns} data={data} pageCount={10} />
    </>
  );
};
