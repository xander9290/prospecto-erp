"use server";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

const allowedModels = {
  partner: prisma.partner,
  user: prisma.user,
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ model: string }> }
) {
  const { model } = await context.params;
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q")?.toLowerCase() || "";
  const id = searchParams.get("id");

  const db = allowedModels[model as keyof typeof allowedModels];
  if (!db) {
    return NextResponse.json(
      { success: false, message: "Modelo no permitido" },
      { status: 400 }
    );
  }

  // 🔍 Carga por ID
  if (id) {
    try {
      //@ts-expect-error modelos mixtos
      const record = await db.findUnique({
        where: { id: typeof id === "string" && !isNaN(+id) ? +id : id },
      });

      if (!record) {
        return NextResponse.json({
          success: false,
          message: "Registro no encontrado",
        });
      }

      // Devuelve TODO el registro
      return NextResponse.json({
        success: true,
        data: { ...record, label: record.displayName },
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, message: "Error al buscar por ID" },
        { status: 500 }
      );
    }
  }

  try {
    let results;

    if (query) {
      //@ts-expect-error modelos mixtos
      results = await db.findMany({
        where: {
          displayName: {
            contains: query,
            mode: "insensitive",
          },
        },
        take: 10,
        orderBy: { id: "desc" },
      });
    } else {
      //@ts-expect-error modelos mixtos
      results = await db.findMany({
        take: 8,
        orderBy: { id: "desc" },
      });
    }

    // Agrega label a cada objeto
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const withLabel = results.map((r: any) => ({
      ...r,
      label: r.displayName,
    }));

    return NextResponse.json({ success: true, data: withLabel });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error al obtener datos" },
      { status: 500 }
    );
  }
}
