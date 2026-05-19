import Head from 'next/head'
import { Hero } from '@/components/sections/Hero'
import { WeddingInfo } from '@/components/sections/WeddingInfo'
import { OurStory } from '@/components/sections/OurStory'
import { GuestMessages } from '@/components/sections/GuestMessages'
import { GiftList } from '@/components/sections/GiftList'
import { Gallery } from '@/components/sections/Gallery'
import { RSVP } from '@/components/sections/RSVP'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <Head>
        <title>Julia & Rafael - Nosso Casamento</title>
        <meta name="description" content="Celebre com a gente esse dia especial! Confirme sua presença e compartilhe os momentos com a gente!" />
        <meta name="theme-color" content="#1a1a1a" />
        <link rel="canonical" href="https://wedding-site-pied-eta.vercel.app/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Julia & Rafael" />
        <meta property="og:title" content="Julia & Rafael — 25 de Julho de 2026" />
        <meta property="og:description" content="Celebre com a gente esse dia especial! Confirme sua presença e compartilhe os momentos com a gente." />
        <meta property="og:url" content="https://wedding-site-pied-eta.vercel.app/" />
        <meta property="og:image" content="https://wedding-site-pied-eta.vercel.app/images/hero/capa.jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Julia & Rafael — 25 de Julho de 2026" />
        <meta name="twitter:description" content="Celebre com a gente esse dia especial!" />
        <meta name="twitter:image" content="https://wedding-site-pied-eta.vercel.app/images/hero/capa.jpeg" />
      </Head>

      <main>
        <Hero />
        <WeddingInfo />
        <OurStory />
        <GuestMessages />
        <GiftList />
        <Gallery />
        <RSVP />
        <Contact />
      </main>
    </>
  )
}