"use server";
// lib/initAdmin.ts
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export async function initAdminUser() {
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    const hashedPassword = await bcrypt.hash("4dm1n*", 10);

    await prisma.partner.create({
      data: {
        name: "admin",
        displayName: "admin",
        userUid: {
          create: {
            userName: "admin",
            displayName: "admin - admin@correo.com",
            email: "admin@correo.com",
            password: hashedPassword,
          },
        },
      },
    });

    console.log("Usuario admin inicial creado");
  }
}
