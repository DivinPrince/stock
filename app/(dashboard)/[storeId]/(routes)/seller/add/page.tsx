import { clerkClient } from '@clerk/nextjs';
import React from 'react'
import { SellersClient } from './components/client';
import { User } from '@clerk/nextjs/dist/types/server';

const page = async () => {

    const users = await clerkClient.users.getUserList();
  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <SellersClient data={users} />
        </div>
      </div>
  )
}

export default page
