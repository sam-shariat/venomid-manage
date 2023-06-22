import NextAuth, { NextAuthOptions } from "next-auth"
//import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    GithubProvider({
      clientId: String(process.env.GITHUB_ID),
      clientSecret: String(process.env.GITHUB_SECRET),
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    TwitterProvider({
      clientId: String(process.env.TWITTER_ID),
      clientSecret: String(process.env.TWITTER_SECRET)
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
}

export default NextAuth(authOptions)
