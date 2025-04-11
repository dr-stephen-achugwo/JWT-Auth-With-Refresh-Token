"use client";
import { useAuth } from "../../../context/authContext";
const Page = () => {
  const { user, loading } = useAuth();

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col gap-3 justify-start-items-center">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          {loading ? (
            <p className="text-2xl">Loading...</p>
          ) : (
            <>
              <img
                src={user?.photo}
                alt={user?.name}
                className="w-14 h-14 rounded-full cursor-pointer"
              />
              <p className="text-2xl">
                Halo, {user?.name} | {user?.email}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
