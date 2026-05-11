import React, { useState } from 'react';
import API from '../services/api';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post('/auth/login', {
                email,
                password
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            localStorage.setItem('userName', res.data.user.name);
            alert('Login successful');
            window.location.href = '/gallery';

        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div className="page">
            <h2>Login to Princeify</h2>

            <form onSubmit={loginUser}>
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>
            </form>

            <p>
                No account? <a href="/register">Register</a>
            </p>
        </div>
    );
}

export default LoginPage;