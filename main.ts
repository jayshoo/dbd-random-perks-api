import { makeRandomPerkPage } from './dbd-random-perks.ts'

addEventListener('fetch', event => {
  let url = new URL(event.request.url)
  let path = decodeURIComponent(url.pathname.slice(1))

  if (path.startsWith('favicon.ico'))
    return event.respondWith(new Response('', { status: 404 }))
  if (!url.searchParams.has('from'))
    return event.respondWith(new Response('need "from" query parameter', { status: 400 }))

  let from = parseInt(url.searchParams.get('from')!)
  if (isNaN(from) || from < 5 || from > 100)
    return event.respondWith(new Response('invalid "from" query parameter', { status: 400 }))
    

  event.respondWith(makeRandomPerkPage(4, from))
})