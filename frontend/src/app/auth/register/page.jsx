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
  const { registerUser } = useAuth();
  const [isShow, setIsShow] = useState({
    password: false,
    confirmPassword: false,
  });

  const schema = z
    .object({
      name: z.string().min(3, "Nama minimal 3 karakter!"),
      email: z.string().email("Email tidak valid!"),
      password: z.string().min(6, "Password minimal 6 karakter!"),
      confirmPassword: z.string().min(6, "ConfirmPassword minimal 6 karakter!"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleEye = (field) => {
    setIsShow((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data) => {
    await registerUser(data);
    reset();
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/3 flex flex-col gap-3 items-center"
      >
        <h1 className="font-bold text-2xl">Register your account</h1>
        <div className="w-full flex flex-col">
          <div className="mb-3 flex flex-col gap-3">
            <label htmlFor="name">Nama</label>
            <Input
              {...register("name")}
              type="text"
              id="name"
              placeholder="Nama"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
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
                onClick={() => handleEye("password")}
              >
                {isShow.password ? (
                  <EyeSlashIcon className="w-7 h-7 text-neutral-600" />
                ) : (
                  <EyeIcon className="w-7 h-7 text-neutral-600" />
                )}
              </p>
              <Input
                {...register("password")}
                type={isShow.password ? "text" : "password"}
                id="password"
                placeholder="Password"
              />
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-3 flex flex-col gap-3">
            <label htmlFor="confirmPassword">Konfirmasi Password</label>

            <div className="relative flex items-center">
              <p
                className="absolute right-2 cursor-pointer"
                onClick={() => handleEye("confirmPassword")}
              >
                {isShow.confirmPassword ? (
                  <EyeSlashIcon className="w-7 h-7 text-neutral-600" />
                ) : (
                  <EyeIcon className="w-7 h-7 text-neutral-600" />
                )}
              </p>

              <Input
                {...register("confirmPassword")}
                type={isShow.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Konfirmasi Password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit">Register</Button>
        </div>

        <p>
          Already have account?
          <Link href={"/auth/login"}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Page;
