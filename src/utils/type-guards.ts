type DecodedUser = {
  role: string
  user_id: string
  username: string
  sub: string
  iat: number
  exp: number
}

export function isDecodedUser(obj: unknown): obj is DecodedUser {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "role" in obj &&
    "user_id" in obj &&
    "username" in obj &&
    "sub" in obj &&
    "iat" in obj &&
    "exp" in obj
  );
}