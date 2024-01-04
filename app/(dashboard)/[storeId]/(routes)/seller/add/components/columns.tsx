"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type SellerColumn = {
  id: string;
  createdAt: number;
  profileImageUrl: string;
  imageUrl: string;
  username: string | null;
};

export const columns: ColumnDef<SellerColumn>[] = [
  {
    accessorKey: "username",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
  },
  {
    accessorKey: "profileImageUrl",
    header: "Image",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
