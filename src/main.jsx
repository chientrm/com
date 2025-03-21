import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import javascriptLogo from './javascript.svg';
import viteLogo from '/vite.svg';

function App() {
    return (
        <div>
            <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
                <img src={javascriptLogo} className="logo vanilla" alt="JavaScript logo" />
            </a>
            <h1>Hello Vite!</h1>
            <div className="card">
                <Counter />
            </div>
            <p className="read-the-docs">
                Click on the Vite logo to learn more
            </p>
            <LoginForm />
            <RegisterForm />
        </div>
    );
}

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount((count) => count + 1)}>
            Count is {count}
        </button>
    );
}

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        alert(data.message);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
}

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        alert(data.message);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Register</button>
        </form>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
