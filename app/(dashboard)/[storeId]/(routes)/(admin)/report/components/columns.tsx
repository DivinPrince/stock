"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type ProductColumn = {
  sells: number;
  stockQuantity: string;
  income: string;
  expences: number;
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "sells",
    header: "Sells",
  },
  {
    accessorKey: "income",
    header: "Income",
  },
  {
    accessorKey: "stockQuantity",
    header: "StockQuantity",
  },
  {
    accessorKey: "expences",
    header: "Expences",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
