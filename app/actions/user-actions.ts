"use server";

import { auth, signIn } from "@/libs/auth";
import { ActionResponse, User } from "@/libs/definitions";
import prisma from "@/libs/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

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
    await signIn("credentials", {
      email: userName,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "Se ha iniciado la sesión",
    };
  } catch (error: unknown) {
    console.log(error);
    return {
      success: false,
      message: "Error al validar credenciales",
    };
  }
}

export async function fetchUser({
  id,
}: {
  id: string;
}): Promise<ActionResponse<User>> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        Partner: true,
        Request: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Error al encontrar usuario",
      };
    }

    return {
      success: true,
      message: "Usuario encontrado",
      data: user,
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: "Error al traer usuraio",
    };
  }
}

export async function userImageUpdate(
  url: string
): Promise<ActionResponse<unknown>> {
  try {
    const session = await auth();

    const changedUser = await prisma.user.update({
      where: {
        id: session?.user?.id,
      },
      data: {
        imageUrl: url,
      },
    });

    if (!changedUser) {
      return {
        success: false,
        message: "Error al actualizar la url de la imagen",
      };
    }

    return {
      success: true,
      message: "Se ha actualizado la url de la imagen",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error al actualizar imageUrl (catch)",
    };
  }
}

export async function setUserDarkMode(
  darkMode: boolean
): Promise<ActionResponse<unknown>> {
  try {
    const session = await auth();
    await prisma.user.update({
      where: {
        id: session?.user?.id,
      },
      data: {
        darkMode,
      },
    });

    return {
      success: true,
      message: "SE ha establecido el modo oscuro",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error al actualizar imageUrl (catch)",
    };
  }
}

export async function updateUserProfile({
  name,
  email,
}: {
  name: string;
  email: string;
}): Promise<ActionResponse<unknown>> {
  try {
    const session = await auth();

    const changedUser = await prisma.user.update({
      where: {
        id: session?.user.id,
      },
      data: {
        email,
        Partner: {
          update: {
            email,
            name,
          },
        },
      },
    });

    if (!changedUser) {
      return {
        success: false,
        message: "Error al actualizar perfil",
      };
    }

    revalidatePath("/app/user");

    return {
      success: true,
      message: "Se ha actualizado perfil",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error al actualizar imageUrl (catch)",
    };
  }
}
