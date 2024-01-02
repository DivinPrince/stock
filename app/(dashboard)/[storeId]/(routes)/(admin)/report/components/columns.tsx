"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type ProductColumn = {
  month: string;
  sells: number;
  expences: string;
  income: string;
  profit: string;
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "month",
    header: "Month",
  },
  {
    accessorKey: "sells",
    header: "Sells",
  },
  {
    accessorKey: "expences",
    header: "Expences",
  },
  {
    accessorKey: "income",
    header: "Income",
  },
  {
    accessorKey: "profit",
    header: "Profit",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },

];
