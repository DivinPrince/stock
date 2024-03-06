"use server";

import prismadb from "@/lib/prismadb";

export const updateCustomer = async (id: string, name: string) => {
  if (!id) {
    return {
      error: "id requiered",
    };
  }
  if (!name) {
    return {
      error: "name requiered",
    };
  }
  await prismadb.sellItem.update({
    where: {
      id: id,
    },
    data: {
      customerName: name,
    },
  });
  return {
    success: "Sell Updated",
  };
};
export const updatePhone = async (id: string, phone: string) => {
  if (!id) {
    return {
      error: "id requiered",
    };
  }
  if (!phone) {
    return {
      error: "phone requiered",
    };
  }
  await prismadb.sellItem.update({
    where: {
      id: id,
    },
    data: {
      customerNumber: phone,
    },
  });
  return {
    success: "Sell Updated",
  };
};
export const updateQty = async (id: string, qty: number) => {
  if (!id) {
    return {
      error: "id requiered",
    };
  }
  if (!qty) {
    return {
      error: "qty requiered",
    };
  }
  await prismadb.sellItem.update({
    where: {
      id: id,
    },
    data: {
      Qty: qty,
    },
  });
  return {
    success: "Sell Updated",
  };
};
