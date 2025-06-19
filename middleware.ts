import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware() {
    // Si on arrive ici, l'utilisateur est authentifié
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Vérifier si on accède à /tracker ou ses sous-routes
        if (pathname.startsWith('/tracker')) {
          // Bloquer l'accès si pas de token (pas authentifié)
          return !!token
        }
        
        // Pour les autres routes protégées (/dashboard), autoriser si token présent
        return !!token
      },
    },
  }
)

export const config = { 
  matcher: ["/dashboard/:path*", "/tracker/:path*"] 
}
