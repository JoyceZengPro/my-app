// pages/login.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import '../styles/Login.css'

export default function LoginPage() {
    const [isPhoneLogin,setIsPhoneLogin] = useState(true)
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/login',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username,password }),
            })

            const data = await response.json()
            if (response.ok) {
                localStorage.setItem('token',data.token)
                localStorage.setItem('role',data.role)
                router.push('/dashboard')
            } else {
                setError(data.message || '登录失败')
            }
        } catch (err) {
            setError('网络请求失败')
        }
    }

    return (

        <div className="login-container">
            <div className="Header">
                <img src='/fireFly.png' className="logo"></img>
                <span className="company-name">萤火平台 | 工作站</span>
            </div>
            <div className="login-form">
                <h1>萤火平台登录</h1>
                <div className="toggle-buttons">
                    <button onClick={() => setIsPhoneLogin(true)}>手机登录</button>
                    <button onClick={() => setIsPhoneLogin(false)}>邮箱登录</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>{isPhoneLogin ? '手机号码' : '邮箱地址'}</label>
                        <input
                            type={isPhoneLogin ? 'tel' : 'email'}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            pattern={isPhoneLogin ? '\\d{11}' : undefined}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="submit-btn" >登录</button>
                </form>

                <div className="register-link">
                    没有账号？<a href="/register">立即注册</a>
                </div>
            </div>
        </div>
    )
}