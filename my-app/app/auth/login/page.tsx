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
import { Mail, Lock, CircleUser } from "lucide-react";
import Link from "next/link";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInForm = z.infer<typeof signInSchema>;

export function SignInTab() {
  const router = useRouter();
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSignIn(data: SignInForm) {
    await authClient.signIn.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to sign in");
        },
        onSuccess: () => {
          toast.success("Welcome back!");
          router.push("/onboarding");
        },
      },
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <CircleUser className="size-10 text-[#FFD700]" />
      <p className="py-3 text-2xl font-semibold text-white">Welcome back</p>
      <Card className="sm:min-w-96 w-full max-w-md p-3 sm:p-6 bg-black border border-[#FFD700]/30 shadow-xl shadow-[#FFD700]/5">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSignIn)}
          >
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
              {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm text-white/60">
          Don't have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="text-[#FFD700] hover:text-[#FFED4A] hover:underline font-medium transition-colors"
          >
            Create Account
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default SignInTab;
