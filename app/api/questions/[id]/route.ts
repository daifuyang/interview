import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Difficulty, Prisma } from "@/lib/generated/prisma/client";
import { verifyToken } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const question = await prisma.question.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("Failed to fetch question:", error);
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const decoded = verifyToken(token || "");
    
    const { id } = await params;
    const body = await request.json();

    // 如果没有 token，只允许更新 isFavorite
    if (!decoded) {
      const { isFavorite } = body;
      if (isFavorite === undefined) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      const question = await prisma.question.update({
        where: { id },
        data: { isFavorite },
        include: { category: true },
      });
      return NextResponse.json(question);
    }

    // 管理员可以更新所有字段
    const { title, content, answer, categoryId, difficulty, tags, isFavorite } = body;
    
    const data: Prisma.QuestionUpdateInput = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (answer !== undefined) data.answer = answer;
    if (categoryId !== undefined) data.category = { connect: { id: categoryId } };
    if (difficulty !== undefined) data.difficulty = difficulty as Difficulty;
    if (tags !== undefined) data.tags = tags?.join(",") || "";
    if (isFavorite !== undefined) data.isFavorite = isFavorite;

    const question = await prisma.question.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("Failed to update question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.question.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete question:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
