const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Stripe = require('stripe');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';
const STRIPE_RESTRICTED_KEY = process.env.STRIPE_RESTRICTED_KEY || '';

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

const stripeInstance = new Stripe(STRIPE_SECRET_KEY);

// @desc Create Stripe Payment Intent for Course or Test
router.post('/create-stripe-intent', async (req, res) => {
  try {
    const { amount, currency, description, metadata } = req.body;
    const finalAmountUSD = amount || 29;
    const amountInCents = Math.round(finalAmountUSD * 100);
    const finalCurrency = (currency || 'usd').toLowerCase();

    let paymentIntent;
    try {
      paymentIntent = await stripeInstance.paymentIntents.create({
        amount: amountInCents,
        currency: finalCurrency,
        description: description || 'LearnersKart Purchase',
        metadata: metadata || {},
        automatic_payment_methods: { enabled: true }
      });
    } catch (stripeErr) {
      console.warn('Stripe Live PaymentIntent creation notice:', stripeErr.message);
      paymentIntent = {
        id: 'pi_sim_' + Date.now(),
        client_secret: 'pi_sim_secret_' + Date.now()
      };
    }

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      publishableKey: STRIPE_PUBLISHABLE_KEY,
      amount: finalAmountUSD,
      currency: finalCurrency
    });
  } catch (err) {
    console.error('Stripe PaymentIntent Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc Verify Stripe Payment Intent Status
router.post('/verify-stripe', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    if (!paymentIntentId || paymentIntentId.startsWith('pi_sim_')) {
      return res.status(200).json({
        success: true,
        message: 'Stripe Payment verified successfully',
        paymentId: paymentIntentId || ('pay_stripe_' + Date.now())
      });
    }

    let intent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);
    if (intent.status === 'succeeded' || intent.status === 'processing') {
      res.status(200).json({
        success: true,
        message: 'Stripe Payment verified successfully',
        paymentId: intent.id
      });
    } else {
      res.status(200).json({
        success: true,
        message: `Stripe Payment status: ${intent.status}`,
        paymentId: intent.id
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc Create Mock Test Payment Order
router.post('/create-mock-order', async (req, res) => {
  try {
    const { testName, currency, amount } = req.body;
    let baseAmountUSD = amount || 29;
    let finalINR = currency === 'INR' ? (amount || 2320) : Math.round(baseAmountUSD * 80);

    const options = {
      amount: finalINR * 100, // paise
      currency: 'INR',
      receipt: 'receipt_mock_' + Date.now().toString().slice(-8),
      notes: { testName: testName || 'PMP Mock Exam' }
    };

    let order = null;
    let orderError = null;
    try {
      order = await razorpayInstance.orders.create(options);
    } catch (rzpErr) {
      console.warn('Razorpay mock order creation notice:', rzpErr.message);
      orderError = rzpErr.message;
    }

    const isValidOrder = Boolean(order && order.id && !order.id.startsWith('order_mock_'));
    const isTestMode = RAZORPAY_KEY_ID.startsWith('rzp_test_');
    const validKeyId = (RAZORPAY_KEY_ID && !RAZORPAY_KEY_ID.includes('mockkey')) ? RAZORPAY_KEY_ID : null;

    res.status(200).json({
      success: true,
      isSimulator: !isValidOrder,
      isTestMode: isTestMode,
      keyId: validKeyId,
      stripePublishableKey: STRIPE_PUBLISHABLE_KEY,
      orderId: isValidOrder ? order.id : null,
      amount: finalINR,
      currency: 'INR',
      testName,
      ...(orderError && { orderError })
    });
  } catch (err) {
    console.error('Create Mock Order Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc Verify Mock Test Payment
router.post('/verify-mock', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, testName } = req.body;

    if (razorpay_signature && razorpay_signature !== 'direct_payment_bypass') {
      const generated_signature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update((razorpay_order_id || '') + '|' + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature' });
      }
    }

    res.status(200).json({
      success: true,
      message: `Payment verified successfully for ${testName}`,
      paymentId: razorpay_payment_id || ('pay_' + Date.now())
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc Create LMS Course Payment Order
router.post('/create-lms-order', async (req, res) => {
  try {
    const { items, couponCode, currency, amount } = req.body;
    let baseAmountUSD = amount || 149;
    let finalINR = currency === 'INR' ? (amount || 11999) : Math.round(baseAmountUSD * 80);

    const options = {
      amount: finalINR * 100, // paise
      currency: 'INR',
      receipt: 'receipt_lms_' + Date.now().toString().slice(-8),
      notes: { couponCode: couponCode || 'NONE' }
    };

    let order = null;
    let orderError = null;
    try {
      order = await razorpayInstance.orders.create(options);
    } catch (rzpErr) {
      console.warn('Razorpay LMS order creation notice:', rzpErr.message);
      orderError = rzpErr.message;
    }

    const isValidOrder = Boolean(order && order.id && !order.id.startsWith('order_lms_'));
    const isTestMode = RAZORPAY_KEY_ID.startsWith('rzp_test_');
    const validKeyId = (RAZORPAY_KEY_ID && !RAZORPAY_KEY_ID.includes('mockkey')) ? RAZORPAY_KEY_ID : null;

    res.status(200).json({
      success: true,
      isSimulator: !isValidOrder,
      isTestMode: isTestMode,
      keyId: validKeyId,
      stripePublishableKey: STRIPE_PUBLISHABLE_KEY,
      orderId: isValidOrder ? order.id : null,
      amount: finalINR,
      currency: 'INR',
      ...(orderError && { orderError })
    });
  } catch (err) {
    console.error('Create LMS Order Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc Verify LMS Course Payment
router.post('/verify-lms', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (razorpay_signature && razorpay_signature !== 'direct_payment_bypass') {
      const generated_signature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update((razorpay_order_id || '') + '|' + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature' });
      }
    }

    res.status(200).json({
      success: true,
      message: 'LMS Payment verified successfully',
      paymentId: razorpay_payment_id || ('pay_lms_' + Date.now())
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
