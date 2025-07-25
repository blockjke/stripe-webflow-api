const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'Enterprise Plan - $299/month' },
                    unit_amount: 29900,
                    recurring: { interval: 'month' },
                },
                quantity: 1,
            }],
            success_url: `${process.env.ALLOWED_ORIGIN}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.ALLOWED_ORIGIN}/cancel`,
        });

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
