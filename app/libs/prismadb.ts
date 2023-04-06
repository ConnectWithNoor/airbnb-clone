import { PrismaClient } from "@prisma/client";

//  using Prisma on frontend which is not possible. it is only possible to be used in backend
//  and inside server components. To solve this issue,
//  we only initialize the prisma client once on server only and keep a referene
//  in the globalThis context. Also, The globalThis insn't affected by hot reload, hence it won't
//  create multiple instnaces of prisma client once it is initialized.

declare global {
  var prisma: PrismaClient | undefined;
}

// if already one instance of prisma client is available in the global this, use it
// else create new one.

const prismaClient = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma == prismaClient;
}

export default prismaClient;
