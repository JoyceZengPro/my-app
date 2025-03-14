// prisma/index.d.ts
declare module '*.prisma' {
    import { PrismaClient } from '@prisma/client'
    const prisma = new PrismaClient()
    export default prisma
}
//需要执行npx prisma migrate dev 创建user用户
//执行 npx prisma studio查询数据库