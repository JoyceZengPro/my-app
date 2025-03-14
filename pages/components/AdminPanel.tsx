// components/AdminPanel.js
import React from 'react'
import { useState } from 'react'
import '../components/components.css'
import api from '../api/api'

interface StudioInfo {
    message: string
    port?: number
}

const AdminPanel = () => {
    const [studioInfo,setStudioInfo] = useState<StudioInfo | null>(null)
    const [isLoading,setIsLoading] = useState(false)
    const startPrismaStudio = async () => {
        if (!confirm('确定要启动数据库管理工具吗？')) return

        setIsLoading(true)
        try {
            const response = await api.post<StudioInfo>('/admin/prisma-studio')

            setStudioInfo(response.data)
            console.log("启动成功",response.data)
            // 延迟打开确保服务已启动
            setTimeout(() => {
                window.open('http://localhost:5555','_blank')
            },1000)
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || '服务启动失败'
            console.error('Prisma Studio 启动失败:',{
                error,
                endpoint: '/admin/prisma-studio',
                timestamp: new Date().toISOString()
            })
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="admin-panel">
            <h2>管理员面板</h2>
            <button onClick={startPrismaStudio} className="studio-btn" >
                启动数据库管理工具
            </button>


        </div>
    )
}

export default AdminPanel