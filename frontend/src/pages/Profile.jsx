import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/userSlice";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import MyOrder from "@/pages/MyOrder";

const Profile = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);

  const [file, setFile] = useState(null);

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

  const [preview, setPreview] = useState(
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  );

  // Load User Data
  useEffect(() => {

    if (user) {

      setUpdateUserData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phoneNo: user?.phoneNo || "",
        address: user?.address || "",
        city: user?.city || "",
        zipCode: user?.zipCode || "",
        role: user?.role || "",
      });

      if (user?.profilePic) {
        setPreview(user.profilePic);
      }
    }

  }, [user]);

  // Handle Input Change
  const handleChange = (e) => {

    setUpdateUserData({
      ...updateUserData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Image Change
  const handleImageChange = (e) => {

    const selectedFile = e.target.files[0];

    if (selectedFile) {

      setFile(selectedFile);

      setPreview(
        URL.createObjectURL(selectedFile)
      );
    }
  };

  // Logout
  const handleLogout = () => {

    localStorage.removeItem("accessToken");

    navigate("/login");
  };

  // Update Profile
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      console.log("Submit Working");

      const accessToken =
        localStorage.getItem("accessToken");

      if (!accessToken) {

        toast.error("Please Login First");

        return;
      }

      const formData = new FormData();

      formData.append(
        "firstName",
        updateUserData.firstName
      );

      formData.append(
        "lastName",
        updateUserData.lastName
      );

      formData.append(
        "email",
        updateUserData.email
      );

      formData.append(
        "phoneNo",
        updateUserData.phoneNo
      );

      formData.append(
        "address",
        updateUserData.address
      );

      formData.append(
        "city",
        updateUserData.city
      );

      formData.append(
        "zipCode",
        updateUserData.zipCode
      );

      formData.append(
        "role",
        updateUserData.role
      );

      // Image
      if (file) {
        formData.append("file", file);
      }

      console.log("Sending Request...");

      const res = await axios.put(
        `http://localhost:5000/api/v1/user/update/${user?._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log("Response:", res.data);

      // Success
      if (res.data.success) {

        console.log("Toast Running");

        dispatch(
          setUser(res.data.user)
        );

        toast.success(
          res.data.message ||
          "Profile Updated Successfully"
        );
      }

    } catch (error) {

      console.log("ERROR:", error);

      console.log(
        "Backend Error:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to update profile"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">

      {/* Navbar */}
      <header className="w-full bg-[#fff7fa] border-b px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >

          <div className="bg-pink-600 p-2 rounded-lg text-white">
            <ShoppingCart className="w-5 h-5" />
          </div>

          <span className="text-2xl font-black tracking-wider text-pink-600">
            KART
          </span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-8 font-medium text-gray-700">

          <span
            className="cursor-pointer hover:text-pink-600"
            onClick={() => navigate("/")}
          >
            Home
          </span>

          <span
            className="cursor-pointer hover:text-pink-600"
            onClick={() => navigate("/products")}
          >
            Products
          </span>

          <span className="font-semibold">
            Hello, {user?.firstName}
          </span>

          {/* Cart */}
          <div className="relative cursor-pointer">

            <ShoppingCart className="w-6 h-6" />

            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </div>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            className="bg-pink-600 hover:bg-pink-700 rounded-lg"
          >
            Logout
          </Button>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 py-10">

        <Tabs
          defaultValue="profile"
          className="w-full flex flex-col items-center"
        >

          {/* Tabs */}
          <TabsList className="mb-5">

            <TabsTrigger className='bg-white' value="profile">
              Profile
            </TabsTrigger>

            <TabsTrigger className='bg-white' value="orders">
              Orders
            </TabsTrigger>

          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">

            <div className="flex flex-col items-center">

              {/* Title */}
              <h1 className="text-4xl font-bold mb-10">
                Update Profile
              </h1>

              {/* Content */}
              <div className="flex gap-12 items-start">

                {/* Image Section */}
                <div className="flex flex-col items-center">

                  <img
                    src={preview}
                    alt=""
                    className="w-40 h-40 rounded-full object-cover border-[5px] border-pink-700"
                  />

                  <label>

                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                    <Button
                      asChild
                      className="mt-6 bg-pink-600 hover:bg-pink-700 rounded-xl cursor-pointer"
                    >
                      <span>
                        Change Picture
                      </span>
                    </Button>
                  </label>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="bg-white w-[500px] p-8 rounded-xl shadow-sm border space-y-5"
                >

                  {/* Names */}
                  <div className="grid grid-cols-2 gap-5">

                    <div>
                      <Label className="font-semibold">
                        First Name
                      </Label>

                      <Input
                        type="text"
                        name="firstName"
                        value={updateUserData.firstName}
                        onChange={handleChange}
                        className="mt-2 bg-gray-50"
                      />
                    </div>

                    <div>
                      <Label className="font-semibold">
                        Last Name
                      </Label>

                      <Input
                        type="text"
                        name="lastName"
                        value={updateUserData.lastName}
                        onChange={handleChange}
                        className="mt-2 bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>

                    <Label className="font-semibold">
                      Email
                    </Label>

                    <Input
                      type="email"
                      name="email"
                      value={updateUserData.email}
                      onChange={handleChange}
                      className="mt-2 bg-gray-50"
                    />
                  </div>

                  {/* Phone */}
                  <div>

                    <Label className="font-semibold">
                      Phone Number
                    </Label>

                    <Input
                      type="text"
                      name="phoneNo"
                      value={updateUserData.phoneNo}
                      onChange={handleChange}
                      className="mt-2 bg-gray-50"
                    />
                  </div>

                  {/* Address */}
                  <div>

                    <Label className="font-semibold">
                      Address
                    </Label>

                    <Input
                      type="text"
                      name="address"
                      value={updateUserData.address}
                      onChange={handleChange}
                      className="mt-2 bg-gray-50"
                    />
                  </div>

                  {/* City + Zip */}
                  <div className="grid grid-cols-2 gap-5">

                    <div>
                      <Label className="font-semibold">
                        City
                      </Label>

                      <Input
                        type="text"
                        name="city"
                        value={updateUserData.city}
                        onChange={handleChange}
                        className="mt-2 bg-gray-50"
                      />
                    </div>

                    <div>
                      <Label className="font-semibold">
                        Zip Code
                      </Label>

                      <Input
                        type="text"
                        name="zipCode"
                        value={updateUserData.zipCode}
                        onChange={handleChange}
                        className="mt-2 bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full mt-4 bg-pink-600 hover:bg-pink-700"
                  >
                    Update Profile
                  </Button>

                </form>
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent className='bg-white' value="orders">
            <MyOrder />
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default Profile;