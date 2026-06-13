export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role; // 'STUDENT' or 'TEACHER'
      const path = nextUrl.pathname;

      const isProtectedRoute = path.startsWith('/account') || 
                            path.startsWith('/class') || 
                            path.startsWith('/notifications') || 
                            path.startsWith('/events') || 
                            path.startsWith('/payments');

      if (isProtectedRoute) {
        if (!isLoggedIn) return false;

        // Role-based restrictions
        if (role === 'TEACHER') {
          // Teachers should not access student-specific pages
          if (path.startsWith('/class') || path.startsWith('/notifications') || path.startsWith('/payments') || path.startsWith('/events')) {
            return Response.redirect(new URL('/account', nextUrl));
          }
        }
        
        return true;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
        token.grade = user.grade;
        token.subject = user.subject;
      }
      // If user updates profile via triggers, update token
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone;
        session.user.grade = token.grade;
        session.user.subject = token.subject;
      }
      return session;
    }
  },
  providers: [],
};
