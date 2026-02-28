import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginUser } from './api';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        remember: { label: 'Remember this device', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        const rememberMe = credentials.remember === 'true';

        // Call server API to authenticate
        const result = await loginUser({
          email: credentials.email,
          password: credentials.password,
          rememberMe,
        });

        if (!result.success || !result.user) {
          throw new Error(result.message || 'Invalid email or password');
        }

        if (!result.token) {
          throw new Error('Server did not return a token');
        }

        // Return user object with server JWT (stored in NextAuth JWT/session)
        return {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          accessToken: result.token,
        };
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If redirecting to sign-in page, go to dashboard instead
      if (url === `${baseUrl}/sign-in` || url === '/sign-in') {
        return `${baseUrl}/`;
      }
      // Allow relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

