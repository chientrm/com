import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import javascriptLogo from './javascript.svg';
import './style.css';
import viteLogo from '/vite.svg';

function NavBar() {
    const links = [
        { to: '/', label: 'Home' },
        { to: '/login', label: 'Login' },
        { to: '/register', label: 'Register' },
    ];

    return (
        <nav className="flex justify-between items-center mb-5">
            <div className="flex gap-4">
                <NavLink to="/" label="Home" />
            </div>
            <div className="flex gap-4">
                {links.slice(1).map((link) => (
                    <NavLink key={link.to} to={link.to} label={link.label} />
                ))}
            </div>
        </nav>
    );
}

function NavLink({ to, label }) {
    return (
        <Link
            to={to}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm"
        >
            {label}
        </Link>
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
            <ExternalLink
                href="https://vite.dev"
                imgSrc={viteLogo}
                alt="Vite logo"
            />
            <ExternalLink
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"
                imgSrc={javascriptLogo}
                alt="JavaScript logo"
            />
            <h1 className="text-3xl font-bold mb-4">Hello Vite!</h1>
            <div className="card p-4 border rounded-md shadow-md">
                <Counter />
            </div>
            <p className="mt-4 text-muted-foreground">
                Click on the Vite logo to
            </p>
        </div>
    );
}

function ExternalLink({ href, imgSrc, alt }) {
    return (
        <a href={href} target="_blank">
            <img src={imgSrc} className="w-20 mx-auto mb-4" alt={alt} />
        </a>
    );
}

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md shadow-sm"
            onClick={() => setCount((count) => count + 1)}
        >
            Count is {count}
        </button>
    );
}

function LoginForm() {
    return (
        <AuthForm
            title="Login"
            apiEndpoint="/api/login"
            widgetId="turnstile-widget-login"
        />
    );
}

function RegisterForm() {
    return (
        <AuthForm
            title="Register"
            apiEndpoint="/api/register"
            widgetId="turnstile-widget-register"
        />
    );
}

function AuthForm({ title, apiEndpoint, widgetId }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);

    useEffect(() => {
        const handleTurnstileCallback = (token) => {
            setCaptchaToken(token);
        };

        window.turnstile.render(`#${widgetId}`, {
            sitekey: import.meta.env.VITE_TURNSTILE_SITEKEY,
            callback: handleTurnstileCallback,
        });
    }, [widgetId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captchaToken) {
            alert('Please complete the CAPTCHA');
            return;
        }
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, captchaToken }),
        });
        const data = await response.json();
        alert(data.message);
    };

    return (
        <form
            className="max-w-sm mx-auto p-4 border rounded-md shadow-md"
            onSubmit={handleSubmit}
        >
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
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
            <div id={widgetId} className="mb-3"></div>
            <button
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
                type="submit"
            >
                {title}
            </button>
        </form>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
