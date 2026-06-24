// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = globalThis;

// // Tambahkan pengecekan instansiasi yang lebih ketat
// export const prisma =
//   globalForPrisma.__prisma ||
//   new PrismaClient({
//     log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
//   });

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.__prisma = prisma;
// }