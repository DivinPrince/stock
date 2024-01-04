import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

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
      userId: "user_2YxJdWWmZfzFMbi192obx0KMBbY",
    },
  });

  if (store) {
    if (store.sellerIds.includes(userId)) {
      redirect(`/${store.id}/seller`);
    } else if (userId === "user_2YxJdWWmZfzFMbi192obx0KMBbY") {
      redirect(`/${store.id}`);
    } else {
      throw new Error("Not allowed on this site");
    }
  }

  return <>{children}</>;
}
