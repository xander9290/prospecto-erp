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
  password?: string;
}): Promise<ActionResponse<string>> {
  try {
    const session = await auth();
    console.table({ name, userName, password, email });

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

    const hashedPassword = await bcrypt.hash(password || "1234", 10);

    const newUser = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
        createdById: session?.user.id || null,
        Partner: {
          connect: { id: newPartner.id },
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
      data: newUser.id,
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
    const result = await signIn("credentials", {
      email: userName,
      password,
      redirect: false,
    });

    const checkIsActive = await prisma.user.findUnique({
      where: {
        userName,
      },
    });

    if (checkIsActive?.state === "no_active") {
      return {
        success: false,
        message: result.error,
      };
    }

    return {
      success: true,
      message: "Se ha iniciado la sesión",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: "Credenciales inválidas o el usuario está inhabilitado",
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

    revalidatePath("/app/profile");

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

export async function changeUserPassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}): Promise<ActionResponse<unknown>> {
  try {
    const session = await auth();

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Usuario no encontrado",
      };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return {
        success: false,
        message: "Contraseña actual incorrecta",
      };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    if (!updatedUser) {
      return {
        success: false,
        message: "Error al actualizar la contraseña",
      };
    }

    return {
      success: true,
      message: "Contraseña actualizada correctamente",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error al cambiar la contraseña",
    };
  }
}

export async function updateUser({
  id,
  userName,
  name,
  state,
  email,
}: {
  id: string;
  userName: string;
  name: string;
  state: string;
  email: string;
}): Promise<ActionResponse<unknown>> {
  try {
    const changedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        userName,
        email,
        state,
        Partner: {
          update: {
            name,
            email,
          },
        },
      },
    });

    if (!changedUser) {
      return {
        success: false,
        message: "Error al editar usuario",
      };
    }

    revalidatePath("/app/settings/users");

    return {
      success: true,
      message: "Se ha editado el usuario",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      message: "Error al editar usuario @catch",
    };
  }
}
