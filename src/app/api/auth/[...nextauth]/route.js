import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // Matches session maxAge
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        // Social login fields
        id: { label: "ID", type: "text" },
        accessToken: { label: "Access Token", type: "text" },
        tokenExpiresAt: { label: "Token Expires At", type: "text" },
        followingsCount: { label: "Followings Count", type: "text" },
      },
      async authorize(credentials, req) {
        // console.log("my credential", credentials);

        // Check if this is a social login (has accessToken)
        if (credentials?.accessToken && credentials?.email) {
          // console.log("✅ Social credentials:", credentials);

          return {
            id: credentials.id,
            name: credentials.name,
            email: credentials.email,
            accessToken: credentials.accessToken,
            tokenExpiresAt: credentials.tokenExpiresAt,
            followingsCount: parseInt(credentials.followingsCount) || 0,
          };
        }
        if (credentials.name) {
          try {
            //signup
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/signup`,
              {
                name: credentials.name,
                email: credentials.email,
                password: credentials.password,
              },
              {
                headers: { "Content-Type": "application/json" },
              }
            );

            const data = response.data;
            // console.log("Data:", data);
            if (data?.token && data?.user) {
              return {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                accessToken: data.token,
                tokenExpiresAt: data.token_expires_at,
                followingsCount: data.followings_count,
              };
            }
          } catch (error) {
            // console.error(error);
            throw new Error(
              JSON.stringify({ errors: error.response.data, status: false })
            );
          }
        } else {
          try {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/signin`,
              {
                email: credentials.email,
                password: credentials.password,
              },
              {
                headers: { "Content-Type": "application/json" },
              }
            );

            const data = response.data;
            // console.log("Data:", data);
            if (data?.token && data?.user) {
              return {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                accessToken: data.token,
                tokenExpiresAt: data.token_expires_at,
                followingsCount: data.followings_count,
              };
            }
          } catch (error) {
            // console.error("Axios Error Response::", error.response.data);
            throw new Error(
              JSON.stringify({ errors: error.response.data, status: false })
            );
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // console.log("object", user);
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.tokenExpiresAt = user.tokenExpiresAt;
        token.followingsCount = user.followingsCount;
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("session:", session);
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.accessToken = token.accessToken;
      session.user.tokenExpiresAt = token.tokenExpiresAt;
      session.user.followingsCount = token.followingsCount;
      session.expires = token.tokenExpiresAt;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
