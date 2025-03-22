import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import javascriptLogo from './javascript.svg';
import "./style.css";
import viteLogo from '/vite.svg';

function NavBar() {
    return (
        <nav className="flex gap-4 mb-5">
            <Link to="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm">Home</Link>
            <Link to="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm">Register</Link>
        </nav>
    );
}

function App() {
    return (
        <Router>
            <div className="p-5">
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                </Routes>
            </div>
        </Router>
    );
}

function Home() {
    return (
        <div className="text-center">
            <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="w-20 mx-auto mb-4" alt="Vite logo" />
            </a>
            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
                <img src={javascriptLogo} className="w-20 mx-auto mb-4" alt="JavaScript logo" />
            </a>
            <h1 className="text-3xl font-bold mb-4">Hello Vite!</h1>
            <div className="card p-4 border rounded-md shadow-md">
                <Counter />
            </div>
            <p className="mt-4 text-muted-foreground">
                Click on the Vite logo to learn more
            </p>
        </div>
    );
}

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md shadow-sm" onClick={() => setCount((count) => count + 1)}>
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
        <form className="max-w-sm mx-auto p-4 border rounded-md shadow-md" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <input
                className="w-full mb-3 p-2 border rounded-md shadow-sm"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="w-full mb-3 p-2 border rounded-md shadow-sm"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm" type="submit">Login</button>
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
        <form className="max-w-sm mx-auto p-4 border rounded-md shadow-md" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <input
                className="w-full mb-3 p-2 border rounded-md shadow-sm"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="w-full mb-3 p-2 border rounded-md shadow-sm"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm" type="submit">Register</button>
        </form>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
