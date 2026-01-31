import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Difficulty, Prisma } from "@/lib/generated/prisma/client";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const search = searchParams.get("search");
    const favoritesOnly = searchParams.get("favoritesOnly") === "true";

    const where: Prisma.QuestionWhereInput = {};

    if (category && category !== "all") {
      where.category = { name: category };
    }

    if (difficulty && difficulty !== "all") {
      where.difficulty = difficulty as Difficulty;
    }

    if (favoritesOnly) {
      where.isFavorite = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const questions = await prisma.question.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, answer, categoryId, difficulty, tags } = body;

    const question = await prisma.question.create({
      data: {
        title,
        content,
        answer,
        categoryId,
        difficulty: difficulty as Difficulty,
        tags: tags?.join(",") || "",
      },
      include: { category: true },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Failed to create question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
