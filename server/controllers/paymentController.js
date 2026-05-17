const Stripe = require("stripe");
const Order = require("../models/Order");

const getStripe = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is missing from .env file.");
  }

  if (!stripeSecretKey.startsWith("sk_test_")) {
    throw new Error(
      "Only Stripe test mode is allowed. Use a key that starts with sk_test_."
    );
  }

  return new Stripe(stripeSecretKey);
};

// @desc    Create Stripe Checkout Session
// @route   POST /api/payments/create-checkout-session
// @access  Private
const createCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe();
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: "Order ID is required.",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorised to pay for this order.",
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        message: "This order has already been paid.",
      });
    }

    if (!order.orderItems || order.orderItems.length === 0) {
      return res.status(400).json({
        message: "Order has no items.",
      });
    }

    const productLineItems = order.orderItems.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.qty),
    }));

    const extraLineItems = [];

    if (Number(order.shippingPrice) > 0) {
      extraLineItems.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(Number(order.shippingPrice) * 100),
        },
        quantity: 1,
      });
    }

    if (Number(order.taxPrice) > 0) {
      extraLineItems.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: "Tax",
          },
          unit_amount: Math.round(Number(order.taxPrice) * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [...productLineItems, ...extraLineItems],
      customer_email: req.user.email,
      client_reference_id: order._id.toString(),
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/order-success?orderId=${order._id.toString()}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
    });

    order.stripeCheckoutSessionId = session.id;
    order.paymentMethod = "Stripe Test Payment";
    await order.save();

    return res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);

    return res.status(500).json({
      message:
        error.message || "Failed to create Stripe checkout session.",
    });
  }
};

// @desc    Stripe webhook endpoint
// @route   POST /api/payments/webhook
// @access  Public
const stripeWebhook = async (req, res) => {
  let event;

  try {
    const stripe = getStripe();
    const signature = req.headers["stripe-signature"];

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(500).send("Missing STRIPE_WEBHOOK_SECRET.");
    }

    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Stripe webhook verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      if (session.payment_status === "paid") {
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          return res.status(400).json({
            message: "Order ID missing from Stripe session metadata.",
          });
        }

        const order = await Order.findById(orderId);

        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = new Date();
          order.paymentMethod = "Stripe Test Payment";
          order.stripeCheckoutSessionId = session.id;
          order.paymentResult = {
            id: session.payment_intent,
            status: session.payment_status,
            email_address: session.customer_details?.email,
          };

          await order.save();
        }
      }
    }

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Stripe webhook handling failed:", error.message);

    return res.status(500).json({
      message: "Webhook handler failed.",
    });
  }
};

module.exports = {
  createCheckoutSession,
  stripeWebhook,
};