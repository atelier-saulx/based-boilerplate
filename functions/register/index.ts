import crypto from 'crypto'
import { Client as PostmarkClient } from 'postmark'

const generateInviteToken = (): Promise<string> =>
  new Promise((resolve) =>
    crypto.randomBytes(48, (_, buffer) => resolve(buffer.toString('hex')))
  )

export default async (based, payload) => {
  console.log('1')
  const postMarkKey = await based.query('based:secret', 'postmarkKey').get()
  const postMarkClient = new PostmarkClient(postMarkKey)
  const { email, name } = payload

  const user = await based.call('db:get', {
    $alias: email,
    createdAt: true,
    status: true,
  })
  console.log('2')

  if (!user.$isNull && user.status !== 'validation') {
    throw new Error('A user on this email address already exists')
  }
  const token = await generateInviteToken()
  console.log('3')
  const url = `https://${
    process.env.DOMAIN
  }/validateUser?token=${encodeURIComponent(token)}`

  await based.call('db:set', {
    type: 'user',
    $alias: [email, token],
    name: name,
    email: email,
    status: 'validation',
  })
  console.log('4')
  await postMarkClient.sendEmail({
    From: `ONCE Website <all@once.net>`,
    To: email,
    Subject: 'BASEDBOILERPLATE CMS Invitaion!',
    TextBody: `
       Your invitation to the BASEDBOILERPLATE CMS platform 
          `,
    HtmlBody: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="x-apple-disable-message-reformatting" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title></title>
            <style type="text/css" rel="stylesheet" media="all">
                 th {
                    text-align: center;
                    font-family: Arial;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 24px;
                    height:70px;
                    /* border:1px solid red; */
                    border-spacing: 2000px;
                  }
                  tr{
                    border-spacing: 20px;
                }
            </style>
            </head>

            <body>
              <div style="
              height: 100%;
              max-height: 844px;
              max-width: 598px;
              width: 100%;
              margin: auto;
              /* margin-top: 40px; */
              border:1px solid red;
              border: 1px solid #dfe3e7;
              ">
              <h1
              style="
                  color: #573fcf;
                  text-align: center;
                  font-family: Arial;
                  font-size: 40px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 40px;
                  height: 30px;
                  width: 100%;
                  text-align: center;
                  "
              >
              BASEDBOILERPLATE CMS
            </h1>
         <h3
              style="
                  color: #573fcf;
                  text-align: center;
                  font-family: Arial;
                  font-size: 40px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 40px;
                  height: 30px;
                  width: 100%;
                  text-align: center;
                  "
              >
              Welcome ${name}
            </h3>
            <table
            style="
        
                  margin: auto;
                  margin-top: 34px;
                  width: 80%;
                  "
              >
        
                <tr>
                  <th style="width: 50%;">Please confirm your emailaddress to register your email to BASEDBOILERPLATE CMS.</th>
                </tr>
      
              </table>
              <div style="
              margin: 10px auto;
              width: 240px;
              padding: 4px;
              height:50px;
              gap: 10px;
              border-radius: 12px;
              background: #573fcf;
              text-align: center;
              line-height: 50px;
              margin-bottom:34px;
            ">
              <a style="color:white; text-align: center; margin: 0 auto; width:360px;height:64px;padding:16px;  text-decoration: none" target="_blank" href="${url}">
                CONFIRM EMAIL ADDRESS
              </a>
            </div>
              
            </div>
            </body>
    </html>`,
  })
}
