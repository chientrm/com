import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { decodeJwt } from 'jose';
import './style.css';

function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const decoded = decodeJwt(token);
            setIsLoggedIn(true);
            setIsAdmin(decoded.role === 'admin');
        } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
        }
    }, []);

    const links = isLoggedIn
        ? [
              { to: '/profile', label: 'Profile' },
              ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
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
                    <Route
                        path="/login"
                        element={
                            <AuthForm
                                title="Login"
                                apiEndpoint="/api/login"
                                widgetId="turnstile-widget-login"
                                simpleValidation
                            />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <AuthForm
                                title="Register"
                                apiEndpoint="/api/register"
                                widgetId="turnstile-widget-register"
                                includePasswordConfirmation
                            />
                        }
                    />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route
                        path="/admin/journalctl"
                        element={<JournalctlLogs />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

function Home() {
    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Hello Vite!</h1>
        </div>
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
    const [serverError, setServerError] = useState('');

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
        setServerError('');
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
            setServerError(data.message);
            window.turnstile.reset(`#${widgetId}`);
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
            const decoded = decodeJwt(token);
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
            <div className="mt-4">
                <Link
                    to="/admin/journalctl"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary-hover"
                >
                    View System Logs
                </Link>
            </div>
        </div>
    );
}

function JournalctlLogs() {
    const [logs, setLogs] = useState([]);
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
                const logRows = data.logs.split('\n').filter((line) => line);
                setLogs(logRows);
            } else {
                const errorMessage =
                    response.status === 403
                        ? 'Access denied: You do not have permission to view logs'
                        : 'Failed to fetch logs';
                setError(errorMessage);
            }
        };

        fetchLogs();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <h2 className="text-2xl font-bold mb-2">System Logs</h2>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="flex-1 overflow-auto border border-gray-300 rounded-md">
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2 text-left">
                                    Log Entry
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => (
                                <tr
                                    key={index}
                                    className={
                                        index % 2 === 0
                                            ? 'bg-white'
                                            : 'bg-gray-100'
                                    }
                                >
                                    <td className="border border-gray-300 px-4 py-2 text-sm">
                                        {log}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
