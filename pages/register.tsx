// pages/register.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import '../styles/Register.css'

export default function RegisterPage() {
    const [phone,setPhone] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/register',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone,email,password }),
            })

            if (response.ok) {
                router.push('/index.tsx')
            } else {
                const data = await response.json()
                setError(data.message || '注册失败')
            }
        } catch (err) {
            setError('网络请求失败')
        }
    }

    return (
        <div className="register-container">
            <div className="Header">
                <img src='/fireFly.png' className="logo"></img>
                <span className="company-name">萤火平台 | 工作站</span>
            </div>
            <div className='register-form'>
                <h1>萤火平台 注册新账号</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>手机号码</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            pattern="\d{11}"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>邮箱地址</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

                    <button type="submit">注册</button>
                    <button type="submit">登录</button>
                </form>
            </div>
        </div>
    )
}