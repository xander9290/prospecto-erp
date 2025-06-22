"use server";

import { signIn } from "@/libs/auth";
import { ActionResponse } from "@/libs/definitions";
import prisma from "@/libs/prisma";
import bcrypt from "bcryptjs";

export async function userRequest({
  name,
  email,
}: {
  name: string;
  email: string;
}): Promise<ActionResponse<unknown>> {
  try {
    const emialExists = await prisma.request.findUnique({
      where: {
        email,
      },
    });

    if (emialExists) {
      return {
        success: false,
        message: "El correo ya tiene una solicitud asociada",
      };
    }

    const newRequest = await prisma.request.create({
      data: {
        name,
        email,
      },
    });

    if (!newRequest) {
      return {
        success: false,
        message: "Error al crear la solicitud",
      };
    }

    return {
      success: true,
      message: "Se ha creado la solicitud",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: "Error al crear solicitud",
    };
  }
}

export async function createUser({
  name,
  email,
  userName,
  password,
}: {
  name: string;
  email: string;
  userName: string;
  password: string;
}): Promise<ActionResponse<unknown>> {
  try {
    const emialExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emialExists) {
      return {
        success: false,
        message: "El correo ya tiene un usuario asociado",
      };
    }

    const newPartner = await prisma.partner.create({
      data: {
        name,
        email,
      },
    });

    if (!newPartner) {
      return {
        success: false,
        message: "Error al crear Partner",
      };
    }

    const findRequest = await prisma.request.findUnique({
      where: {
        email,
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
        Partner: {
          connect: { id: newPartner.id },
        },
        Request: {
          connect: { email: findRequest?.email ?? undefined },
        },
      },
    });

    if (!newUser) {
      return {
        success: false,
        message: "Error al crear usuario",
      };
    }

    return {
      success: true,
      message: "El usuario se ha creado",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: "Error al crear usuario",
    };
  }
}

export async function loginUser({
  userName,
  password,
}: {
  userName: string;
  password: string;
}): Promise<ActionResponse<unknown>> {
  try {
    const res = await signIn("credentials", {
      email: userName,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "Se ha iniciado la sesión",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Error al validar credenciales",
    };
  }
}
