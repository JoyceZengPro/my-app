// pages/api/register.ts
import type { NextApiRequest,NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
// 手机号正则验证
const PHONE_REGEX = /^1[3-9]\d{9}$/
// 邮箱正则验证
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: '仅支持POST请求' })
    }

    const { phone,email,password } = req.body

    try {
        // 验证字段格式
        if (!PHONE_REGEX.test(phone)) {
            return res.status(400).json({ message: '无效的手机号码格式' })
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ message: '无效的邮箱格式' })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: '密码至少需要6位' })
        }

        // 检查账号是否已存在
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone: phone },
                    { email: email }
                ]
            }
        })

        if (existingUser) {
            if (existingUser.phone === phone) {
                return res.status(409).json({ message: '手机号已被注册' })
            }
            if (existingUser.email === email) {
                return res.status(409).json({ message: '邮箱已被注册' })
            }
        }

        // 密码加密
        const hashedPassword = await bcrypt.hash(password,12)

        // 创建新用户
        const newUser = await prisma.user.create({
            data: {
                phone: phone,
                email: email,
                password: hashedPassword,
                role: 'user' // 默认用户角色
            }
        })

        // 移除敏感信息后返回
        const { password: _,...safeUser } = newUser

        res.status(201).json({
            message: '注册成功',
            user: safeUser
        })

    } catch (error) {
        console.error('注册错误:',error)
        res.status(500).json({
            message: '服务器错误',
            //error: process.env.NODE_ENV === 'development' ? error.message: null
        })
    }
}