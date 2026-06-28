import NextAuth, {
  DefaultSession,
} from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      artistId: string;
      firstName: string;

      lastName: string;

      userName: string;

      email: string;

      mobileNumber: string;

      role: string;

      token: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    artistId: string;

    firstName: string;

    lastName: string;

    userName: string;

    email: string;

    mobileNumber: string;

    role: string;

    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    artistId: string;
    firstName: string;

    lastName: string;

    userName: string;

    email: string;

    mobileNumber: string;

    role: string;

    token: string;
  }
}