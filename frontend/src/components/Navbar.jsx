import { ShoppingCart } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product);

  const accessToken = localStorage.getItem("accessToken");

  const admin = user?.role === "admin";

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // LOGOUT FUNCTION
  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {

        // CLEAR REDUX USER
        dispatch(setUser(null));

        // CLEAR LOCAL STORAGE
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        toast.success(res.data.message);

        // REDIRECT
        navigate("/login");
      }

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message || "Logout failed"
      );
    }
  };

  return (
    <header className="bg-pink-50 fixed top-0 left-0 w-full z-20 border-b border-pink-200 shadow-sm">

      <div className="max-w-7xl mx-auto flex justify-between items-center py-1 px-5">

        {/* LOGO */}
        <Link to={"/"}>
          <img
            src="/Ekart.png"
            alt="Ekart Logo"
            className="w-[100px]"
          />
        </Link>

        {/* NAVBAR */}
        <nav className="flex items-center gap-10">

          {/* LINKS */}
          <ul className="flex gap-7 items-center text-[17px] font-semibold">

            <Link to={"/"}>
              <li className="hover:text-pink-600 transition-all duration-200 cursor-pointer">
                Home
              </li>
            </Link>

            <Link to={"/products"}>
              <li className="hover:text-pink-600 transition-all duration-200 cursor-pointer">
                Products
              </li>
            </Link>

            {user && (
              <Link to={`/profile/${user._id}`}>
                <li className="hover:text-pink-600 transition-all duration-200 cursor-pointer">
                  Hello, {user.firstName}
                </li>
              </Link>
            )}

            {admin && (
              <Link to={"/dashboard/sales"}>
                <li className="hover:text-pink-600 transition-all duration-200 cursor-pointer">
                  Dashboard
                </li>
              </Link>
            )}
          </ul>

          {/* CART */}
          <Link to={"/cart"} className="relative">

            <ShoppingCart className="w-7 h-7 text-black" />

            <span className="absolute -top-3 -right-4 bg-pink-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
              {cart?.items?.length || 0}
            </span>

          </Link>

          {/* BUTTONS */}
          {user ? (
            <Button
              onClick={logoutHandler}
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              Logout
            </Button>
          ) : (
            <Link to={"/login"}>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white">
                Login
              </Button>
            </Link>
          )}

        </nav>

      </div>

    </header>
  );
};

export default Navbar;