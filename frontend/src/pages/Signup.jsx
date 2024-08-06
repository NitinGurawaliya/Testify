import React, { useState } from "react";
import { Heading, Subheading } from "../components/Heading";
import { InputBox, PasswordInputBox } from "../components/Inputbox";
import { AuthButton } from "../components/Buttons";
import { BottomWarning } from "../components/BottomWarning";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../src/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 


  return (
    <div className="h-[100vh] items-center flex justify-center px-5 lg:px-0">
      <div className="max-w-screen-xl bg-white border shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="flex flex-col items-center">
            <div className="text-center">
              <Subheading label={"Create your account "} />
              <Heading label={"Hey enter your details to create your account"} />
            </div>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs flex flex-col gap-4">
                <InputBox
                  onChange={(e) => setName(e.target.value)}
                  placeholder={"Enter your name "}
                />
                <InputBox
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={"Enter your email"}
                />
                <PasswordInputBox
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={"Enter your password"}
                />
                <AuthButton onClick={userHandler} label={"Signup As a Student"} />
                <AuthButton onClick={adminHandler} label={"Signup As an Admin"} />
                <BottomWarning label={"Already have an account "} to={"/signin"} buttonText={"Signup"} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="loader"></div> {/* Add your loader component or CSS here */}
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );

  
  async function adminHandler() {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        position: "top-left",
      });
      return;
    }
    if (!email.endsWith(".com")) {
      toast.error("Enter valid email", {
        position: "top-left",
      });
      return;
    }

    setLoading(true); 
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/admin/signup`, {
        name,
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", `Bearer ${response.data.token}`);
        localStorage.setItem("userRole","admin")
        navigate("/adminDashboard");
        toast.success("Signed up successfully", {
          position: "top-left",
        });
      } else {
        toast.error("Oops something is wrong", {
          position: "top-left",
        });
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Oops something is wrong ", {
        position: "top-left",
      });
    } finally {
      setLoading(false); // Hide loader
    }
  }

  async function userHandler() {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long", {
        position: "top-left",
      });
      return;
    }
    if (!email.endsWith(".com")) {
      toast.error("Enter valid email", {
        position: "top-left",
      });
      return;
    }

    setLoading(true); // Show loader

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        name,
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", `Bearer ${response.data.token}`);
        localStorage.setItem("userRole","user")
        navigate("/userDashboard");
        toast.success("Signed up successfully", {
          position: "top-left",
        });
      } else {
        toast.error("Oops something is wrong", {
          position: "top-left",
        });
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Oops something is wrong ", {
        position: "top-left",
      });
    } finally {
      setLoading(false); // Hide loader
    }
  }
};

export default Signup;
