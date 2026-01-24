import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Notification } from '@/components/ui/Notification';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
	useEffect(() => {}, []);

	return (
		<Layout>
			<Component {...pageProps} />
			<Notification />
		</Layout>
	);
}
