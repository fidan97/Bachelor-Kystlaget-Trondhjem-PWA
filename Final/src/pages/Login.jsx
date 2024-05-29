import React from "react";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Typography from "../components/Typography";

const Login = () => {
  return (
    <div className=" w-full flex justify-evenly items-center flex-wrap gap-8 sm:flex-nowrap h-screen bg-cover bg-[url('/images/boat.jpg')] bg-fixed bg-no-repeat bg-center p-8 overflow-y-auto">
      <div className="shadow bg-primary-50/70 p-4 rounded-full w-32 h-32 sm:w-auto sm:h-auto">
        <img src="/images/logo.svg" alt="logo" />
      </div>
      <div className=" flex flex-col items-center gap-4 bg-primary-50/70 p-8 rounded-2xl mb-8 ">
        <Typography size="h6/bold" variant="secondary">
          Sign In
        </Typography>
        <div className="flex items-center justify-center gap-4 bg-slate-600 p-2 px-4  rounded-lg">
          <img
            src="/images/google_logo.svg"
            alt="google_logo"
            className="w-6 h-6"
          />
          <Typography size="body2/normal" className="text-white">
            Login with your Google
          </Typography>
        </div>
        <form className="flex flex-col gap-2">
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder={"example@gmail.com"}
          />

          <Input
            name="password"
            type="password"
            autoComplete="current-password"
            required={{ value: true, message: "Password is required!" }}
            minLength={6}
            placeholder="Your password"
          />
          <div className="flex items-center justify-end">
            <div className="text-sm leading-6">
              <Link
                to="/forgot-password"
                className="font-semibold text-app-primary-600 hover:text-app-primary-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="mt-4 !w-full bg-gradient-to-b from-lime-200 to-lime-500 rounded-3xl shadow !text-primary-600"
          >
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
