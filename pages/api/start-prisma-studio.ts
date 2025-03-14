// pages/api/start-prisma-studio.ts
import { exec } from 'child_process'
import type { NextApiRequest,NextApiResponse } from 'next' // 添加 Next.js 类型

export default async (
    req: NextApiRequest,   // 明确请求类型
    res: NextApiResponse   // 明确响应类型
) => {
    // 安全检查
    if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({ error: '禁止在生产环境执行此操作' })
    }

    // 启动 Prisma Studio
    exec('npx prisma studio',(error,stdout,stderr) => {
        if (error) {
            console.error(`执行错误: ${error}`)
            return res.status(500).json({ error: '启动失败' })
        }
        console.log(`输出: ${stdout}`)
        res.status(200).json({ message: '已启动' })
    })
}
