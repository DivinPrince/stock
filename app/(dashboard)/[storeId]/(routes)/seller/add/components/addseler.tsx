"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Loader2, Trash } from "lucide-react"
import { Store } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { useOrigin } from "@/hooks/use-origin"
import { addSeller } from "@/actions/addSeller"

const formSchema = z.object({
  name: z.string().min(2),
  id: z.string().min(2)
});

type SettingsFormValues = z.infer<typeof formSchema>

export const SettingsForm = () => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      let res = await addSeller(params.storeId, data.id,data.name)
      toast(res)
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      router.refresh()
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push('/');
      toast.success('Store deleted.');
    } catch (error: any) {
      toast.error('something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
     <div className="flex items-center justify-between">
        <Heading title="Seller setting" description="add sellers" />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Divin..." {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>sellerId</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="********" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Add
          </Button>
        </form>
      </Form> 
      {/* <Separator />
      <ApiAlert 
        title="NEXT_PUBLIC_API_URL" 
        variant="public" 
        description={`${origin}/api/${params.storeId}`}
      /> */}
    </>
  );
};
