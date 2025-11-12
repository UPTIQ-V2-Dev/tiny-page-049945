const { PrismaClient, Prisma } = require('@prisma/client')

// Create and configure the Prisma Client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Export essential enums
const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN'
}

const TokenType = {
  ACCESS: 'ACCESS',
  REFRESH: 'REFRESH',
  RESET_PASSWORD: 'RESET_PASSWORD',
  VERIFY_EMAIL: 'VERIFY_EMAIL'
}

module.exports = {
  PrismaClient,
  Prisma,
  Role,
  TokenType,
  default: prisma
}

// Also export as ES modules
module.exports.PrismaClient = PrismaClient
module.exports.Prisma = Prisma
module.exports.Role = Role
module.exports.TokenType = TokenType
module.exports.default = prisma