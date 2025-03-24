import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';
import { decodeJwt } from 'jose';
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
    Link,
    Route,
    BrowserRouter as Router,
    Routes,
    useParams,
} from 'react-router-dom';
import './style.css';

// Utility functions
function fetchWithAuth(url, options = {}) {
    const authToken = localStorage.getItem('authToken');

    const headers = {
        ...options.headers,
    };

    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`; // Ensure Authorization header is included
    }

    return fetch(url, {
        ...options,
        headers,
    });
}

function useAuth() {
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

    return { isLoggedIn, isAdmin };
}

// Components
function NavBar() {
    const { isLoggedIn, isAdmin } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const links = isLoggedIn
        ? [
              { to: '/profile', label: 'My Profile' },
              ...(isAdmin ? [{ to: '/admin', label: 'Admin Panel' }] : []),
              { to: '/gallery', label: 'Gallery' },
          ]
        : [
              { to: '/login', label: 'Sign In' },
              { to: '/register', label: 'Sign Up' },
              { to: '/gallery', label: 'Gallery' },
          ];

    return (
        <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <NavLink to="/" label="Home" />
                    </div>
                    <div className="hidden md:flex gap-6">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                label={link.label}
                            />
                        ))}
                    </div>
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-300"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <ul className="px-4 py-2 space-y-2">
                        {links.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className="block text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
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

function LogTable({ logs }) {
    const [expandedRows, setExpandedRows] = useState(new Set());
    const tableRef = useRef(null);

    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.scrollTop = tableRef.current.scrollHeight; // Auto-scroll to the bottom
        }
    }, [logs]); // Trigger scrolling whenever logs are updated

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
        <div ref={tableRef} className="h-full overflow-auto">
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

function LogsPage({ title, fetchLogsUrl }) {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState('');
    const [isPolling, setIsPolling] = useState(true);

    useEffect(() => {
        let intervalId;

        const fetchLogs = async () => {
            const response = await fetchWithAuth(fetchLogsUrl);
            if (response.ok) {
                const newLogs = await response.json();
                setLogs((prevLogs) =>
                    [...newLogs.logs, ...prevLogs].slice(0, 100)
                ); // Keep only the latest 100 logs
            } else {
                setError('Failed to fetch logs.');
                setIsPolling(false);
            }
        };

        if (isPolling) {
            fetchLogs(); // Fetch logs immediately
            intervalId = setInterval(fetchLogs, 5000); // Poll every 5 seconds
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [fetchLogsUrl, isPolling]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{title}</h2>
                <button
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setIsPolling(!isPolling)}
                >
                    {isPolling ? 'Pause' : 'Resume'}
                </button>
            </div>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="flex-1 overflow-auto border border-gray-300 rounded-md">
                    <LogTable logs={logs} />
                </div>
            )}
        </div>
    );
}

function JournalctlLogs() {
    return (
        <LogsPage title="System Logs" fetchLogsUrl="/api/admin/journalctl" />
    );
}

function ServiceLogs() {
    const { serviceName } = useParams();
    return (
        <LogsPage
            title={`Logs for Service: ${serviceName}`}
            fetchLogsUrl={`/api/admin/journalctl/${serviceName}`}
        />
    );
}

function LoginForm() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [captchaToken, setCaptchaToken] = useState(null);
    const [serverError, setServerError] = useState('');
    const widgetId = 'turnstile-widget-login';
    const widgetRef = useRef(null);

    useEffect(() => {
        widgetRef.current = window.turnstile.render(`#${widgetId}`, {
            sitekey: import.meta.env.VITE_TURNSTILE_SITEKEY,
            callback: (token) => setCaptchaToken(token), // Set CAPTCHA token
        });

        return () => {
            if (widgetRef.current) {
                window.turnstile.remove(`#${widgetId}`);
                widgetRef.current = null;
            }
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        if (!captchaToken) {
            return setServerError('Please complete the CAPTCHA.');
        }

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...formData, captchaToken }), // Include CAPTCHA token
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            window.location.href = '/';
        } else {
            setServerError(data.message);
        }
    };

    return (
        <form
            className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md space-y-4"
            onSubmit={handleSubmit}
        >
            <h2 className="text-xl font-semibold text-gray-800">Login</h2>
            {serverError && (
                <p className="text-sm text-red-600">{serverError}</p>
            )}
            <input
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                }
            />
            <input
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                }
            />
            <div id={widgetId} className="mb-4"></div>
            <button
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                type="submit"
            >
                Login
            </button>
        </form>
    );
}

