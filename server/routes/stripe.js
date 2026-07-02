const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase admin client to update user profiles securely
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Create a Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, userId, returnUrl } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    // Default to a placeholder if user hasn't provided their price ID yet
    const finalPriceId = priceId || process.env.STRIPE_PRICE_ID || 'price_placeholder'
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      client_reference_id: userId,
      success_url: `${returnUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?canceled=true`,
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: error.message })
  }
})

// Webhook Handler
// Note: This must receive the raw body to verify the signature.
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    // We expect req.body to be a Buffer because of express.raw()
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.client_reference_id

    if (userId) {
      // Upgrade the user in Supabase
      const { error } = await supabase
        .from('users')
        .update({ subscription_tier: 'pro' })
        .eq('id', userId)

      if (error) {
        console.error('Error upgrading user in Supabase:', error)
        return res.status(500).json({ error: 'Database update failed' })
      }
      console.log(`✅ Successfully upgraded user ${userId} to Pro!`)
    } else {
      console.warn('⚠️ No client_reference_id found in checkout session')
    }
  } else if (event.type === 'customer.subscription.deleted') {
    // Handle cancellations
    // Note: We'd need to map Stripe customer ID back to our user ID in a real system
    console.log('Subscription deleted event received')
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true })
})

module.exports = router
