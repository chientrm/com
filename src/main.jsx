import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
    Link,
    Route,
    BrowserRouter as Router,
    Routes,
    useParams,
} from 'react-router-dom';
import { decodeJwt } from 'jose';
import './style.css';
import { ArrowPathIcon } from '@heroicons/react/24/outline'; // Import the icon

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
              { to: '/profile', label: 'My Profile' },
              ...(isAdmin ? [{ to: '/admin', label: 'Admin Panel' }] : []),
          ]
        : [
              { to: '/login', label: 'Sign In' },
              { to: '/register', label: 'Sign Up' },
          ];

    return (
        <nav className="sticky top-0 z-10 flex justify-between items-center mb-6 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
            {/* Added 'sticky top-0 z-10' to make the header sticky */}
            <div className="flex gap-6">
                <NavLink to="/" label="Home" />
            </div>
            <div className="flex gap-6">
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
        >
            {label}
        </Link>
    );
}

function App() {
    return (
        <Router>
            <div className="h-screen flex flex-col">
                <NavBar />
                <div className="flex-1 overflow-hidden px-4 py-6">
                    {/* Added padding to the main content */}
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
                        <Route
                            path="/admin/systemctl"
                            element={<SystemctlServices />}
                        />
                        <Route
                            path="/admin/journalctl/:serviceName"
                            element={<ServiceLogs />}
                        />
                    </Routes>
                </div>
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
        if (!captchaToken)
            return setServerError('Please complete the CAPTCHA.');

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
            className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md space-y-4"
            onSubmit={handleSubmit}
        >
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            {serverError && (
                <p className="text-sm text-red-600">{serverError}</p>
            )}
            <input
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
            />
            {errors.username && (
                <p className="text-sm text-red-600">{errors.username}</p>
            )}
            <input
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
            />
            {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
            )}
            {includePasswordConfirmation && (
                <>
                    <input
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                    />
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-600">
                            {errors.confirmPassword}
                        </p>
                    )}
                </>
            )}
            <div id={widgetId} className="mb-4"></div>
            <button
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
            <h1 className="text-2xl font-semibold text-gray-800">
                Admin Panel
            </h1>
            <p className="text-sm text-gray-600 mt-2">
                Manage system services and logs.
            </p>
            <div className="mt-6 flex justify-center gap-4">
                <Link
                    to="/admin/systemctl"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Services
                </Link>
                <Link
                    to="/admin/journalctl"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Logs
                </Link>
            </div>
        </div>
    );
}

