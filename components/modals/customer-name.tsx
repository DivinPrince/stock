"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useremameModal } from "@/hooks/use-customer-model";
import { Button } from "@/components/ui/button";
import { updateCustomer } from "@/actions/renameCustomer";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1),
});

export const RenameCustomer = ({name,id}:{name: string,id: string}) => {
  const renameCustomer = useremameModal();

  const [ispending,startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
    },
  });
  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(()=>{
      updateCustomer(id,values.name).then(data=>{
        if(data.error){
          toast.error(data.error)
        }
        if(data.success)
        toast.success(data.success)
      }).finally(()=>{
        router.refresh()
        renameCustomer.onClose()
      })
  })
  };

  return (
    <Modal
      title="Customer Name"
      description="Add a new name."
      isOpen={renameCustomer.isOpen} 
      onClose={renameCustomer.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input disabled={ispending} placeholder="New Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                  <Button disabled={ispending} variant="outline" onClick={renameCustomer.onClose}>
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
