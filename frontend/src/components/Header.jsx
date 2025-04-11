"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "@heroicons/react/24/outline";
import { buttonVariants } from "./ui/button";
import { useAuth } from "../../context/authContext";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";
const Header = () => {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="flex justify-between items-center p-4 ">
      <Link
        href={
          ["/auth/login", "/auth/register", "/"].includes(pathname)
            ? "/"
            : "/dashboard"
        }
        className="font-bold text-xl"
      >
        Mern Auth
      </Link>
      <ul>
        <li className="flex gap-3 items-center font-semibold">
          {["/", "/auth/login", "/auth/register"].includes(pathname) ? (
            <>
              <Link
                href={"/auth/login"}
                className={buttonVariants({ variant: "outline" })}
              >
                Login
              </Link>
              <Link
                href={"/auth/register"}
                className={buttonVariants({ variant: "default" })}
              >
                Register
              </Link>
            </>
          ) : loading ? (
            <SkeletonDemo />
          ) : (
            user && (
              <>
                <Link href={"/dashboard"}>Dashboard</Link>
                {user.role === "admin" && <Link href={"/users"}>Users</Link>}
                <DropdownList />
              </>
            )
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Header;

const DropdownList = () => {
  const { logout } = useAuth();
  const handleSubmit = async () => {
    logout();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full bg-neutral-200 p-3">
        <UserIcon width={20} height={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={"/profile"}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button type="button" onClick={handleSubmit}>
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const SkeletonDemo = () => {
  return (
    <div className="flex items-center space-x-3">
      <Skeleton className="h-6 w-[50px]" />
      <Skeleton className="h-11 w-11 rounded-full" />
    </div>
  );
};
