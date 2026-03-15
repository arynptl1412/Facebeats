import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../style/form.scss'
import { useAuth } from '../hooks/useAuth.js'

const Login = () => {

    const { handleLogin, loading } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await handleLogin(form.email, form.password);

        if (result.success) {
            navigate("/")
        } else {
            alert(result.message);
        }
    }

    return (
        <div className="loginPageDiv">
            <div className="loginFormDiv">
                <h4 className='heading'>Please Login Before Music</h4>
                <form className='formDiv' onSubmit={handleSubmit}>
                    <div className="inputDiv">
                        <div className="emailDiv inputs">
                            <label htmlFor="email">Enter your Email:</label>
                            <input value={form.email} onChange={handleChange} type="text" placeholder='E-Mail' name='email' />
                        </div>
                        <div className="passDiv inputs">
                            <label htmlFor="password">Enter your Password:</label>
                            <input value={form.password} onChange={handleChange} type="password" placeholder='Password' name='password' />
                        </div>
                    </div>
                    <button type='submit' className='primaryButton' disabled={loading}>
                        {loading ? "Logging In..." : "Login"}
                    </button>
                    <p>New User? <Link to='/register' className='linkTag'>Register</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Login