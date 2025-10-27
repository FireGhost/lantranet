import { PrismaClient } from "~~/prisma/generated/prisma/client";

const prisma = new PrismaClient();

export const usePrisma = () => prisma;
