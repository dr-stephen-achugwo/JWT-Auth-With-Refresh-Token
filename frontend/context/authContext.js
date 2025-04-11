"use client";
import { usePathname, useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const registerUser = async (data) => {
    try {
      const response = await axiosInstance.post("/api/auth/register", data);
      toast.success(response.data.message);
      router.push("/auth/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const loginUser = async (data) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", data);

      console.log(response.data);
      toast.success(response.data.message);
      router.push("/dashboard");
      await getMe();
    } catch (error) {
      console.log(error);
      toast.error("Login gagal!, terjadi kesalahan, coba lagi!");
    }
  };

  const logout = async () => {
    try {
      const response = axiosInstance.post("/api/auth/logout");
      await toast.promise(response, {
        loading: "Loading...",
        success: "Logout berhasil!",
        error: "Logout gagal!",
      });

      setUser(null);
      router.push("/");
    } catch (error) {
      console.log(error, "Logout gagal");
      toast.error("Logout gagal!, terjadi kesalahan, coba lagi!");
    }
  };

  const getMe = async () => {
    try {
      const response = await axiosInstance.get("/api/auth/me");
      setUser(response.data.user);
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // const refreshTokenResponse = () => {
  //   const responseInterceptor = axiosInstance.interceptors.response.use(
  //     (response) => response,
  //     async (error) => {
  //       const originalRequest = error.config;
  //       if (error.response?.status === 401 && !originalRequest._retry) {
  //         originalRequest._retry = true;
  //         try {
  //           await axiosInstance.get("/api/auth/refresh-token");

  //           return axiosInstance(originalRequest);
  //         } catch (err) {
  //           console.error("Error refresh token:", err);
  //           return Promise.reject(err);
  //         }
  //       }
  //       return Promise.reject(error);
  //     }
  //   );

  //   return () => {
  //     axiosInstance.interceptors.response.eject(responseInterceptor);
  //   };
  // };

  const pathname = usePathname();

  useEffect(() => {
    if (!["/", "/auth/login", "/auth/register"].includes(pathname)) {
      getMe();
    }
  }, []);

  // useLayoutEffect(() => {
  //   refreshTokenResponse();
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        registerUser,
        loginUser,
        user,
        setUser,
        loading,
        logout,
        getMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
