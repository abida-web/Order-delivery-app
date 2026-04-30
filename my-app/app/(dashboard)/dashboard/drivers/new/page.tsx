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
import { createDriver } from "@/components/actions/create-driver";
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
    try {
      // Get the current session
      const session = await authClient.getSession();
      if (!session?.data?.user) {
        toast.error("No user session found");
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("phone", data.phone);
      formData.append("ownerId", session.data.user.id);

      // Call the server action
      const result = await createDriver(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message || "Driver account created successfully!");
      form.reset();
      router.push("/dashboard/drivers");
      router.refresh();
    } catch (error) {
      console.error("Error creating driver:", error);
      toast.error("An unexpected error occurred");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <CheckCircle className="size-10 text-[#FFD700]" />
      <p className="py-3 text-2xl font-semibold text-white">Add a driver</p>
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
                      placeholder="Enter driver's name"
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
                      placeholder="driver@example.com"
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
              {form.formState.isSubmitting
                ? "Creating driver..."
                : "Add Driver"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm text-white/60">
          <Link
            href="/dashboard/drivers"
            className="text-[#FFD700] hover:text-[#FFED4A] hover:underline font-medium transition-colors"
          >
            Back to Drivers
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default SignUpTab;
