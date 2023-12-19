"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useRoutes } from "@/hooks/use-routes";
import React, { ReactNode } from "react";
interface Props {
  className: string;
  element?: any;
}
export const MainNav: React.FC<Props> = ({ className, element }) => {
  const Element = element;

  const routes = useRoutes();
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <>
          <Element>
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
          </Element>
        </>
      ))}
    </nav>
  );
};
