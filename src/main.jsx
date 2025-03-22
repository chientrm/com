import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import javascriptLogo from './javascript.svg';
import './style.css';
import viteLogo from '/vite.svg';
import { decodeJwt } from 'jose'; // Use jose for decoding

function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decoded = decodeJwt(token); // Decode using jose
            setIsLoggedIn(true);
            setIsAdmin(decoded.role === 'admin'); // Check if the role is admin
        } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
        }
    }, []);

    const links = isLoggedIn
        ? [
              { to: '/profile', label: 'Profile' },
              ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []), // Show Admin link if user is admin
          ]
        : [
              { to: '/login', label: 'Login' },
              { to: '/register', label: 'Register' },
          ];

    return (
        <nav className="flex justify-between items-center mb-5">
            <div className="flex gap-4">
                <NavLink to="/" label="Home" />
            </div>
            <div className="flex gap-4">
                {links.map((link) => (
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
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin" element={<Admin />} />{' '}
                    {/* Admin route */}
                    <Route
                        path="/admin/journalctl"
                        element={<JournalctlLogs />}
                    />{' '}
                    {/* Journalctl route */}
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
            simpleValidation={true}
        />
    );
}

function RegisterForm() {
    return (
        <AuthForm
            title="Register"
            apiEndpoint="/api/register"
            widgetId="turnstile-widget-register"
            includePasswordConfirmation={true}
        />
    );
}

function AuthForm({
    title,
    apiEndpoint,
    widgetId,
    includePasswordConfirmation = false,
    simpleValidation = false,
}) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [captchaToken, setCaptchaToken] = useState(null);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(''); // State for server error message

    useEffect(() => {
        window.turnstile.render(`#${widgetId}`, {
            sitekey: import.meta.env.VITE_TURNSTILE_SITEKEY,
            callback: (token) => setCaptchaToken(token),
        });
    }, [widgetId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateInputs = () => {
        const newErrors = {};
        const { username, password, confirmPassword } = formData;

        if (simpleValidation) {
            if (!username) newErrors.username = 'Username is required.';
            if (!password) newErrors.password = 'Password is required.';
        } else {
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if (
                !username ||
                username.length < 3 ||
                username.length > 20 ||
                !usernameRegex.test(username)
            ) {
                newErrors.username =
                    'Username must be 3-20 characters and contain only letters, numbers, or underscores.';
            }

            if (!password || !passwordRegex.test(password)) {
                newErrors.password =
                    'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.';
            }

            if (includePasswordConfirmation && password !== confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(''); // Clear previous server error
        if (!validateInputs()) return;
        if (!captchaToken) return setServerError('Please complete the CAPTCHA');

        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, captchaToken }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            window.location.href = '/';
        } else {
            setServerError(data.message); // Display server error message
            window.turnstile.reset(`#${widgetId}`); // Reset CAPTCHA widget
        }
    };

    return (
        <form
            className="max-w-sm mx-auto p-6 border rounded-md shadow-md space-y-4"
            onSubmit={handleSubmit}
        >
            <h2 className="text-2xl font-bold">{title}</h2>
            {serverError && (
                <p className="text-red-500 text-sm">{serverError}</p>
            )}
            <input
                className="w-full p-2 border rounded-md shadow-sm"
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
            />
            {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
            )}
            <input
                className="w-full p-2 border rounded-md shadow-sm"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
            />
            {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
            )}
            {includePasswordConfirmation && (
                <>
                    <input
                        className="w-full p-2 border rounded-md shadow-sm"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                            {errors.confirmPassword}
                        </p>
                    )}
                </>
            )}
            <div id={widgetId} className="mb-4"></div>
            <button
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
                type="submit"
            >
                {title}
            </button>
        </form>
    );
}

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decoded = decodeJwt(token); // Decode using jose
            setUser(decoded);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.href = '/';
    };

    if (!user) {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-bold">You are not logged in.</h1>
            </div>
        );
    }

    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome, {user.username}!</h1>
            <p className="text-lg mt-2">This is your profile page.</p>
            <button
                className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-md shadow-sm hover:bg-secondary-hover"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
}

function Admin() {
    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-lg mt-2">Welcome to the admin panel.</p>
            <JournalctlLogs />
        </div>
    );
}

function JournalctlLogs() {
    const [logs, setLogs] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            const response = await fetch('/api/admin/journalctl', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        'authToken'
                    )}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setLogs(data.logs);
            } else {
                const errorMessage =
                    response.status === 403
                        ? 'Access denied: You do not have permission to view logs'
                        : 'Failed to fetch logs';
                setError(errorMessage);
            }
        };

        fetchLogs().catch(() =>
            setError('An unexpected error occurred while fetching logs')
        );
    }, []);

    return (
        <div className="mt-4 text-left">
            <h2 className="text-2xl font-bold mb-2">System Logs</h2>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <pre className="bg-gray-100 p-4 rounded-md shadow-md overflow-auto max-h-96">
                    {logs}
                </pre>
            )}
        </div>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
