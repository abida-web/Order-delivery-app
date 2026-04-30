"use client";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { User, Mail, Lock, Phone, CheckCircle } from "lucide-react";
import Link from "next/link";

// Only include fields that users actually fill out
const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export function SignUpTab() {
  const router = useRouter();
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  async function handleSignUp(data: SignUpForm) {
    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
        phone: data.phone,
        onBoarded: false, // Set default value here instead of form
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to sign up");
        },
        onSuccess: (response) => {
          toast.success("Account created successfully!");
          console.log("User created with:", {
            phone: data.phone,
            onBoarded: false,
          });
          router.push("/onboarding");
        },
      },
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <CheckCircle className="size-10 text-[#FFD700]" />
      <p className="py-3 text-2xl font-semibold text-white">
        Create an account
      </p>
      <Card className="sm:min-w-96 w-full max-w-md p-3 sm:p-6 bg-black border border-[#FFD700]/30 shadow-xl shadow-[#FFD700]/5">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSignUp)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 text-[#FFD700] items-center mb-1">
                    <User className="h-4 w-4" />
                    <FormLabel className="text-white">Name</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your name"
                      className="bg-white/5 border-[#FFD700]/30 text-white placeholder:text-white/40 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 text-[#FFD700] items-center mb-1">
                    <Mail className="h-4 w-4" />
                    <FormLabel className="text-white">Email</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder="you@example.com"
                      className="bg-white/5 border-[#FFD700]/30 text-white placeholder:text-white/40 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 text-[#FFD700] items-center mb-1">
                    <Phone className="h-4 w-4" />
                    <FormLabel className="text-white">Phone Number</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      type="tel"
                      {...field}
                      placeholder="+1 234 567 8900"
                      className="bg-white/5 border-[#FFD700]/30 text-white placeholder:text-white/40 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Optional: Add a checkbox if you want users to explicitly agree to onboarding */}
            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-[#FFD700]/30 p-4">
              <input
                type="checkbox"
                id="onboarding"
                className="h-4 w-4 mt-1 rounded border-[#FFD700]/30 text-[#FFD700] focus:ring-[#FFD700]/20"
              />
              <div className="space-y-1 leading-none">
                <label
                  htmlFor="onboarding"
                  className="text-white cursor-pointer"
                >
                  I agree to the onboarding terms
                </label>
                <p className="text-xs text-white/60">
                  By checking this box, you confirm that you want to complete
                  the onboarding process.
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 text-[#FFD700] items-center mb-1">
                    <Lock className="h-4 w-4" />
                    <FormLabel className="text-white">Password</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="••••••"
                      className="bg-white/5 border-[#FFD700]/30 text-white placeholder:text-white/40 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full backdrop-blur-lg bg-gradient-to-bl from-[#E9B13B] to-[#654808] border border-white/40 rounded-xl text-black font-semibold transition-all duration-300 hover:scale-[1.02]"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-[#FFD700] hover:text-[#FFED4A] hover:underline font-medium transition-colors"
          >
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default SignUpTab;
