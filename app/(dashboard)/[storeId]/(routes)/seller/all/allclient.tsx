'use client'
import { dellSeller } from "@/actions/del-seller";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Seller } from "@prisma/client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { formatDistance, subDays } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";

interface All {
    data: Seller[];
}
export const AllClient: React.FC<All> = ({ data }) => {
    const [loading, setLoading] = useState(false);
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
        }
    }
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`seller (${data.length})`}
                    description="All seller"
                />
                <Separator />
                <Card className="col-span-4">
                    <CardHeader></CardHeader>
                    <CardContent className="pl-2">
                        <Table className="w-full">
                            <TableCaption>Products Sold Today.</TableCaption>
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
                                    <TableCell>{formatDistance(subDays(seller.createdAt, 3), new Date(), { addSuffix: true })}</TableCell>
                                    <TableCell><Button onClick={()=>deleteSeller(seller.id)}>Delete</Button></TableCell>
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