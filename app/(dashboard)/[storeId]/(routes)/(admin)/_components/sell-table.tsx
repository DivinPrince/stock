"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usechangephone, usechangeqty, useremameModal } from "@/hooks/use-customer-model";


import { SellItem } from "@prisma/client";

import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import { RenameCustomer } from "@/components/modals/customer-name";
import { useState } from "react";
import { CustomerPhone } from "@/components/modals/customer-number";
import { SellQty } from "@/components/modals/sell-qty";

const SellTable = ({ sell, total }: {
    sell: {
        id: string,
        storeId: string,
        createdAt: Date,
        updatedAt: Date,
        sellItems: SellItem[]
    }, total: any
}) => {
    const rename = useremameModal()
    const changephone = usechangephone()
    const changeQty = usechangeqty();


    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        qty: 0,
        id: ""
    })
    const ren = (name: string, id: string) => {
        setCustomer({
            name,
            phone: "",
            qty: 0,
            id
        })
        rename.onOpen()
    }
    const updatephone = (phone: string, id: string) => {
        setCustomer({
            name: "",
            phone: phone,
            qty: 0,
            id
        })
        changephone.onOpen()
    }
    const updateqty = (qty: number, id: string) => {
        setCustomer({
            name: "",
            phone: "",
            qty: qty,
            id
        })
        changeQty.onOpen()
    }
    return (
        <>
            <RenameCustomer name={customer.name} id={customer.id} />
            <CustomerPhone phone={customer.phone} id={customer.id} />
            <SellQty qty={customer.qty} id={customer.id} />

            <Card className="col-span-4">
                <CardContent className="pl-2">
                    <Table className="w-full">
                        <TableCaption>Product Sold on {format(new Date(sell.createdAt), "MM/dd/yyyy")}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>ProductName</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>SellerName</TableHead>
                                <TableHead>CustomerName</TableHead>
                                <TableHead>CustomerNumber</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>SoldAt</TableHead>
                            </TableRow>
                        </TableHeader>
                        {sell.sellItems.map((g: SellItem) => (
                            <TableRow key={g.id}>
                                <TableCell>
                                    {format(new Date(g.createdAt), "h:mm a")}
                                </TableCell>
                                <TableCell>{g.name}</TableCell>
                                <TableCell>{g.descriptio}</TableCell>
                                <TableCell>{g.sellerName}</TableCell>
                                <TableCell onClick={() => { ren(g.customerName, g.id) }} className="cursor-pointer">{g.customerName}</TableCell>
                                <TableCell onClick={() => { updatephone(g.customerNumber, g.id) }}>{g.customerNumber}</TableCell>
                                <TableCell onClick={() => { updateqty(g.Qty, g.id) }}>{g.Qty}</TableCell>
                                <TableCell>{formatter(g.price)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell className="font-medium">Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                                {formatter(Number(total))}
                            </TableCell>
                        </TableRow>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}

export default SellTable;