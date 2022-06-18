const { PrismaClient } = require("@prisma/client");

export const prisma = global.prisma || new PrismaClient();

if(process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}