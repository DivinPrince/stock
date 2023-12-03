"use client";

import { Loader } from "@/components/ui/loader";
import { auth } from "@clerk/nextjs";

const Loading = () => {
  console.log('====================================');
  console.log(auth().user);
  console.log('====================================');
  return ( 
    <div className="flex h-full w-full items-center justify-center">
      <Loader />
    </div>
   );
}
 
export default Loading;