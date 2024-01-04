import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import Navbar from '@/components/navbar'

import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
}

export default async function SetupLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId, user } = auth();

  if (userId != process.env.ADMIN_ID) {
    redirect(`/${params.storeId}/seller`);
  }

  return (<>
    <Navbar />
    {children}
  </>);
}
