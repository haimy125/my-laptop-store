// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getServerCookie } from "@/app/components/GetServerCookie";
import { redirect } from "next/navigation";

interface UserDTO {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  enabled: boolean;
  roleId: number;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await getServerCookie("jwtToken"); // Get token from cookie
        if (!token) {
          redirect("/login"); // Redirect if no token
          return;
        }
        const response = await fetch("http://localhost:8080/api/user/current", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            redirect("/login"); // Token expired or invalid
          }
          throw new Error(
            `Failed to fetch profile: ${response.status} - ${response.statusText}`
          );
        }

        const data: UserDTO = await response.json();
        setUser(data);
      } catch (e: any) {
        setError(e.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Could not load profile data.</div>; // Handle unexpected null user
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
        <div>
          <p>
            <strong>Tên đăng nhập:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Tên:</strong> {user.firstName}
          </p>
          <p>
            <strong>Họ:</strong> {user.lastName}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {user.phoneNumber}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {user.address}
          </p>
          {/* Add other fields as needed */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
