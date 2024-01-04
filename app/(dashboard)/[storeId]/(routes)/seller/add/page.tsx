import { auth, clerkClient } from "@clerk/nextjs";
import React from "react";
import { SellersClient } from "./components/client";
import { User } from "@clerk/nextjs/dist/types/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/addseler";

const page = async ({ params }: { params: { storeId: string } }) => {
  const { userId, user } = auth();
  if (userId != process.env.ADMIN_ID) {
    redirect(`/${params.storeId}/seller`);
  }
  const users = await clerkClient.users.getUserList();
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm />
      </div>
    </div>
  );
};

export default page;
