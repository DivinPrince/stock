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
import { Store } from "@prisma/client";

const SellerNav = async () => {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    let sellers = await prismadb.seller.findMany({
        where:{
            userId
        },
        include:{
            store: true
        }
    })
    const stores = sellers.map(s=>s.store)

    return (
        <>
            <div className="border-b w-full">
                <div className="flex">
                    <div className="flex h-16 items-center px-4 justify-between w-full">
                        <StoreSwitcher items={stores} isAdmin={false} />
                        <div className="ml-auto flex items-center space-x-4">
                            <ThemeToggle />
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SellerNav;
