"use client";

import axios from "axios";
import {
  ArrowLeft,
  BadgeInfo,
  CircleDot,
  Copy,
  Edit,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ProductColumn } from "./columns";
import prismadb from "@/lib/prismadb";
import { myAction } from "@/actions/sell";
import { ro } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";

interface CellActionProps {
  data: ProductColumn;
}
const formSchema = z.object({
  price: z.coerce.number().min(1),
  qty: z.coerce.number().min(1),
});
type FormValues = z.infer<typeof formSchema>;
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, []);
  if (data.month == months[currentMonth]) {
    return (
      <>
        <div className="bg-green-100 text-green-500 flex gap-2 w-fit p-1 rounded-full">
          <CircleDot size={10} />
          <span>current</span>
        </div>
        <div ref={bottomRef} />
      </>
    );
  }
  ``;

  return <></>;
};
