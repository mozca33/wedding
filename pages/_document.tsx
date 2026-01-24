import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <meta name="description" content="Site oficial do casamento de Julia & Rafael" />
        <meta name="keywords" content="casamento, wedding, Maria, João, RSVP, lista de presentes" />
        <meta property="og:title" content="Julia & Rafael - Nosso Casamento" />
        <meta property="og:description" content="Celebre conosco o nosso dia especial!" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/couple-photo.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}