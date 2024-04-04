// Import necessary libraries and components
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import Image from "next/image";

// Import Zustand store and utilities
import { useUserStore } from "../../app/api/user"; // Adjust path as necessary
import { axiosErrorHandler } from "../../app/api/axios"; // Ensure this path matches your project structure

// Define your form validation schema using Zod
const schema = z.object({
  username: z
    .string()
    .min(3, "Too short")
    .max(50, "Too long")
    .nonempty("Required"),
  password: z
    .string()
    .min(3, "Too short")
    .max(100, "Too long")
    .nonempty("Required"),
});

// Infer the type for form values from the schema
type FormValues = z.infer<typeof schema>;

const LoginPage = () => {
  const login = useUserStore((state) => state.login); // Use Zustand store hook for login
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { redirect = "/" } = router.query; // Default redirection path if provided

  // Setup form handling with react-hook-form and Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // Form submission handler
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    try {
      const authenticated = await login(data.username, data.password);
      setLoading(false);
      if (authenticated) {
        toast.success("Login successful!");
        router.push(redirect.toString() || "/"); // Redirect on success
      } else {
        // Authentication failed
        toast.error("Login failed! Please check your credentials.");
      }
    } catch (error) {
      setLoading(false);
      // Utilize axiosErrorHandler for handling Axios errors
      toast.error(axiosErrorHandler(error));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-300 to-emerald-800">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
        <div className="flex justify-center mb-6">
          <Image
            src="/assets/img/CDLogo-small.svg"
            alt="Logo"
            width={64}
            height={64}
          />
          <span className="text-3xl font-bold justify-center pt-3">
            <span className="text-gray-900 dark:text-gray-200">Cable</span>
            <span className="text-emerald-800">Doc</span>
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {loading && <div className="mb-4 text-3xl">Loading...</div>}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-bold mb-1">
              Domainuser
            </label>
            <input
              {...register("username")}
              type="text"
              id="username"
              className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-emerald-500 focus:outline-none focus:ring"
            />
            {errors.username && (
              <span className="text-red-500 text-sm">
                {errors.username.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-bold mb-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-emerald-500 focus:outline-none focus:ring"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-emerald-500 rounded-md focus:bg-emerald-600 hover:bg-emerald-600 focus:outline-none"
          >
            Login
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default LoginPage;
