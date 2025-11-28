import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';
import Login from './Login';

export default function ProtectedRoute({ children }) {
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Re-check authentication whenever the location changes
        setChecking(true);
        setAuthenticated(isAuthenticated());
        setChecking(false);
    }, [location.pathname]);

    if (checking) {
        return <div className="text-white text-center py-20">Loading...</div>;
    }

    if (!authenticated) {
        return <Login />;
    }

    return children;
}

