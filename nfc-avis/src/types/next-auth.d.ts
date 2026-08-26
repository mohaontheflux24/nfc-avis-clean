import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "ADMIN" | "MERCHANT";
      merchantId?: string;
      merchantName?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "ADMIN" | "MERCHANT";
    merchantId?: string;
    merchantName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "MERCHANT";
    merchantId?: string;
    merchantName?: string;
  }
}