function JournalctlLogs() {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchLogs = async () => {
        setIsLoading(true);
        const response = await fetch('/api/admin/journalctl', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            setLogs(data.logs); // Ensure logs are treated as an array
        } else {
            setError('Failed to fetch logs.');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="flex flex-col h-full">
            {' '}
            {/* Ensure the container fills the screen */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">System Logs</h2>
                <button
                    className={`p-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-100 ${
                        isLoading ? 'animate-spin' : ''
                    }`}
                    onClick={fetchLogs}
                    title="Refresh Logs"
                    disabled={isLoading}
                >
                    <ArrowPathIcon className="h-5 w-5" />
                </button>
            </div>
            {isLoading ? (
                <p className="text-center text-blue-500">Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="flex-1 overflow-auto border border-gray-300 rounded-md">
                    <LogTable logs={logs} />
                </div>
            )}
        </div>
    );
}

function SystemctlServices() {
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchServices = async () => {
        setIsLoading(true);
        const response = await fetch('/api/admin/systemctl', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            const serviceRows = data.services
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line);
            setServices(serviceRows);
        } else {
            const errorMessage =
                response.status === 403
                    ? 'Access denied: You do not have permission to view services'
                    : 'Failed to fetch services';
            setError(errorMessage);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">System Services</h2>
                <button
                    className={`p-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-100 ${
                        isLoading ? 'animate-spin' : ''
                    }`}
                    onClick={fetchServices}
                    title="Refresh Services"
                    disabled={isLoading}
                >
                    <ArrowPathIcon className="h-5 w-5" />
                </button>
            </div>
            {isLoading ? (
                <p className="text-center text-blue-500">Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="flex-1 overflow-auto border border-gray-300 rounded-md">
                    <table className="table-auto w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                    Unit
                                </th>
                                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                    Load
                                </th>
                                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                    Active
                                </th>
                                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                    Sub
                                </th>
                                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service, index) => {
                                const parts = service.split(/\s+/);
                                const unit = parts[0];
                                const load = parts[1];
                                const active = parts[2];
                                const sub = parts[3];
                                const description = parts.slice(4).join(' ');

                                return (
                                    <tr
                                        key={index}
                                        className={
                                            index % 2 === 0
                                                ? 'bg-white'
                                                : 'bg-gray-50'
                                        }
                                    >
                                        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700 truncate">
                                            <Link
                                                to={`/admin/journalctl/${unit}`}
                                                className="text-blue-500 hover:underline"
                                            >
                                                {unit}
                                            </Link>
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700 truncate">
                                            {load}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700 truncate">
                                            {active}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700 truncate">
                                            {sub}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700 truncate">
                                            {description}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function ServiceLogs() {
    const { serviceName } = useParams();
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchLogs = async () => {
        setIsLoading(true);
        const response = await fetch(`/api/admin/journalctl/${serviceName}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            setLogs(data.logs); // Ensure logs are treated as an array
        } else {
            setError('Failed to fetch logs.');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, [serviceName]);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                    Logs for Service: {serviceName}
                </h2>
                <button
                    className={`p-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-100 ${
                        isLoading ? 'animate-spin' : ''
                    }`}
                    onClick={fetchLogs}
                    title="Refresh Logs"
                    disabled={isLoading}
                >
                    <ArrowPathIcon className="h-5 w-5" />
                </button>
            </div>
            {/* Removed the "Back to Services" link */}
            {isLoading ? (
                <p className="text-center text-blue-500">Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="flex-1 border border-gray-300 rounded-md overflow-auto">
                    <LogTable logs={logs} />
                </div>
            )}
        </div>
    );
}

function LogTable({ logs }) {
    const [expandedRows, setExpandedRows] = useState(new Set());

    const toggleRowExpansion = (index) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(index)) {
            newExpandedRows.delete(index);
        } else {
            newExpandedRows.add(index);
        }
        setExpandedRows(newExpandedRows);
    };

    return (
        <div className="h-full overflow-auto">
            {/* Ensure the table fills the container and allows scrolling */}
            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Timestamp
                        </th>
                        <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Hostname
                        </th>
                        <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Service
                        </th>
                        <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                            PID
                        </th>
                        <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Priority
                        </th>
                        <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Message
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, index) => (
                        <tr
                            key={index}
                            className={
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }
                        >
                            <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700 truncate">
                                {new Date(
                                    parseInt(log.timestamp, 10)
                                ).toLocaleString()}
                            </td>
                            <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700 truncate">
                                {log.host || 'N/A'}
                            </td>
                            <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700 truncate">
                                {log.service ? (
                                    <Link
                                        to={`/admin/journalctl/${log.service}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        {log.service}
                                    </Link>
                                ) : (
                                    'N/A'
                                )}
                            </td>
                            <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700 truncate">
                                {log.pid || 'N/A'}
                            </td>
                            <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700 truncate">
                                {log.level || 'N/A'}
                            </td>
                            <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700">
                                <div
                                    className={`relative overflow-hidden ${
                                        expandedRows.has(index)
                                            ? ''
                                            : 'line-clamp-1'
                                    }`}
                                >
                                    {log.message || 'N/A'}
                                    {!expandedRows.has(index) &&
                                        log.message &&
                                        log.message.length > 100 && (
                                            <span className="absolute bottom-0 right-0 bg-white px-1 text-blue-500 cursor-pointer hover:underline">
                                                <button
                                                    onClick={() =>
                                                        toggleRowExpansion(
                                                            index
                                                        )
                                                    }
                                                >
                                                    More
                                                </button>
                                            </span>
                                        )}
                                </div>
                                {expandedRows.has(index) && log.message && (
                                    <button
                                        className="text-blue-500 hover:underline mt-1"
                                        onClick={() =>
                                            toggleRowExpansion(index)
                                        }
                                    >
                                        Less
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
