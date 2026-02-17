import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { Notification } from '@/components/ui/Notification';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const isAdminPage = router.pathname.startsWith('/admin');

	useEffect(() => {}, []);

	// Don't wrap admin pages in main Layout (they have their own AdminLayout)
	if (isAdminPage) {
		return (
			<>
				<Component {...pageProps} />
				<Notification />
			</>
		);
	}

	return (
		<Layout>
			<Component {...pageProps} />
			<Notification />
		</Layout>
	);
}
