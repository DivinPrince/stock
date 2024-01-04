import { auth, clerkClient } from "@clerk/nextjs";
import React from "react";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/addseler";
import Navbar from "@/components/navbar";

const page = async ({ params }: { params: { storeId: string } }) => {
  const { userId, user } = auth();
  if (userId != process.env.ADMIN_ID) {
    redirect(`/${params.storeId}/seller`);
  }
  const users = await clerkClient.users.getUserList();
  return (
    <>
      {userId === process.env.ADMIN_ID && (
        <Navbar />
      )}
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <SettingsForm />
        </div>
      </div>
    </>
  );
};

export default page;
