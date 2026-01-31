import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { error: "未提供认证令牌" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "令牌无效或已过期" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: decoded.id,
        username: decoded.username,
      },
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "验证失败" },
      { status: 500 }
    );
  }
}
