"use client";

import axios from "axios";
import { ArrowLeft, Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { useSellerModal } from "../../../../../../hooks/use-category-modal";

interface CellActionProps {
  data: ProductColumn;
}
const formSchema = z.object({
  price: z.coerce.number().min(1),
  qty: z.coerce.number().min(1),
});
type FormValues = z.infer<typeof formSchema>;
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  let sellerM = useSellerModal();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {}, []);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${data.id}`);
      toast.success("Product deleted.");

      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
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
    let ans = await myAction(params.storeId, data.id, form);
    if (ans == "success") {
      toast.success("Product sold.");
      sellForm.reset();

      router.refresh();
    } else {
      toast.success(`${ans}`);
    }
    setLoading(false);
  };

  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <>
      <Button variant="ghost" onClick={toggleOpen}>
        <span className="sr-only">Open menu</span>
        Proceed
      </Button>
      {isOpen ? (
        <DropdownMenu defaultOpen>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Form {...sellForm}>
              <form
                onSubmit={sellForm.handleSubmit(onSell)}
                className="flex flex-col gap-2"
              >
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
                <Button type="submit" disabled={loading} onClick={toggleOpen}>
                  sell
                </Button>
              </form>
            </Form>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <></>
      )}
    </>
  );
};
