"use client";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/lib/axiosInstance";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get("/api/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <div className="max-w-4xl mx-auto min-h-screen pt-8">
        <Table>
          <>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <img
                        src={user.photo}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell className="font-medium">
                      <Badge variant="default" className={"capitalize"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </>
        </Table>
      </div>
    </>
  );
};

export default Page;
