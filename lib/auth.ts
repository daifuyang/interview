import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export async function verifyAdmin(username: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    return null;
  }

  return { id: admin.id, username: admin.username };
}

export function generateToken(admin: { id: string; username: string }) {
  // 简单起见，使用 base64 编码，实际生产环境应使用 JWT
  return Buffer.from(JSON.stringify({
    id: admin.id,
    username: admin.username,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24小时过期
  })).toString("base64");
}

export function verifyToken(token: string) {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    if (decoded.exp < Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}
