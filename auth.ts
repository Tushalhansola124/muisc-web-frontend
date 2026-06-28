import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

import Credentials from "next-auth/providers/credentials";

import axios from "axios";

import { API_ENDPOINTS } from "@/core/constants/api_endpoint";

export const authConfig = {
  providers: [
    Credentials({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          if (
            !credentials?.email ||
            !credentials?.password
          ) {
            throw new Error(
              "Email and password are required"
            );
          }

          const res = await axios.post(
            `${process.env.SERVER_URL}${API_ENDPOINTS.auth.login}`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const data = res.data;

          console.log(
            "LOGIN RESPONSE:",
            data
          );

          if (
            res.status !== 200 ||
            !data?.token ||
            !data?.user
          ) {
            return null;
          }

          return {
            id: data.user.id,
            artistId: data.user.artistId,
            firstName:
              data.user.firstName,

            lastName:
              data.user.lastName,

            userName:
              data.user.username,

            email: data.user.email,

            mobileNumber:
              data.user.mobileNumber,

            role: data.user.role,

            token: data.token,
          };

        } catch (error: any) {
          console.log(
            "AUTHORIZE ERROR:",
            error.response?.data
          );

          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.artistId = user.artistId;
        token.firstName =
          user.firstName;

        token.lastName =
          user.lastName;

        token.userName =
          user.userName;

        token.email =
          user.email;

        token.mobileNumber =
          user.mobileNumber;

        token.role =
          user.role;

        token.token =
          user.token;
      }

      return token;
    },

    async session({
      session,
      token,
    }) {
      session.user.id =
        token.id as string;
      
      session.user.artistId =
        token.artistId as string;

      session.user.firstName =
        token.firstName as string;

      session.user.lastName =
        token.lastName as string;

      session.user.userName =
        token.userName as string;

      session.user.email =
        token.email as string;

      session.user.mobileNumber =
        token.mobileNumber as string;

      session.user.role =
        token.role as string;

      session.user.token =
        token.token as string;

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);