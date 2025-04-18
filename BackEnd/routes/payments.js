const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const axios = require('axios');

// Create a new payment
router.post('/', async (req, res) => {
    try {
        const { amount, currency, paymentMethod, customer } = req.body;
        
        let paymentResult;
        
        if (paymentMethod === 'paypal') {
            paymentResult = await processPaypalPayment(amount, currency, customer);
        } else if (paymentMethod === 'cliq') {
            paymentResult = await processCliqPayment(amount, currency, customer);
        } else {
            return res.status(400).json({ error: 'Invalid payment method' });
        }
        
        const payment = new Payment({
            amount,
            currency,
            paymentMethod,
            customer,
            status: paymentResult.success ? 'completed' : 'failed',
            transactionId: paymentResult.transactionId
        });
        
        await payment.save();
        
        res.json({
            success: paymentResult.success,
            transactionId: paymentResult.transactionId,
            payment
        });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ error: 'Payment processing failed' });
    }
});

// Process PayPal payment
async function processPaypalPayment(amount, currency, customer) {
    // في الواقع، هنا ستقوم بالاتصال بـ PayPal API
    // هذا مثال فقط للتوضيح
    console.log(`Processing PayPal payment of ${amount} ${currency} for ${customer.email}`);
    
    // محاكاة اتصال ناجح بـ PayPal
    return {
        success: true,
        transactionId: 'PAYPAL-' + Math.random().toString(36).substring(7)
    };
}

// Process CLIQ payment
async function processCliqPayment(amount, currency, customer) {
    // في الواقع، هنا ستقوم بالاتصال بـ CLIQ API
    // هذا مثال فقط للتوضيح
    console.log(`Processing CLIQ payment of ${amount} ${currency} for ${customer.phone}`);
    
    // محاكاة اتصال ناجح بـ CLIQ
    return {
        success: true,
        transactionId: 'CLIQ-' + Math.random().toString(36).substring(7)
    };
}

// Get payment history
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

module.exports = router;