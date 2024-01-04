import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, price, stockQuantity,description,purchaseCost } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!stockQuantity) {
      return new NextResponse("stockQuantity id is required", { status: 400 });
    }
    if (!description) {
      return new NextResponse("description id is required", { status: 400 });
    }
    if (!purchaseCost) {
      return new NextResponse("purchaseCost id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    let updatedName = name.toLowerCase().trimEnd()

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }
    
    const product = await prismadb.product.create({
      data: {
        name: updatedName,
        description: description,
        purchaseCost,
        price,
        stockQuantity,
        storeId: params.storeId,
      },
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse(`Internal error ${error}`, { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url)

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  
    return NextResponse.json(products);
  } catch (error: any) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse(`Internal error ${error.message}`, { status: 500 });
  }
};
