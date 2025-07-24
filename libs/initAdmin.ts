"use server";

import bcrypt from "bcryptjs";
import prisma from "./prisma";

export async function initAdminUser() {
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    const hashedPassword = await bcrypt.hash("1234abcd", 10);

    await prisma.partner.create({
      data: {
        name: "admin",
        displayName: "admin",
        email: "admin@correo.com",
        User: {
          create: {
            userName: "admin",
            email: "admin@correo.com",
            password: hashedPassword,
            displayName: "admin - admin@correo.com",
            state: "activo",
          },
        },
      },
    });
  }
}
