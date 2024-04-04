// hooks/useRequireAuth.ts
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserStore } from "./api/user"; // Adjust import path as necessary

export const useRequireAuth = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      // Redirect to login, preserving the intended destination
      router.push(`/login?redirect=${router.asPath}`);
    }
  }, [user, router]);
};
