import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name
      }
    });
  
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    await prismadb.expence.deleteMany({
      where: {
        storeId: params.storeId,
      }
    })
    await prismadb.product.deleteMany({
      where: {
        storeId: params.storeId,
      }
    })
    let s = await prismadb.sell.findMany({
      where: {
        storeId: params.storeId,
      }
    })

    for (const i of s) {
      await prismadb.sellItem.deleteMany({
        where:{
          sellId: i.id
        }
      })
    }
    await prismadb.sell.deleteMany({
      where: {
        storeId: params.storeId,
      }
    })
    const store = await prismadb.store.delete({
      where: {
        id: params.storeId,
      }
    });
  
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse(`Internal error ${error}`, { status: 500 });
  }
};
