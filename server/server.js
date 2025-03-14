// server/server.js
const { exec } = require('child_process')

// 启动 Prisma Studio 的接口
app.post('/api/admin/start-prisma-studio', authMiddleware, adminMiddleware, (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
        return res.status(403).json({ error: '仅开发环境可用' })
    }

    const studioProcess = exec('npx prisma studio --port 5555',
        (error, stdout, stderr) => {
            if (error) {
                console.error(`执行错误: ${error}`)
                return
            }
        }
    )

    res.json({
        message: 'Prisma Studio 已启动于 http://localhost:5555',
        pid: studioProcess.pid
    })
})

// 管理员中间件
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'ADMIN') { // 假设用户信息包含role字段
        return res.status(403).json({ error: '权限不足' })
    }
    next()
}