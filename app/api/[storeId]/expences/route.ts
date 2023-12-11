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

    const { money,description } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!money) {
      return new NextResponse("Name is required", { status: 400 });
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

    const expence = await prismadb.expence.create({
      data: {
        money: money,
        description: description,
        storeId: params.storeId,
      },
    });
  
    return NextResponse.json(expence);
  } catch (error) {
    console.log('[expenceS_POST]', error);
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

    const expence = await prismadb.expence.findMany({
      where: {
        storeId: params.storeId,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  
    return NextResponse.json(expence);
  } catch (error: any) {
    console.log('[expence]', error);
    return new NextResponse(`Internal error ${error.message}`, { status: 500 });
  }
};
