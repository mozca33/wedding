// hooks/useAuth.ts
import { useState, useEffect, createContext, useContext } from 'react';

interface User {
	id: string;
	email: string;
	isAdmin: boolean;
}

interface AuthContextType {
	user: User | null;
	isAdmin: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const useAdminCheck = () => {
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkAdminStatus();

		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === 'wedding_admin_session') {
				checkAdminStatus();
			}
		};

		const handleAdminChange = () => {
			checkAdminStatus();
		};

		window.addEventListener('storage', handleStorageChange);
		window.addEventListener('adminStatusChanged', handleAdminChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			window.removeEventListener('adminStatusChanged', handleAdminChange);
		};
	});

	const checkAdminStatus = async () => {
		try {
			const adminSession = localStorage.getItem('wedding_admin_session');
			if (adminSession) {
				const session = JSON.parse(adminSession);
				const now = new Date().getTime();
				const sessionTime = new Date(session.timestamp).getTime();
				const hoursDiff = (now - sessionTime) / (1000 * 60 * 60);

				if (hoursDiff < 24) {
					setIsAdmin(true);
				} else {
					localStorage.removeItem('wedding_admin_session');
					setIsAdmin(false);
					window.dispatchEvent(new Event('adminStatusChanged'));
				}
			} else {
				setIsAdmin(false);
			}
		} catch (error) {
			console.error('Erro ao verificar admin:', error);
			setIsAdmin(false);
		} finally {
			setLoading(false);
		}
		console.log('Admin status checked:', isAdmin);
	};

	const loginAsAdmin = (password: string): boolean => {
		const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

		if (password === adminPassword) {
			const session = {
				isAdmin: true,
				timestamp: new Date().toISOString(),
			};
			localStorage.setItem('wedding_admin_session', JSON.stringify(session));
			setIsAdmin(true);

			window.dispatchEvent(new Event('adminStatusChanged'));

			setTimeout(() => {
				window.dispatchEvent(new Event('adminStatusChanged'));
			}, 100);

			return true;
		}
		return false;
	};

	const logoutAdmin = () => {
		localStorage.removeItem('wedding_admin_session');
		setIsAdmin(false);

		window.dispatchEvent(new Event('adminStatusChanged'));
	};

	return {
		isAdmin,
		loading,
		loginAsAdmin,
		logoutAdmin,
		checkAdminStatus,
	};
};
