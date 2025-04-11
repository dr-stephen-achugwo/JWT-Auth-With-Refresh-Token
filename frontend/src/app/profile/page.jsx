"use client";
import React, { useEffect } from "react";
import { useAuth } from "../../../context/authContext";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const Page = () => {
  const { user, setUser, loading } = useAuth();
  const Schema = z.object({
    name: z.string().min(3, "Nama minimal 3 karakter!"),
    // email: z.string().email("Email tidak valid!"),
    // photo: z
    //   .union([z.string().optional(), z.array(z.instanceof(FileList))])
    //   .optional()
    //   .refine(
    //     (files) =>
    //       !files ||
    //       files.length === 0 ||
    //       ["image/jpeg", "image/png", "image/jpg"].includes(files[0].type),
    //     "Hanya format jpeg, jpg, dan png yang diizinkan!"
    //   )
    //   .optional(),

    // password: z.string().min(6, "Password minimal 6 karakter!"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(Schema),
  });

  useEffect(() => {
    if (user) {
      // setValue("email", user.email);
      setValue("name", user.name);
    }
  }, [user]);

  // const [preview, setPreview] = useState(null);
  // const handleFilePhoto = (e) => {
  //   const file = e.target.files[0];

  //   if (file) {
  //     setPreview(URL.createObjectURL(file));
  //     setValue("photo", e.target.files);
  //   }
  // };

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.put("/api/users/profile", data);
      toast.success(response.data.message);

      setUser((prev) => ({
        ...prev,
        name: data.name,
      }));
    } catch (error) {
      console.log(error);
      // toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-col items-center justify-start mt-4 min-h-screen w-1/2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 justify-start items-start w-1/2"
          >
            <h1 className="text-4xl font-bold">Profile</h1>
            {loading ? (
              <p className="text-2xl">Loading...</p>
            ) : (
              <>
                {/* <label htmlFor="photo">
                  {preview ? (
                    <img
                      src={preview}
                      alt={user?.name}
                      className="w-14 h-14 rounded-full cursor-pointer"
                    />
                  ) : (
                    <img
                      src={user?.photo}
                      alt={user?.name}
                      className="w-14 h-14 rounded-full cursor-pointer"
                    />
                  )}
                  <Input
                    id="photo"
                    accept="image/png, image/jpeg"
                    {...register("photo")}
                    className="hidden"
                    placeholder="Photo"
                    type="file"
                    onChange={handleFilePhoto}
                  />
                </label> */}

                {/* {errors.photo && (
                  <p className="text-red-500">{errors.photo.message}</p>
                )} */}
                <Input {...register("name")} placeholder="Name" type="text" />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}

                {/* <Input
                  {...register("email")}
                  placeholder="Email"
                  type="email"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )} */}

                <Button type="submit" className="btn btn-primary">
                  Update
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
