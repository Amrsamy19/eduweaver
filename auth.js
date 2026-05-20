import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import { db } from './app/lib/db';
import { authConfig } from './auth.config';
import bcrypt from 'bcryptjs';

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;
        
        if (!email || !password) return null;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            grade: user.grade,
            subject: user.subject,
          };
        }
        
        return null;
      },
    }),
  ],
});
