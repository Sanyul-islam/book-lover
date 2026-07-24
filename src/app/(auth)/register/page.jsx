"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  Form,
  TextField,
  Label,
  InputGroup,
  Input,
  FieldError,
  Separator,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { BookOpen } from "lucide-react";
import { FaRegEnvelope, FaRegUser, FaRegImage } from "react-icons/fa6";
import { TbLockPassword } from "react-icons/tb";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      photoUrl: "",
      role: "reader",
    },
  });

  const passwordValue = watch("password");
  const currentRole = watch("role");
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const { error } = await authClient.signUp.email({
        name: data.fullName,
        email: data.email,
        password: data.password,
        image: data.photoUrl || "",
        role: data.role,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Registration successful!");
      reset();
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error(error);
      toast.error("Google sign up failed.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-default-50 to-default-100 px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl shadow-2xl border border-default-200">
        <div className="p-8">
          <div className="flex justify-center mb-1">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="text-primary" size={30} />
            </div>
          </div>

          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-default-500">
              Join us to begin your reading journey.
            </p>
          </div>

          <Button
            fullWidth
            size="lg"
            variant="tertiary"
            radius="lg"
            onPress={handleGoogleSignup}
          >
            <FcGoogle size={22} /> Continue with Google
          </Button>

          <div className="flex items-center w-full my-4">
            <Separator className="flex-1" />
            <span className="px-3 text-xs font-semibold text-default-400">
              OR
            </span>
            <Separator className="flex-1" />
          </div>

          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-4"
          >
            <TextField
              isInvalid={!!errors.fullName}
              className="flex flex-col gap-1"
            >
              <Label className="text-sm font-medium text-default-700">
                Full Name
              </Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <FaRegUser className="size-4 text-default-400" />
                </InputGroup.Prefix>
                <Input
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-1 py-1.5 outline-none bg-transparent text-sm"
                />
              </InputGroup>
              <FieldError className="text-xs text-danger">
                {errors.fullName?.message}
              </FieldError>
            </TextField>

            <TextField
              isInvalid={!!errors.email}
              className="flex flex-col gap-1"
            >
              <Label className="text-sm font-medium text-default-700">
                Email Address
              </Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <FaRegEnvelope className="size-4 text-default-400" />
                </InputGroup.Prefix>
                <Input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-1 py-1.5 outline-none bg-transparent text-sm"
                />
              </InputGroup>
              <FieldError className="text-xs text-danger">
                {errors.email?.message}
              </FieldError>
            </TextField>

            <TextField
              isInvalid={!!errors.photoUrl}
              className="flex flex-col gap-1"
            >
              <Label className="text-sm font-medium text-default-700">
                Photo URL
              </Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <FaRegImage className="size-4 text-default-400" />
                </InputGroup.Prefix>
                <Input
                  {...register("photoUrl", {
                    required: "Photo URL is required",
                  })}
                  type="url"
                  placeholder="https://example.com"
                  className="w-full px-1 py-1.5 outline-none bg-transparent text-sm"
                />
              </InputGroup>
              <FieldError className="text-xs text-danger">
                {errors.photoUrl?.message}
              </FieldError>
            </TextField>

            <TextField
              isInvalid={!!errors.password}
              className="flex flex-col gap-1"
            >
              <Label className="text-sm font-medium text-default-700">
                Password
              </Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <TbLockPassword className="size-4 text-default-400" />
                </InputGroup.Prefix>
                <Input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full px-1 py-1.5 outline-none bg-transparent text-sm"
                />
                <InputGroup.Suffix>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none text-default-400 hover:text-default-600 transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="size-4" />
                    ) : (
                      <FiEye className="size-4" />
                    )}
                  </button>
                </InputGroup.Suffix>
              </InputGroup>
              <FieldError className="text-xs text-danger">
                {errors.password?.message}
              </FieldError>
            </TextField>

            <TextField
              isInvalid={!!errors.confirmPassword}
              className="flex flex-col gap-1"
            >
              <Label className="text-sm font-medium text-default-700">
                Confirm Password
              </Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <TbLockPassword className="size-4 text-default-400" />
                </InputGroup.Prefix>
                <Input
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    validate: (value) =>
                      value === passwordValue || "Passwords do not match",
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full px-1 py-1.5 outline-none bg-transparent text-sm"
                />
                <InputGroup.Suffix>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="focus:outline-none text-default-400 hover:text-default-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="size-4" />
                    ) : (
                      <FiEye className="size-4" />
                    )}
                  </button>
                </InputGroup.Suffix>
              </InputGroup>
              <FieldError className="text-xs text-danger">
                {errors.confirmPassword?.message}
              </FieldError>
            </TextField>

            <RadioGroup
              value={currentRole}
              orientation="horizontal"
              className="flex flex-col gap-2 mt-4"
              onChange={(value) => setValue("role", value)}
            >
              <Label className="text-sm font-medium text-default-700">
                Select Your Role
              </Label>
              <div className="flex gap-4 mt-2">
              <Radio value="reader">
                <Radio.Content className="flex items-center gap-2 cursor-pointer group">
                  <Radio.Control className="w-4 h-4 rounded-full border-2 border-blue-500 group-data-[selected=true]:border-primary flex items-center justify-center transition-colors">
                    <Radio.Indicator  />
                  </Radio.Control>
                  Reader
                </Radio.Content>
              </Radio>
              <Radio value="librarian">
                <Radio.Content className="flex items-center gap-2 cursor-pointer group">
                  <Radio.Control className="w-4 h-4 rounded-full border-2 border-blue-500 group-data-[selected=true]:border-primary flex items-center justify-center transition-colors">
                    <Radio.Indicator  />
                  </Radio.Control>
                  Librarian
                </Radio.Content>
              </Radio>
              </div>
            </RadioGroup>

            <Button
              type="submit"
              className="w-full bg-primary text-white font-medium py-2 hover:bg-primary-600 transition-colors mt-4"
            >
              Register
            </Button>

            <div className="text-center text-sm text-default-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Login Now
              </Link>
            </div>
          </Form>
        </div>
      </Card>
    </main>
  );
}
  