"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { updateCustomer, updatePhone } from "@/actions/renameCustomer";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { usechangephone } from "@/hooks/use-customer-model";

const formSchema = z.object({
  phone: z.string().min(1),
});

export const CustomerPhone = ({phone,id}:{phone: string,id: string}) => {
  const customerPhone = usechangephone();

  const [ispending,startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: phone,
    },
  });
  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(()=>{
      updatePhone(id,values.phone).then(data=>{
        if(data.error){
          toast.error(data.error)
        }
        if(data.success)
        toast.success(data.success)
      }).finally(()=>{
        router.refresh()
        customerPhone.onClose()
      })
  })
  };

  return (
    <Modal
      title="Customer PhoneNumber"
      description="Add a new phoneNumber."
      isOpen={customerPhone.isOpen} 
      onClose={customerPhone.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input disabled={ispending} placeholder="New phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                  <Button disabled={ispending} variant="outline" onClick={customerPhone.onClose}>
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
