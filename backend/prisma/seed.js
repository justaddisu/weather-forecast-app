import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config({ path: new URL("../.env", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1") });

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("DemoPass123!", 10);

  await prisma.user.upsert({
    where: { email: "demo@weatherflow.dev" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@weatherflow.dev",
      passwordHash,
    },
  });
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
