import { clerkClient } from '@clerk/nextjs';
export const getUserList = async () => {
   return  await clerkClient.users.getUserList();
}