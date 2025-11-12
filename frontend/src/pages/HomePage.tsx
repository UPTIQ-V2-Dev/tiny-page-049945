import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/services/auth';
import { getStoredUser, clearAuthData } from '@/lib/api';

export const HomePage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const user = getStoredUser();

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            clearAuthData();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
            // Clear local data even if API call fails
            clearAuthData();
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Welcome!</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <div className="space-y-2">
                        <p className="text-muted-foreground">
                            Hello, {user?.name || user?.email}!
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <Badge variant={user?.role === 'ADMIN' ? 'default' : 'secondary'}>
                                {user?.role}
                            </Badge>
                            {user?.isEmailVerified && (
                                <Badge variant="outline">Email Verified</Badge>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            You are successfully logged in to the application.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            User ID: {user?.id}
                        </p>
                    </div>

                    <Button onClick={handleLogout} disabled={isLoading} className="w-full">
                        {isLoading ? 'Signing out...' : 'Sign out'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};