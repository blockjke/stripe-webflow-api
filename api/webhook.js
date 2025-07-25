const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const config = {
    api: { bodyParser: { sizeLimit: '1mb' } }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            console.log('Payment succeeded!', event.data.object.id);
            break;
        case 'invoice.payment_succeeded':
            console.log('Subscription payment succeeded!', event.data.object.id);
            break;
        case 'invoice.payment_failed':
            console.log('Payment failed!', event.data.object.id);
            break;
        default:
            console.log(`Unhandled event: ${event.type}`);
    }

    res.json({ received: true });
}
