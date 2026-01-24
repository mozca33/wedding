import Head from 'next/head'
import { Hero } from '@/components/sections/Hero'
import { WeddingInfo } from '@/components/sections/WeddingInfo'
import { OurStory } from '@/components/sections/OurStory'
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
      </Head>

      <main>
        <Hero />
        <WeddingInfo />
        <OurStory />
        <GiftList />
        <Gallery />
        <RSVP />
        <Contact />
      </main>
    </>
  )
}