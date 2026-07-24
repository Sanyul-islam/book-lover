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
} from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { BookOpen } from "lucide-react";
import { FaRegEnvelope } from "react-icons/fa6";
import { TbLockPassword } from "react-icons/tb";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const onSubmit = async (data) => {
    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Login successful!");
      reset();
      router.push("/");
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error(error);
      toast.error("Google sign in failed.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-default-50 to-default-100 px-4">
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
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-default-500">
              Login to continue your reading journey.
            </p>
          </div>

          {/* Google Button */}
          <Button
            fullWidth
            size="lg"
            variant="tertiary"
            radius="lg"
            onPress={handleGoogleLogin}
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
            {/* Email Field */}
            <TextField
              isInvalid={!!errors.email}
              className="flex flex-col gap-1"
            >
              <Label className="text-sm font-medium text-default-700">
                Email
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
                  placeholder="Enter your password"
                  className="w-full px-1 py-1.5 outline-none bg-transparent text-sm"
                />
              </InputGroup>
              <FieldError className="text-xs text-danger">
                {errors.password?.message}
              </FieldError>
            </TextField>

            <Button
              type="submit"
              color="primary"
              size="lg"
              radius="lg"
              fullWidth
              isLoading={isSubmitting}
              className="mt-2"
            >
              Login
            </Button>
          </Form>

          {/* Navigation link */}
          <p className="text-center text-default-500 mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Register Now
            </Link>
          </p>
        </div>
      </Card>
    </main>
  );
}