function RegisterForm() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [captchaToken, setCaptchaToken] = useState(null);
    const [serverError, setServerError] = useState('');
    const widgetId = 'turnstile-widget-register';
    const widgetRef = useRef(null);

    useEffect(() => {
        widgetRef.current = window.turnstile.render(`#${widgetId}`, {
            sitekey: import.meta.env.VITE_TURNSTILE_SITEKEY,
            callback: (token) => setCaptchaToken(token), // Set CAPTCHA token
        });

        return () => {
            if (widgetRef.current) {
                window.turnstile.remove(`#${widgetId}`);
                widgetRef.current = null;
            }
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        if (!captchaToken) {
            return setServerError('Please complete the CAPTCHA.');
        }

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, captchaToken }), // Include CAPTCHA token
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            window.location.href = '/';
        } else {
            setServerError(data.message);
        }
    };

    return (
        <form
            className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md space-y-4"
            onSubmit={handleSubmit}
        >
            <h2 className="text-xl font-semibold text-gray-800">Register</h2>
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
            <input
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
            />
            <input
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
            />
            <div id={widgetId} className="mb-4"></div>
            <button
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                type="submit"
            >
                Register
            </button>
        </form>
    );
}

function Gallery() {
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [photoClasses, setPhotoClasses] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(9); // Default limit
    const fileInputRef = useRef(null);

    const calculateLimit = () => {
        const width = window.innerWidth;
        if (width >= 1024) return 9; // 3 images per row on large screens
        if (width >= 768) return 9; // 3 images per row on medium screens
        return 6; // 2 images per row on small screens
    };

    const fetchPhotos = async (page, limit) => {
        const response = await fetchWithAuth(
            `/api/gallery?page=${page}&limit=${limit}`
        );
        if (response.ok) {
            const data = await response.json();
            setPhotos(data.photos);
            setTotalPages(Math.ceil(data.total / limit));
        } else {
            setError('Failed to fetch photos.');
        }
    };

    const fetchPhotoClasses = async (photoId) => {
        const response = await fetchWithAuth(`/api/gallery/classes/${photoId}`);
        if (response.ok) {
            const data = await response.json();
            setPhotoClasses(data.classes);
        } else {
            setPhotoClasses([]);
            setError('Failed to fetch photo classes.');
        }
    };

    const handleResize = () => {
        const newLimit = calculateLimit();
        if (newLimit !== limit) {
            setLimit(newLimit);
            setPage(1); // Reset to the first page when limit changes
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const files = fileInputRef.current.files;
        if (!files || files.length === 0) {
            setError('No files selected for upload.');
            return;
        }

        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append('photos', file));

        const response = await fetchWithAuth('/api/gallery', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            fetchPhotos(page, limit);
        } else {
            const errorData = await response.json();
            setError(errorData.message || 'Failed to upload photos.');
        }
    };

    const handleDelete = async (photoId) => {
        if (!photoId) {
            console.error('Photo ID is null or undefined.');
            return;
        }

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this photo?'
        );
        if (!confirmDelete) {
            return;
        }

        const response = await fetchWithAuth(`/api/gallery/${photoId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            fetchPhotos(page, limit); // Refresh photos after deletion
        } else {
            const errorData = await response.json();
            setError(errorData.message || 'Failed to delete photo.');
        }
    };

    useEffect(() => {
        fetchPhotos(page, limit);
    }, [page, limit]);

    useEffect(() => {
        handleResize(); // Set initial limit
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4">My Gallery</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleUpload} className="mb-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="mb-2"
                    accept="image/*"
                    multiple
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                    Upload Photos
                </button>
            </form>
            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                        <div
                            key={photo.id}
                            className="relative w-full pt-[100%] bg-gray-100 rounded-md overflow-hidden"
                        >
                            <img
                                src={photo.url}
                                alt={photo.filename}
                                className="absolute top-0 left-0 w-full h-full object-cover"
                                onClick={() => {
                                    setSelectedPhoto(photo);
                                    fetchPhotoClasses(photo.id);
                                }}
                            />
                            <button
                                onClick={() => handleDelete(photo.id)}
                                className="absolute top-2 right-2 bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            {selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative bg-white p-4 rounded-md shadow-lg">
                        <img
                            src={selectedPhoto.url}
                            alt={selectedPhoto.filename}
                            className="max-w-full max-h-96 rounded-md mb-4"
                        />
                        <h3 className="text-lg font-bold mb-2">
                            Classifications:
                        </h3>
                        <ul className="list-disc list-inside mb-4">
                            {photoClasses.length > 0 ? (
                                photoClasses.map((cls, index) => (
                                    <li key={index}>
                                        {cls.className} -{' '}
                                        {(cls.probability * 100).toFixed(2)}%
                                    </li>
                                ))
                            ) : (
                                <li>No classifications available.</li>
                            )}
                        </ul>
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <Router>
            <div className="h-screen flex flex-col">
                <NavBar />
                <div className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8 md:px-8 py-6">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
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
                        <Route path="/gallery" element={<Gallery />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

function Home() {
    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to the App!</h1>
        </div>
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

function SystemctlServices() {
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchServices = async () => {
        setIsLoading(true);
        const response = await fetch(
            `/api/admin/systemctl?search=${encodeURIComponent(searchQuery)}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        'authToken'
                    )}`,
                },
            }
        );

        if (response.ok) {
            const data = await response.json();
            setServices(data.services); // Use the array directly
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
    }, [searchQuery]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">System Services</h2>
                <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                />
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

const root = createRoot(document.getElementById('app'));
root.render(<App />);
