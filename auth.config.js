export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtected = nextUrl.pathname.startsWith('/account') || 
                            nextUrl.pathname.startsWith('/class') || 
                            nextUrl.pathname.startsWith('/notifications') || 
                            nextUrl.pathname.startsWith('/events') || 
                            nextUrl.pathname.startsWith('/payments');
      if (isOnProtected) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
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
