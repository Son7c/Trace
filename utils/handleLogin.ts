import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleLogin = (router: AppRouterInstance) => {
  setTimeout(() => {
    router.push("/login");
  }, 150);
};
