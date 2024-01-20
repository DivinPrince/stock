"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useRoutes } from "@/hooks/use-routes";
import { SheetClose } from "./ui/sheet";
import { FC } from "react";
import { buttonVariants } from "./ui/button";
interface MainNavProps {
  className?: string;
  closer?: typeof SheetClose;
}
export const MainNav: FC<MainNavProps> = ({ className, closer }) => {
  const routes = useRoutes();
  const Closer = closer;
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <>
          {Closer ? (
            <Closer asChild>
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "w-full",
                  route.active
                    ? buttonVariants({variant: 'secondary'})
                    : buttonVariants({variant: 'ghost'}),
                    buttonVariants({variant: 'ghost'})
                )}
                >
                {route.label}
              </Link>
            </Closer>
          ) : (
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
          )}
        </>
      ))}
    </nav>
  );
};
