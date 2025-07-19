"use server";

import { ActionResponse } from "./definitions";
import prisma from "./prisma";

export async function many2oneSource({
  model,
  label,
}: {
  model: string;
  label: string;
}): Promise<ActionResponse<unknown>> {
  try {
    const allowedModels = {
      partner: prisma.partner,
    };

    const client = allowedModels[model as keyof typeof allowedModels];
    if (!client) {
      return { success: false, message: "Modelo no permitido" };
    }

    const response = await client.findMany({
      where: {
        name: {
          contains: label,
          mode: "insensitive",
        },
      },
      take: 10,
    });

    const mapped = response.map((record: any) => ({
      id: record.id,
      label: record.name,
    }));

    return {
      success: true,
      message: "Datos encontrados",
      data: mapped,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error al obtener datos",
    };
  }
}
