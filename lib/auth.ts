export function verifyAdminAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  const password = authHeader?.replace('Bearer ', '');
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD || !password) return false;
  return password === ADMIN_PASSWORD;
}
