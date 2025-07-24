"use server";

import { PartnerType } from "@/generate/prisma";
import { ActionResponse, PartnerContacts } from "@/libs/definitions";
import prisma from "@/libs/prisma";

type ResponseContact = {
  contacts: PartnerContacts[];
  total: number;
};

export async function fetchContacts({
  search = "",
  skip,
  perPage,
  filter,
}: {
  search: string;
  filter: PartnerType;
  skip: number;
  perPage: number;
}): Promise<ActionResponse<ResponseContact>> {
  try {
    const displayType: PartnerType = filter;
    const contacts = await prisma.partner.findMany({
      where: {
        displayType,
        OR: [{ displayName: { contains: search, mode: "insensitive" } }],
      },
      include: {
        Image: true,
        CreateUid: true,
        UserId: true,
      },
      skip: (skip - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: "asc" },
    });

    const total = await prisma.partner.count({ where: { displayType } });

    return {
      success: true,
      message: "Contactos cargados",
      data: { contacts, total },
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: "Error al cargar Partner @trycatch",
    };
  }
}
