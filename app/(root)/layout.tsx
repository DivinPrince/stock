import { redirect } from "next/navigation";
import { auth,clerkClient,currentUser } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId: process.env.ADMIN_ID
    },
  });
  
  if (store) {
    const sellers = await prismadb.seller.findMany({
      where:{
        storeId: store.id,
      }
    })
    if (sellers.find((s)=> s.userId === userId)) {
      redirect(`/${store.id}/seller`);
    } else if (userId === process.env.ADMIN_ID) {
      redirect(`/${store.id}`);
    } else {
      throw new Error("Not allowed on this site");
    }
  }
  
  return <>{children}</>;
}
