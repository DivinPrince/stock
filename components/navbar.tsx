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
import { useRoutes } from "@/hooks/use-routes";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  const routes = useRoutes();

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
              <div className="flex flex-col items-start gap-2">
                <nav className={cn("flex items-center space-x-4 lg:space-x-6")}>
                  {routes.map((route) => (
                    <>
                      <SheetClose>
                        <Link
                          key={route.href}
                          href={route.href}
                          className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            route.active
                              ? "text-black dark:text-white"
                              : "text-muted-foreground"
                          )}
                        >
                          {route.label}
                        </Link>
                      </SheetClose>
                    </>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <StoreSwitcher items={stores} />
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
