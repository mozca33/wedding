import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Package, Users, LogOut, Menu, X } from 'lucide-react';

interface AdminLayoutProps {
	children: ReactNode;
	title?: string;
}

export default function AdminLayout({ children, title = 'Admin Panel' }: AdminLayoutProps) {
	const router = useRouter();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleLogout = () => {
		localStorage.removeItem('admin-authenticated');
		router.push('/admin');
	};

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/orders', label: 'Pedidos', icon: Package },
		{ href: '/admin/rsvp', label: 'Confirmações', icon: Users },
	];

	return (
		<div className="min-h-screen bg-cream-100">
			{/* Header */}
			<header className="bg-primary-500 text-cream-100 border-b border-primary-600">
				<div className="container-custom py-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 hover:bg-primary-600 transition-colors">
							{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
						<h1 className="text-xl font-medium">{title}</h1>
					</div>

					<button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 hover:bg-primary-600 transition-colors text-sm">
						<LogOut size={18} />
						<span className="hidden sm:inline">Sair</span>
					</button>
				</div>

				{/* Desktop Navigation */}
				<nav className="hidden md:block border-t border-primary-600">
					<div className="container-custom">
						<div className="flex gap-1">
							{navItems.map((item) => {
								const Icon = item.icon;
								const isActive = router.pathname === item.href;
								return (
									<Link
										key={item.href}
										href={item.href}
										className={`flex items-center gap-2 px-6 py-3 transition-colors ${
											isActive ? 'bg-primary-600 text-cream-100' : 'text-cream-100/80 hover:bg-primary-600 hover:text-cream-100'
										}`}
									>
										<Icon size={18} />
										{item.label}
									</Link>
								);
							})}
						</div>
					</div>
				</nav>
			</header>

			{/* Mobile Navigation */}
			{isMobileMenuOpen && (
				<nav className="md:hidden bg-white border-b border-neutral-200">
					<div className="container-custom py-2">
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = router.pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setIsMobileMenuOpen(false)}
									className={`flex items-center gap-3 px-4 py-3 transition-colors ${
										isActive ? 'bg-primary-500 text-cream-100' : 'text-primary-500 hover:bg-cream-200'
									}`}
								>
									<Icon size={18} />
									{item.label}
								</Link>
							);
						})}
					</div>
				</nav>
			)}

			{/* Main Content */}
			<main className="container-custom py-8">{children}</main>

			{/* Footer */}
			<footer className="border-t border-neutral-200 bg-white py-6 mt-12">
				<div className="container-custom text-center text-sm text-neutral-600">
					<p>Admin Panel - Julia & Rafael Wedding</p>
				</div>
			</footer>
		</div>
	);
}
