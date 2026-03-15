import React, { useState } from 'react'
import {useAuth} from '../hooks/useAuth.js'
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {

    const {loading, handleRegister} = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password:"",
        fullName: ""
    })

    const handleChange = (e)=>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();

        const result = await handleRegister(form.username, form.email, form.password, form.fullName);

        if(result.success){
            navigate("/")
        }else{
            alert(result.message);
        }
    }

    return (
        <div className="registerPageDiv">
            <div className="registerFormDiv">
                <h4 className='heading'>Register to FaceBeats</h4>
                <form className='formDiv' onSubmit={handleSubmit}>
                    <div className="inputDiv">
                        <div className="inputs usernameDiv">
                            <label>Enter Your Username:</label>
                            <input value={form.username} onChange={handleChange} type="text" name='username' placeholder='Username' />
                        </div>

                        <div className="inputs emailDiv">
                            <label>Enter Your E-Mail</label>
                            <input value={form.email} onChange={handleChange} type="text" name='email' placeholder='E-Mail' />
                        </div>

                        <div className="inputs passwordDiv">
                            <label>Enter Your Password: </label>
                            <input value={form.password} onChange={handleChange} type="password" name='password' placeholder='Password' />
                        </div>

                        <div className='inputs fullnamediv'>
                            <label>Enter Your Fullname</label>
                            <input value={form.fullName} onChange={handleChange} type="text" name='fullName' placeholder='Full Name' />
                        </div>
                    </div>
                    <button type='submit' className='primaryButton'>
                        Register
                    </button>
                    <p>Already Registered? <Link to='/login' className='linkTag'>Login</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Register