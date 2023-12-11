import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { expenceId: string } }
) {
  try {
    if (!params.expenceId) {
      return new NextResponse("expence id is required", { status: 400 });
    }

    const expence = await prismadb.expence.findUnique({
      where: {
        id: params.expenceId
      },
    });
  
    return NextResponse.json(expence);
  } catch (error) {
    console.log('[expence_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { expenceId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.expenceId) {
      return new NextResponse("expence id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const expence = await prismadb.expence.delete({
      where: {
        id: params.expenceId
      },
    });
  
    return NextResponse.json(expence);
  } catch (error) {
    console.log('[expence_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { expenceId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, price, stockQuantity,description } = body;

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

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product = await prismadb.product.update({
      where: {
        id: params.expenceId
      },
      data: {
        name,
        price,
        description,
        stockQuantity
      },
    });

  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
