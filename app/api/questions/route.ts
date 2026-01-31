import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Category, Difficulty, Prisma } from "@/lib/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const search = searchParams.get("search");
    const favoritesOnly = searchParams.get("favoritesOnly") === "true";

    const where: Prisma.QuestionWhereInput = {};

    if (category && category !== "all") {
      where.category = category as Category;
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
    const body = await request.json();
    const { title, content, answer, category, difficulty, tags } = body;

    const question = await prisma.question.create({
      data: {
        title,
        content,
        answer,
        category: category as Category,
        difficulty: difficulty as Difficulty,
        tags: tags?.join(",") || "",
      },
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
