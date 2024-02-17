"use client";

import axios from "axios";
import { ArrowLeft, Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ProductColumn } from "./columns";
import prismadb from "@/lib/prismadb";
import { myAction } from "@/actions/sell";
import { ro } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { DropdownMenuItemProps } from "@radix-ui/react-dropdown-menu";
import { useAuth } from "@clerk/nextjs";

interface CellActionProps {
  data: ProductColumn;
}
const formSchema = z.object({
  price: z.coerce.number().min(1),
  qty: z.coerce.number().min(1),
  customer: z.string().min(1),
  customerNumber: z.string().min(1),
});
type FormValues = z.infer<typeof formSchema>;
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const {userId} = useAuth()

  const g = useRef<HTMLDivElement>(null);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${data.id}`);
      toast.success("Product deleted.");

    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  const defaultValues = {
    price: data.priceNum,
    qty: 1,
  };

  const sellForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSell = async (form: FormValues) => {
    setLoading(true);
    let loader = toast.loading("selling");
    let ans = await myAction(params.storeId, data.id,data.name,userId!,form,);
    if (ans == "success") {
      g?.current?.click();
      toast.success("Product sold.");
      sellForm.reset();

    } else {
      toast.success(`${ans}`);
    }
    toast.dismiss(loader);
    setLoading(false);
      router.refresh();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <span className="sr-only">Open menu</span>
            Proceed
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Form {...sellForm}>
            <form
              onSubmit={sellForm.handleSubmit(onSell)}
              className="flex flex-col gap-2"
            >
              <FormField
                control={sellForm.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Customer Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sellForm.control}
                name="customerNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Customer Phone Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sellForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sellForm.control}
                name="qty"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Quantity"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DropdownMenuItem className="hidden">
                <div ref={g}></div>
              </DropdownMenuItem>
              <Button type="submit" disabled={loading}>
                sell
              </Button>
            </form>
          </Form>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
