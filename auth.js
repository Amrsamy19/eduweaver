import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { query } from './app/lib/db';
import { authConfig } from './auth.config';
import bcrypt from 'bcryptjs';

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;
        
        if (!email || !password) return null;

        try {
          const res = await query('SELECT * FROM users WHERE email = $1', [email]);
          const user = res.rows[0];

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
        } catch (error) {
          console.error('Authorize DB query error:', error);
        }
        
        return null;
      },
    }),
  ],
});
