import { PrismaClient } from '@prisma/client'
const bcrypt = require('bcrypt');

const prisma = new PrismaClient()

async function main() {
    const password = bcrypt.hashSync("@password", 10)

    const superAdminSeed = await prisma.user.create({
      data: {
        name : "admin",
        email: "admin@on.id",
        role: "ADMIN",
        password
      }
    })
    console.log({superAdminSeed});
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })