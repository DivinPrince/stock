"use client";
import { useParams, useRouter } from "next/navigation";
import { SellerColumn } from "./columns";
import { useState } from "react";
import { addSeller } from "@/actions/addSeller";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface CellActionProps {
  data: SellerColumn;
}
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const onSell = async () => {

    setLoading(true);
    setLoading(true)
    let ans = await addSeller(params.storeId,data.id);
    setLoading(false);
  };
  return (
    <>
      <Button type="submit" disabled={loading} onClick={onSell}>
        Add
      </Button>
    </>
  );
};
