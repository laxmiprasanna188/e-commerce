import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";

const UserInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  );

  const [updateUserData, setUpdateUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    role: "",
  });

  // FETCH USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.get(
          `http://localhost:5000/api/v1/user/get-user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          const user = res.data.user;

          setUpdateUserData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phoneNo: user.phoneNo || "",
            address: user.address || "",
            city: user.city || "",
            zipCode: user.zipCode || "",
            role: user.role || "",
          });

          setPreview(
            user.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          );
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load user");
      }
    };

    fetchUser();
  }, [id]);

  // HANDLE INPUT
  const handleChange = (e) => {
    setUpdateUserData({
      ...updateUserData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE IMAGE
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(updateUserData).forEach((key) => {
        formData.append(key, updateUserData[key]);
      });

      if (file) {
        formData.append("file", file);
      }

      const token = localStorage.getItem("accessToken");

      const res = await axios.put(
        `http://localhost:5000/api/v1/user/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Profile updated successfully");
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  return (
  <div className="bg-[#f5f5f5] min-h-screen p-6">

    {/* PAGE CONTAINER */}
    <div className="ml-[320px] pt-14">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">

        <Button
          onClick={() => navigate(-1)}
          className="bg-black hover:bg-black text-white w-10 h-10 p-0 rounded-md"
        >
          <ArrowLeft size={18} />
        </Button>

        <h1 className="text-2xl font-bold text-gray-800">
          Update Profile
        </h1>

      </div>

      {/* CARD */}
      <div className="bg-white border rounded-2xl shadow-sm w-[760px] p-8">

        <div className="flex items-start gap-10">

          {/* LEFT IMAGE SECTION */}
          <div className="w-[220px] shrink-0 flex flex-col items-center">

            <img
              src={preview}
              alt="profile"
              className="w-36 h-36 rounded-full border-4 border-pink-600 object-cover"
            />

            <label className="mt-5 cursor-pointer">

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              <div className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg text-sm font-medium">
                Change Picture
              </div>

            </label>

          </div>

          {/* RIGHT FORM */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[420px]"
          >

            {/* FIRST + LAST NAME */}
            <div className="grid grid-cols-2 gap-5 mb-5">

              <div>
                <Label className="mb-2 block text-sm font-medium">
                  First Name
                </Label>

                <Input
                  name="firstName"
                  value={updateUserData.firstName}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>

              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Last Name
                </Label>

                <Input
                  name="lastName"
                  value={updateUserData.lastName}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>

            </div>

            {/* EMAIL */}
            <div className="mb-5">

              <Label className="mb-2 block text-sm font-medium">
                Email
              </Label>

              <Input
                name="email"
                value={updateUserData.email}
                onChange={handleChange}
                className="h-11"
              />

            </div>

            {/* PHONE */}
            <div className="mb-5">

              <Label className="mb-2 block text-sm font-medium">
                Phone Number
              </Label>

              <Input
                name="phoneNo"
                value={updateUserData.phoneNo}
                onChange={handleChange}
                className="h-11"
              />

            </div>

            {/* ADDRESS */}
            <div className="mb-5">

              <Label className="mb-2 block text-sm font-medium">
                Address
              </Label>

              <Input
                name="address"
                value={updateUserData.address}
                onChange={handleChange}
                className="h-11"
              />

            </div>

            {/* CITY + ZIP */}
            <div className="grid grid-cols-2 gap-5 mb-6">

              <div>
                <Label className="mb-2 block text-sm font-medium">
                  City
                </Label>

                <Input
                  name="city"
                  value={updateUserData.city}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>

              <div>
                <Label className="mb-2 block text-sm font-medium">
                  Zip Code
                </Label>

                <Input
                  name="zipCode"
                  value={updateUserData.zipCode}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>

            </div>

            {/* ROLE */}
            <div className="flex items-center gap-8 mb-8">

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Role :
                </span>
              </div>

              <label className="flex items-center gap-2 text-sm">

                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={updateUserData.role === "user"}
                  onChange={handleChange}
                />

                User

              </label>

              <label className="flex items-center gap-2 text-sm">

                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={updateUserData.role === "admin"}
                  onChange={handleChange}
                />

                Admin

              </label>

            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full h-11 bg-pink-600 hover:bg-pink-700 text-white text-base"
            >
              Update Profile
            </Button>

          </form>

        </div>

      </div>

    </div>

  </div>
);
};

export default UserInfo;