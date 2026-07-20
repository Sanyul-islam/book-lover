"use client";

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

export default function RegisterPage() {
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
      role: "user", // Default selection matching User (Reader)
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    console.log("Registration Submitting Data:", data);
    // Add your signup API endpoints here
    reset();
  };

  const handleGoogleSignup = async () => {
    // Google registration action
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-default-50 to-default-100 px-4 py-12">
      <Card className="w-full max-w-md rounded-2xl shadow-2xl border border-default-200">
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-1">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="text-primary" size={30} />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-default-500">
              Join us to begin your reading journey.
            </p>
          </div>

          {/* Google Button */}
          <Button
            fullWidth
            size="lg"
            variant="tertiary"
            radius="lg"
            onPress={handleGoogleSignup}
          >
            <FcGoogle size={22} /> Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center w-full my-4">
            <Separator className="flex-1" />
            <span className="px-3 text-xs font-semibold text-default-400">
              OR
            </span>
            <Separator className="flex-1" />
          </div>

          {/* Form */}
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-4"
          >
            {/* Full Name Field */}
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

            {/* Email Field */}
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

            {/* Photo URL Field */}
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

            {/* Password Field */}
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
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type="password"
                  placeholder="Create a password"
                  className="w-full px-1 py-1.5 outline-none bg-transparent text-sm"
                />
              </InputGroup>
              <FieldError className="text-xs text-danger">
                {errors.password?.message}
              </FieldError>
            </TextField>

            {/* Confirm Password Field */}
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
                    validate: (value) =>
                      value === passwordValue || "Passwords do not match",
                  })}
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full px-1 py-1.5 outline-none bg-transparent text-sm"
                />
              </InputGroup>
              <FieldError className="text-xs text-danger">
                {errors.confirmPassword?.message}
              </FieldError>
            </TextField>

            
            {/* Role Selection Radio Group */}
            <RadioGroup
              defaultValue="user"
              orientation="horizontal"
              className="flex flex-col gap-2 mt-2"
              onValueChange={(value) => setValue("role", value)}
            >
              <Label className="text-sm font-medium text-default-700">
                Select Your Role
              </Label>

              <div className="flex gap-6">
                {/* Reader Option */}
                <Radio value="user">
                  <Radio.Content className="flex items-center gap-2 cursor-pointer">
                    <Radio.Control className="w-4 h-4 rounded-full border border-purple-500 flex items-center justify-center data-[selected=true]:border-primary transition-colors">
                      <Radio.Indicator  />
                    </Radio.Control>
                    <span className="text-sm text-default-700 select-none">
                     Reader
                    </span>
                  </Radio.Content>
                </Radio>

                {/* Librarian Option */}
                <Radio value="librarian">
                  <Radio.Content className="flex items-center gap-2 cursor-pointer bg">
                    <Radio.Control className="w-4 h-4 rounded-full border border-purple-500 flex items-center justify-center data-[selected=true]:border-primary transition-colors">
                      <Radio.Indicator />
                    </Radio.Control>
                    <span className="text-sm text-default-700 select-none">
                      Librarian
                    </span>
                  </Radio.Content>
                </Radio>
              </div>
            </RadioGroup>

            {/* Submit Button */}
            <Button
              type="submit"
              color="primary"
              size="lg"
              radius="lg"
              fullWidth
              isLoading={isSubmitting}
              className="mt-4"
            >
              Register
            </Button>
          </Form>

          {/* Navigation link */}
          <p className="text-center text-default-500 mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Login Now
            </Link>
          </p>
        </div>
      </Card>
    </main>
  );
}
