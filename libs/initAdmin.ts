"use server";
// lib/initAdmin.ts
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export async function initAdminUser() {
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    const newPartner = await prisma.partner.create({
      data: {
        name: "Admin",
      },
    });

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await prisma.user.create({
      data: {
        userName: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        Partner: {
          connect: { id: newPartner.id },
        },
      },
    });

    console.log("Usuario admin inicial creado");
  }
}
