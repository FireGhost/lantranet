import type { Role } from "@prisma/client"

// Add custom fields to the auth session.
declare module '#auth-utils' {
  interface User {
    id: number,
    username: string,
    role: Role,
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface UserSession {
    // Add your own fields
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface SecureSessionData {
    // Add your own fields
  }
}

export {}
