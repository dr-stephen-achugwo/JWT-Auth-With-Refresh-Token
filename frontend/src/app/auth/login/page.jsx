"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../../context/authContext";

const Page = () => {
  const [isShow, setIsShow] = useState(false);
  const { loginUser } = useAuth();
  const schema = z.object({
    email: z.string().email("Email tidak valid!"),
    password: z.string().min(6, "Password minimal 6 karakter!"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleEye = () => {
    setIsShow((prev) => !prev);
  };

  const onSubmit = (data) => {
    loginUser(data);
    reset();
  };
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/3 flex flex-col gap-3 items-center"
      >
        <h1 className="font-bold text-2xl">Login to your account</h1>
        <div className="w-full flex flex-col">
          <div className="mb-3 flex flex-col gap-3">
            <label htmlFor="email">Email</label>
            <Input
              {...register("email")}
              type="email"
              id="email"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-3 flex flex-col gap-3">
            <label htmlFor="password">Password</label>
            <div className="relative flex items-center">
              <p
                className="absolute right-2 cursor-pointer"
                onClick={handleEye}
              >
                {isShow ? (
                  <EyeSlashIcon className="w-7 h-7 text-neutral-600" />
                ) : (
                  <EyeIcon className="w-7 h-7 text-neutral-600" />
                )}
              </p>
              <Input
                {...register("password")}
                type={isShow ? "text" : "password"}
                id="password"
                placeholder="Password"
              />
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit">Login</Button>
        </div>

        <p>
          You dont have account?
          <Link href={"/auth/register"}>Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Page;
