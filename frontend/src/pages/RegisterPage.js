import React, { useState } from 'react';
import API from '../services/api';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
const [role, setRole] = useState('consumer');
    const registerUser = async (e) => {
        e.preventDefault();

        try {
            await API.post('/auth/register', {
                name,
                email,
                password,
                role: role
            });

            alert('Registration successful');
            window.location.href = '/';

        } catch (error) {
            alert('Registration failed');
        }
    };

    return (
        <div className="page">
            <h2>Create Princeify Account</h2>

            <form onSubmit={registerUser}>
                <input
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    required
                />

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
<select value={role} onChange={(e) => setRole(e.target.value)}>
    <option value="consumer">Consumer</option>
    <option value="creator">Creator</option>
</select>
                <button type="submit">Register</button>
            </form>

            <p>
                Already have account? <a href="/">Login</a>
            </p>
        </div>
    );
}

export default RegisterPage;