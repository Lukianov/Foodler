import express, { Router } from 'express';
import { stripe } from '../services/stripe';
import { prisma } from '../db';

export const stripeRouter = Router();

stripeRouter.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const telegramId = session.client_reference_id;
      await prisma.user.upsert({
        where: { telegramId },
        update: { isPremium: true },
        create: { id: telegramId, telegramId, isPremium: true },
      });
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
