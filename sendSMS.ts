import { serve } from "https://deno.land/std/http/server.ts"

serve(async (req) => {
  const { telefone, mensagem } = await req.json()

  const accountSid = "SEU_SID"
  const authToken = "SEU_TOKEN"

  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(accountSid + ":" + authToken),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      To: telefone,
      From: "+123456789",
      Body: mensagem
    })
  })

  return new Response("SMS enviado")
})