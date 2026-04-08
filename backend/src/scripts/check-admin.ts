import "dotenv/config";
import prisma from "../config/prisma";

const main = async () => {
  const email = process.env.ADMIN_EMAIL;

  if (!email) {
    console.error("ADMIN_EMAIL is not set in environment variables.");
    process.exitCode = 1;
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      year: true,
      createdAt: true,
    },
  });

  if (!user) {
    console.error("Admin user not found for ADMIN_EMAIL.");
    process.exitCode = 1;
    return;
  }

  if (user.role !== "ADMIN") {
    console.error("User found but role is not ADMIN.");
    console.log(user);
    process.exitCode = 1;
    return;
  }

  console.log("Admin verification successful.");
  console.log(user);
};

main()
  .catch((error) => {
    console.error("Admin verification failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
