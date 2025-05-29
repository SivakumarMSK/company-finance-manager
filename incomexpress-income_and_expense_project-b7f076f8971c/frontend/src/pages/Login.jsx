import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageStyles/Login.css';
import axios from 'axios';
import Swal from 'sweetalert2';


const Login = () => {
    const navigate = useNavigate();
    const [uname, setUname] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLogin = async () => {
        const response  = await axios.post('http://localhost:3001/admin/login', {uname, password});
        if(response.data.success){
            //alert('Login Successfull')
            Swal.fire({
                title: "Login successful!",
                icon: "success"
              });
            navigate('/dashboard')
        }
        else{
            alert('invalid data')
        }
    }
    
    return (
        <div className="login-con">
            <h1>Anjana Infotech</h1>
            
            <form className='login-form'>
                <input
                    type="text"
                    placeholder="Username"
                    value={uname}
                    onChange={(e) => setUname(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="button" onClick={() => { handleLogin(); }}>Login</button>
            </form>
        </div>
    );
};

export default Login;
