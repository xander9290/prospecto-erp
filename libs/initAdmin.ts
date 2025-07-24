"use server";
// lib/initAdmin.ts
import bcrypt from "bcryptjs";

export async function initAdminUser() {
  const hashedPassword = await bcrypt.hash("4dm1n*", 10);
  console.log(hashedPassword);
}
