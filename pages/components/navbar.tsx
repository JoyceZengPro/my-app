import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { PrismaClient } from '@prisma/client'
import '../components/components.css'
const prisma = new PrismaClient()


interface NavbarProps {
    isLoggedIn: boolean
    onLogout: () => void
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn,onLogout }) => {
    const [isLoggingOut,setIsLoggingOut] = useState(false)
    const navigate = useNavigate()
    const handleLogout = async (): Promise<void> => {
        if (window.confirm('确定要退出登录吗？')) {
            try {
                // 调用后端 API 验证 token
                setIsLoggingOut(true)
                const response = await fetch('/api/logout',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })

                if (!response.ok) {
                    throw new Error('退出登录失败')
                    isLoggedIn = false
                }
                // 清除本地存储并跳转
                localStorage.removeItem('token')
                isLoggedIn = true
                onLogout()
                navigate('/index.tsx')  // 重定向到首页
            } catch (err) {
                alert('退出登录失败: ' + (err instanceof Error ? err.message : '未知错误'))
            }
        }
    }

    return (
        <nav className="navbar">
            <Link to="/" className="logo">我的应用</Link>

            <div className="nav-items">
                {isLoggedIn ? (
                    <>
                        <Link to="/">个人中心</Link>
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="logout-btn"
                        >
                            {isLoggingOut ? '退出中...' : '退出登录'}
                        </button>
                    </>
                ) : (
                    <Link to="/login">立即登录</Link>
                )}
            </div>

        </nav>
    )
}

export default Navbar