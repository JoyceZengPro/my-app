// pages/dashboard.tsx
import { useEffect,useState } from 'react'
import { BrowserRouter } from "react-router-dom"
import { useRouter } from 'next/router'
import React from 'react'
import Navbar from './components/navbar'
import api from './api/api'
import '../styles/globals.css'
import AdminPanel from './components/AdminPanel'

export default function dashboard() {
    const router = useRouter()
    const [role,setRole] = useState<string | null>(null)
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/register')
        }
        // 仅在客户端执行
        const token = localStorage.getItem('token')
        const roles = localStorage.getItem('role')
        if (!token) router.push('/login') // 路由跳转
        setRole(roles) // 更新状态
    },[])
    const [isLoggedIn,setIsLoggedIn] = useState(false)

    // 检查登录状态
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await api.get('/api/check-auth')
                setIsLoggedIn(true)
            } catch (err) {
                setIsLoggedIn(false)
            }
        }
        checkAuth()
    },[])

    return (
        <div className='Container'>
            <BrowserRouter>
                <Navbar
                    isLoggedIn={isLoggedIn}
                    onLogout={() => {
                        setIsLoggedIn(false)
                        window.location.href = '/login'
                    }}
                />
            </BrowserRouter>
            <main className="admin-panel">
                {role === 'ADMIN' && (
                    <BrowserRouter>
                        <div className="user-panel">
                            <AdminPanel></AdminPanel>
                        </div>
                    </BrowserRouter>
                )}
                <section className="user-content" >
                    {/* {通用用户} */}
                </section>
            </main>

        </div>
    )
}