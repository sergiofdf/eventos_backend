export interface UserPayload {
  sub: string;
  email: string;
  role: number;
  iat?: number;
  exp?: number;
}
