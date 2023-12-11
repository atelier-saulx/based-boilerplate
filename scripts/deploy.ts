// websitehook is for website branch and preview sites only
//
const mainhook =
  'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/5a101718-05f5-4113-b554-5a4efb78a096'

fetch(mainhook, {
  method: 'POST',
})
