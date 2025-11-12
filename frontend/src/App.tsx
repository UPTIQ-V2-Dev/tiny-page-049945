import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { HomePage } from '@/pages/HomePage';
import { isAuthenticated } from '@/lib/api';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);

    useEffect(() => {
        // Check authentication status
        const checkAuth = () => {
            const authenticated = isAuthenticated();
            setIsAuth(authenticated);
        };

        checkAuth();

        // Listen for storage changes (logout from another tab)
        const handleStorageChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Loading state while checking authentication
    if (isAuth === null) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const authenticated = isAuthenticated();
    return authenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/login" 
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    } 
                />
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
