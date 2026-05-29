import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import { toast } from "sonner";

import { useDispatch } from "react-redux";

import { setUser } from "@/redux/userSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/v1/user/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));

        localStorage.setItem(
          "accessToken",
          res.data.accessToken
        );

        localStorage.setItem(
          "refreshToken",
          res.data.refreshToken
        );
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        toast.success(res.data.message);
        navigate("/")

      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>

          <CardDescription>
            Enter your details below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submitHandler}>
            <div className="flex flex-col gap-3">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>

                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    required
                  />

                  {showPassword ? (
                    <EyeOff
                      onClick={() =>
                        setShowPassword(false)
                      }
                      className="w-5 h-5 text-gray-700 absolute right-5 bottom-2 cursor-pointer"
                    />
                  ) : (
                    <Eye
                      onClick={() =>
                        setShowPassword(true)
                      }
                      className="w-5 h-5 text-gray-700 absolute right-5 bottom-2 cursor-pointer"
                    />
                  )}
                </div>
              </div>
            </div>

            <CardFooter className="flex-col gap-2 mt-5 px-0">
              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Please wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <p className="text-sm text-gray-700">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-pink-700 hover:underline"
                >
                  Signup
                </Link>
              </p>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;