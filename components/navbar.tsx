import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import StoreSwitcher from "@/components/store-switcher";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import prismadb from "@/lib/prismadb";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <>
      <div className="border-b w-full">
        <div className="hidden md:flex">
          <div className="flex h-16 items-center px-4 justify-between w-full">
            <StoreSwitcher items={stores} />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <ThemeToggle />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
        <div className="flex md:hidden justify-between items-center text-lg p-2">
          <Sheet key="left">
            <SheetTrigger>
              <Menu />
            </SheetTrigger>
            <SheetContent side="left">
              <StoreSwitcher items={stores} />
              <div className="flex flex-col items-start gap-2">
                <SheetClose asChild>
                  <MainNav className="flex flex-col gap-2 space-x-0 lg:space-x-0 items-start" />
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
