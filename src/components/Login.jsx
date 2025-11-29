import { useState, useRef, useEffect } from 'react';
import { login } from '../lib/auth';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const usernameRef = useRef(null);

    useEffect(() => {
        usernameRef.current?.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password');
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            if (login(username, password)) {
                window.location.href = '/admin';
            } else {
                setError('Invalid username or password');
                setIsSubmitting(false);
            }
        }, 300);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="card fade-in w-full max-w-md relative overflow-hidden backdrop-blur-xl bg-slate-900/40 border border-white/10 shadow-2xl !p-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600"></div>

                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold mb-2 text-white">Admin Login</h2>
                    <p className="text-slate-400">Enter your credentials to access the admin dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="relative">
                        <label htmlFor="username" className="label">Username</label>
                        <input
                            ref={usernameRef}
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            className="input"
                            autoComplete="username"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="label">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="input"
                            autoComplete="current-password"
                            disabled={isSubmitting}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`btn btn-primary w-full py-4 text-lg shadow-lg shadow-sky-500/20 mt-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

