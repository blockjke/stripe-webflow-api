const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  // Явно разрешаем CORS для вашего домена Webflow
  res.setHeader('Access-Control-Allow-Origin', 'https://iulianas-superb-site-211078.webflow.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обрабатываем preflight-запрос
  if (req.method === 'OPTIONS') {
    return res.status(200).json({}); // Важно вернуть 200 OK
  }

  // Основной POST-запрос
  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: 'price_1Rol7ECeW1SaBRWhLBpL92Vx',
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      });
      return res.json({ id: session.id });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).end(); // Метод не разрешен
};
