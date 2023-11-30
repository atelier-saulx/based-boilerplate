import { generateKeyPair } from '@saulx/crypto'
;(async () => {
  const { publicKey, privateKey } = await generateKeyPair()
  console.log(publicKey, privateKey)
})()
