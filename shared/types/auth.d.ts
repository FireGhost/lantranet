import type { Role } from "@prisma/client"

// Add custom fields to the auth session.
declare module '#auth-utils' {
  interface User {
    id: number,
    username: string,
    role: Role,
  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {}
