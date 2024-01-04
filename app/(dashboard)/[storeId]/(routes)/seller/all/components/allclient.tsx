'use client'
import { dellSeller } from "@/actions/del-seller";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Seller } from "@prisma/client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { format, formatDistance, subDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface All {
    data: Seller[];
}
export const AllClient: React.FC<All> = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const deleteSeller = async(id: string)=>{
        setLoading(true)
        try {
            let res = await dellSeller(id)
            toast.success(res)
        } catch (error) {
            console.log('====================================');
            toast.error('something went wrong')
            console.log(error);
            console.log('====================================');
        } finally{
            setLoading(false)
            router.refresh()
        }
    }
    return (
        <>
            <div>
                <Heading
                    title={`seller (${data.length})`}
                    description="All seller"
                />
                <Separator />
                <Card className="col-span-4">
                    <CardHeader></CardHeader>
                    <CardContent className="pl-2">
                        <Table className="w-full">
                            <TableCaption>All sellers</TableCaption>
                            <TableHeader>
                                <TableRow className="flex justify-between">
                                    <TableHead className="text-center">Name</TableHead>
                                    <TableHead>id</TableHead>
                                    <TableHead className="text-center">Joined At</TableHead>
                                    <TableHead className="text-center"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((seller)=>(
                                    <TableRow key={seller.id} className="flex justify-between">
                                    <TableCell>{seller.name}</TableCell>
                                    <TableCell className="font-medium">{seller.id}</TableCell>
                                    <TableCell>{format(new Date(seller.createdAt), "MMMM d, yyyy")}</TableCell>
                                    <TableCell><Button disabled={loading} onClick={()=>deleteSeller(seller.id)}>Delete {loading &&<Loader2 className="ml-2 h-4 w-4 animate-spin"/>}</Button></TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}