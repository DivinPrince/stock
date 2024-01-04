"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import Sold from "./sold"

export type ProductColumn = {
  id: string
  name: string;
  purchaseCost: string;
  price: string;
  sold: number;
  description: string
  stockQuantity: number;
  createdAt: string;
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Details",
  },
  {
    accessorKey: "stockQuantity",
    header: "StockQuantity",
  },
  {
    accessorKey: "purchaseCost",
    header: "PurchestCost(ikiranguzo)",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "sold",
    accessorKey: "sold",
    header: "Sold",
    cell: ({ row }) => <Sold data={row.original} />
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
