"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { updateQty } from "@/actions/renameCustomer";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { usechangeqty } from "@/hooks/use-customer-model";

const formSchema = z.object({
  qty: z.coerce.number().min(1),
});

export const SellQty = ({qty,id}:{qty: number,id: string}) => {
  const [isMouted, setIsMouted] = useState(false)
  useEffect(() => {
    setIsMouted(true)
  }, [])

  const changeQty = usechangeqty();

  const [ispending,startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qty: qty,
    },
  });
  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(()=>{
      updateQty(id,values.qty).then(data=>{
        if(data.error){
          toast.error(data.error)
        }
        if(data.success)
        toast.success(data.success)
      }).finally(()=>{
        router.refresh()
        changeQty.onClose()
      })
  })
  };

  return (
    <Modal
      title="Sell Quantity"
      description="Add a Updated Quantity."
      isOpen={changeQty.isOpen} 
      onClose={changeQty.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="qty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" disabled={ispending} placeholder="New Quantity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                  <Button disabled={ispending} variant="outline" onClick={changeQty.onClose}>
                    Cancel
                  </Button>
                  <Button disabled={ispending} type="submit">Continue</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
