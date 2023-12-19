"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type ProductColumn = {
  id: string
  description: string;
  money: string;
  createdAt: string;
  name: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Owner",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "money",
    header: "Money",
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
