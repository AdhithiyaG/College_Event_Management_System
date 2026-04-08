import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";

type CliArgs = {
  email?: string;
  password?: string;
  name?: string;
  department?: string;
  year?: number;
};

const parseArgs = (): CliArgs => {
  const args = process.argv.slice(2);
  const parsed: CliArgs = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (!arg.startsWith("--")) {
      continue;
    }

    const key = arg.slice(2);
    const next = args[i + 1];

    if (!next || next.startsWith("--")) {
      continue;
    }

    if (key === "year") {
      const parsedYear = Number(next);
      if (!Number.isNaN(parsedYear)) {
        parsed.year = parsedYear;
      }
    } else if (key === "email") {
      parsed.email = next;
    } else if (key === "password") {
      parsed.password = next;
    } else if (key === "name") {
      parsed.name = next;
    } else if (key === "department") {
      parsed.department = next;
    }

    i += 1;
  }

  return parsed;
};

const printUsage = () => {
  console.log("Usage:");
  console.log(
    'npm run create:admin -- --email admin@college.edu --password StrongPass123 --name "Admin User" [--department CSE] [--year 4]',
  );
};

const main = async () => {
  const { email, password, name, department, year } = parseArgs();

  if (!email || !password || !name) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name,
        password: hashedPassword,
        role: "ADMIN",
        department,
        year,
      },
    });

    console.log("Updated existing user to ADMIN:");
    console.log(`- id: ${updatedUser.id}`);
    console.log(`- email: ${updatedUser.email}`);
    console.log(`- role: ${updatedUser.role}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      department,
      year,
    },
  });

  console.log("Created ADMIN user:");
  console.log(`- id: ${adminUser.id}`);
  console.log(`- email: ${adminUser.email}`);
  console.log(`- role: ${adminUser.role}`);
};

main()
  .catch((error) => {
    console.error("Failed to create admin user.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
