import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";

const parseYear = (value?: string): number | undefined => {
  if (!value) {
    return undefined;
  }

  const year = Number(value);
  return Number.isNaN(year) ? undefined : year;
};

const run = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME;
  const department = process.env.ADMIN_DEPARTMENT;
  const year = parseYear(process.env.ADMIN_YEAR);

  if (!email || !password || !name) {
    console.log(
      "Skipping admin seed. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME to seed an admin user.",
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      role: "ADMIN",
      department,
      year,
    },
    create: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      department,
      year,
    },
  });

  console.log("Admin seed completed.");
  console.log(`- id: ${adminUser.id}`);
  console.log(`- email: ${adminUser.email}`);
  console.log(`- role: ${adminUser.role}`);
};

run()
  .catch((error) => {
    console.error("Admin seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
