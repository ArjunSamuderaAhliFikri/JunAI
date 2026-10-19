/** @format */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed Roles
  const adminRole = await prisma.role.upsert({
    where: { code: "ADMIN" },
    update: {},
    create: {
      name: "Administrator",
      code: "ADMIN",
      is_active: true,
    },
  });

  const memberRole = await prisma.role.upsert({
    where: { code: "MEMBER" },
    update: {},
    create: {
      name: "Team Member",
      code: "MEMBER",
      is_active: true,
    },
  });

  console.log("✅ Roles seeded:", { adminRole: adminRole.name, memberRole: memberRole.name });

  // 2. Seed Default User
  const defaultUser = await prisma.user.upsert({
    where: { email: "admin@junai.local" },
    update: {},
    create: {
      username: "admin_junai",
      email: "admin@junai.local",
      password_hash: "$2b$10$e8w.dummyhashforinitializationpurposeonly",
      role_id: adminRole.id,
      status: "ACTIVE",
      is_verified: true,
    },
  });

  console.log("✅ Default user seeded:", defaultUser.username);

  // 3. Seed Sample Reminder
  const sampleReminder = await prisma.reminder.create({
    data: {
      title: "Weekly Sprint Kick Off",
      timeline_activity: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      type: "KICK_OFF",
      user_id: defaultUser.id,
    },
  });

  console.log("✅ Sample reminder seeded:", sampleReminder.title);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
