"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type ProductColumn = {
  id: string
  name: string;
  purchaseCost: string;
  price: string;
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
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
