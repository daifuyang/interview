import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "用户名和密码不能为空" },
        { status: 400 }
      );
    }

    const admin = await verifyAdmin(username, password);
    if (!admin) {
      return NextResponse.json(
        { error: "用户名或密码错误" },
        { status: 401 }
      );
    }

    const token = generateToken(admin);

    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "登录失败" },
      { status: 500 }
    );
  }
}
