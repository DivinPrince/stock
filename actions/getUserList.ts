import { clerkClient } from '@clerk/nextjs';
import React from 'react'

const getUserList = async () => {
   return  await clerkClient.users.getUserList();
}

export default getUserList
