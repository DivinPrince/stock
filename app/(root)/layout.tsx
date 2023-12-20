import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst();



  if (store) {
    if (userId != 'user_2YxJdWWmZfzFMbi192obx0KMBbY' && store.sellerIds.includes(userId)) {
      redirect(`/${store.id}/seller`);
    }else if (userId == 'user_2YxJdWWmZfzFMbi192obx0KMBbY'){
      redirect(`/${store.id}`);
    }else{
      throw new Error('Not allowed on this website?')
    }
  };

  return (
    <>
      {children}
    </>
  );
};