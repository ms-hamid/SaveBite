import "dotenv/config"

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

console.log(process.env.DATABASE_URL);

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };