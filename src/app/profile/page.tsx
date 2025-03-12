// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getServerCookie } from "@/app/components/GetServerCookie";
import { redirect } from "next/navigation";
import { FaPhone, FaEnvelope, FaUser, FaAddressCard } from "react-icons/fa"; // Thêm các icon

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

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
    setSuccessMessage(null);

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
      setSuccessMessage("Cập nhật thông tin thành công!");
    } catch (e: any) {
      setError(e.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Tạo avatar ký tự
  const getCharacterAvatar = (firstName: string, lastName: string) => {
    const firstLetter = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastLetter = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstLetter}${lastLetter}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100">
        <div className="text-red-600 font-bold">Error: {error}</div>
      </div>
    );
  }

  if (!user || !tempUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        Could not load profile data.
      </div>
    ); // Handle unexpected null user
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Bỏ header màu xanh
        <div className="bg-blue-600 h-24"></div>
        */}

        <div className="px-6 py-8">
          {/* Avatar */}
          <div className="relative flex justify-center">
            {/* Sử dụng avatar ký tự */}
            <div className="rounded-full border-4 border-gray-300 w-32 h-32 flex items-center justify-center text-3xl font-semibold bg-gray-200 text-gray-700 uppercase">
              {getCharacterAvatar(user.firstName, user.lastName)}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
              Thông tin cá nhân
            </h2>

            {successMessage && (
              <div className="bg-green-200 text-green-800 py-2 px-4 rounded mb-4">
                {successMessage}
              </div>
            )}

            {isEditing ? (
              // Edit Mode
              <form>
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
                <div className="flex items-center justify-end">
                  <button
                    className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                    type="button"
                    onClick={handleUpdate}
                    disabled={loading}
                  >
                    {loading ? "Đang cập nhật..." : "Cập nhật"}
                  </button>
                  <button
                    className="cursor-pointer ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setTempUser({ ...user });
                      setError(null); // Clear any previous errors
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            ) : (
              // View Mode
              <div>
                <div className="mb-3 flex items-center">
                  <FaUser className="mr-2 text-gray-500" />
                  <strong className="font-medium text-gray-700">
                    Tên đăng nhập:
                  </strong>{" "}
                  {user.username}
                </div>
                <div className="mb-3 flex items-center">
                  <FaEnvelope className="mr-2 text-gray-500" />
                  <strong className="font-medium text-gray-700">
                    Email:
                  </strong>{" "}
                  {user.email}
                </div>
                <div className="mb-3 flex items-center">
                  <FaUser className="mr-2 text-gray-500" />
                  <strong className="font-medium text-gray-700">
                    Tên:
                  </strong>{" "}
                  {user.firstName}
                </div>
                <div className="mb-3 flex items-center">
                  <FaUser className="mr-2 text-gray-500" />
                  <strong className="font-medium text-gray-700">
                    Họ:
                  </strong>{" "}
                  {user.lastName}
                </div>
                <div className="mb-3 flex items-center">
                  <FaPhone className="mr-2 text-gray-500" />
                  <strong className="font-medium text-gray-700">
                    Số điện thoại:
                  </strong>{" "}
                  {user.phoneNumber}
                </div>
                <div className="mb-3 flex items-center">
                  <FaAddressCard className="mr-2 text-gray-500" />
                  <strong className="font-medium text-gray-700">
                    Địa chỉ:
                  </strong>{" "}
                  {user.address}
                </div>
                <div className="flex items-center justify-end mt-4">
                  <button
                    className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      setError(null); // Clear any previous errors
                      setSuccessMessage(null); // Clear any previous success messages
                    }}
                  >
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
