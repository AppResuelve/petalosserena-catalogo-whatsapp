import { settingsService } from '@/services/storeService'
import { LocalBusinessJsonLd } from '@/components/seo/LocalBusinessJsonLd'
import HomeClient from './home-client'

export default async function HomePage() {
  let store = {}
  try { store = await settingsService.get() } catch {}

  return (
    <>
      <LocalBusinessJsonLd store={store} />
      <HomeClient />
    </>
  )
}
