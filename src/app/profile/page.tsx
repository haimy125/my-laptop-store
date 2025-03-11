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
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState<UserDTO | null>(null);

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
        setTempUser({ ...data }); // Initialize tempUser with fetched data
      } catch (e: any) {
        setError(e.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempUser((prev) => {
      if (prev) {
        return { ...prev, [name]: value };
      }
      return prev;
    });
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getServerCookie("jwtToken"); // Get token from cookie
      if (!token) {
        redirect("/login"); // Redirect if no token
        return;
      }

      if (!tempUser) {
        throw new Error("No user data to update.");
      }

      const response = await fetch(
        `http://localhost:8080/api/user/${tempUser.userId}/update`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tempUser),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update profile: ${response.status} - ${response.statusText}`
        );
      }

      const data: UserDTO = await response.json();
      setUser(data);
      setTempUser({ ...data });
      setIsEditing(false); // Exit editing mode after successful update
    } catch (e: any) {
      setError(e.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user || !tempUser) {
    return <div>Could not load profile data.</div>; // Handle unexpected null user
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
        {isEditing ? (
          // Edit Mode
          <div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="firstName"
              >
                Tên:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstName"
                type="text"
                name="firstName"
                value={tempUser.firstName ?? ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="lastName"
              >
                Họ:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lastName"
                type="text"
                name="lastName"
                value={tempUser.lastName ?? ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="phoneNumber"
              >
                Số điện thoại:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                value={tempUser.phoneNumber ?? ""}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="address"
              >
                Địa chỉ:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="address"
                type="text"
                name="address"
                value={tempUser.address ?? ""} // Sử dụng toán tử nullish coalescing
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Đang cập nhật..." : "Cập nhật"}
              </button>
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setTempUser({ ...user }); // Reset tempUser to original user data
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          // View Mode
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
            <div className="flex items-center justify-end mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
