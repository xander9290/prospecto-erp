"use server";

import { Partner, PartnerType } from "@/generate/prisma";
import { auth } from "@/libs/auth";
import { ActionResponse, PartnerContacts } from "@/libs/definitions";
import prisma from "@/libs/prisma";

export type ResponseContact = {
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

    const total = await prisma.partner.count({
      where: {
        displayType,
        OR: [{ displayName: { contains: search, mode: "insensitive" } }],
      },
    });

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

export async function fetchPartner({
  id,
}: {
  id: string | null;
}): Promise<ActionResponse<PartnerContacts>> {
  try {
    if (!id) {
      return {
        success: false,
        message: "MISSING {ID}",
      };
    }
    const partner = await prisma.partner.findUnique({
      where: {
        id,
      },
      include: {
        Image: true,
        CreateUid: true,
        UserId: true,
      },
    });

    if (!partner) {
      return {
        success: false,
        message: "PARTNER NOT FOUND",
      };
    }

    return {
      success: true,
      message: "PARTNER WAS FOUND",
      data: partner,
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: "Error al cargar Partner @trycatch",
    };
  }
}

type TNewPartner = Omit<
  Partner,
  "createdAt" | "updatedAt" | "createdById" | "displayName" | "id"
>;

export async function createPartner({
  data,
}: {
  data: TNewPartner;
}): Promise<ActionResponse<string>> {
  try {
    const session = await auth();

    const newPartner = await prisma.partner.create({
      data: {
        ...data,
        createdById: session?.user.id,
        displayName: `[${data.phone || ""}] ${data.name} - ${data.email || ""}`,
      },
    });

    if (!newPartner) {
      return {
        success: false,
        message: "PARTNER COULD NOT BE CREATED",
      };
    }
    return {
      success: true,
      message: "PARTNER HAS BEEN CREATED SUCCESSFULLY",
      data: newPartner.id,
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: "Error al cargar Partner @trycatch",
    };
  }
}
