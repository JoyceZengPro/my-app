// pages/api/login.ts
import type { NextApiRequest,NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { username,password } = req.body

    try {
        // 查找用户（手机或邮箱）
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone: username },
                    { email: username }
                ]
            }
        })

        if (!user || !bcrypt.compareSync(password,user.password)) {
            return res.status(401).json({ message: '无效的账号或密码' })
        }

        // 生成JWT
        const token = jwt.sign(
            { userId: user.id,role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        )

        res.status(200).json({
            token,
            role: user.role,
            userId: user.id
        })
    } catch (error) {
        res.status(500).json({ message: '服务器错误' })
    }
}