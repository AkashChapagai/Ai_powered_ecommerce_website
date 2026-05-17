import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

function OrderSuccess() {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const hasClearedCart = useRef(false);
  const [copied, setCopied] = useState(false);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!hasClearedCart.current) {
      clearCart();
      hasClearedCart.current = true;
    }
  }, [clearCart]);

  const copyOrderId = async () => {
    if (!orderId) return;

    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Failed to copy order ID:", error);
    }
  };

  return (
    <section className="success-page">
      <style>{successStyles}</style>

      <div className="success-bg success-bg-one" />
      <div className="success-bg success-bg-two" />

      <div className="success-card">
        <div className="success-top">
          <span className="test-badge">Stripe Test Mode</span>

          <div className="success-icon-wrap">
            <div className="success-pulse" />
            <div className="success-icon">✓</div>
          </div>

          <h1>Payment Successful</h1>

          <p className="success-subtitle">
            Your order has been placed successfully using Stripe test payment.
            No real money has been deducted.
          </p>
        </div>

        <div className="success-details">
          <div className="detail-card">
            <span className="detail-label">Payment Status</span>
            <strong className="paid-text">Paid Successfully</strong>
          </div>

          <div className="detail-card">
            <span className="detail-label">Payment Method</span>
            <strong>Stripe Test Card</strong>
          </div>
        </div>

        {orderId && (
          <div className="order-box">
            <div>
              <span className="detail-label">Order Reference</span>
              <p>{orderId}</p>
            </div>

            <button type="button" onClick={copyOrderId} className="copy-btn">
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}

        <div className="progress-box">
          <div className="progress-step active">
            <span>1</span>
            <p>Order Placed</p>
          </div>

          <div className="progress-line" />

          <div className="progress-step active">
            <span>2</span>
            <p>Payment Done</p>
          </div>

          <div className="progress-line muted" />

          <div className="progress-step">
            <span>3</span>
            <p>Processing</p>
          </div>
        </div>

        <div className="info-box">
          <strong>What happens next?</strong>
          <p>
            You can view this order in your order history. If the payment status
            does not update instantly, refresh the orders page after a few
            seconds because Stripe webhook confirmation can take a moment.
          </p>
        </div>

        <div className="success-actions">
          <Link to="/my-orders" className="primary-action">
            View My Orders
          </Link>

          <Link to="/products" className="secondary-action">
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}

const successStyles = `
.success-page {
  min-height: calc(100vh - 140px);
  position: relative;
  overflow: hidden;
  padding: 60px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top left, rgba(34, 197, 94, 0.20), transparent 34%),
    radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.18), transparent 32%),
    linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
}

.success-bg {
  position: absolute;
  border-radius: 999px;
  filter: blur(10px);
  opacity: 0.55;
  animation: floatSuccess 7s ease-in-out infinite;
}

.success-bg-one {
  width: 180px;
  height: 180px;
  background: rgba(34, 197, 94, 0.25);
  top: 12%;
  left: 9%;
}

.success-bg-two {
  width: 230px;
  height: 230px;
  background: rgba(37, 99, 235, 0.18);
  right: 8%;
  bottom: 12%;
  animation-delay: 1.5s;
}

.success-card {
  width: min(100%, 760px);
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(22px);
  border-radius: 30px;
  padding: 42px;
  box-shadow:
    0 28px 80px rgba(15, 23, 42, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.success-top {
  text-align: center;
}

.test-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #eef2ff;
  color: #3730a3;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.success-icon-wrap {
  width: 112px;
  height: 112px;
  margin: 26px auto 18px;
  position: relative;
  display: grid;
  place-items: center;
}

.success-pulse {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.22);
  animation: pulseSuccess 1.8s ease-out infinite;
}

.success-icon {
  width: 88px;
  height: 88px;
  position: relative;
  z-index: 2;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  color: white;
  font-size: 46px;
  font-weight: 900;
  box-shadow: 0 18px 38px rgba(22, 163, 74, 0.35);
}

.success-card h1 {
  margin: 0;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.05;
  color: #0f172a;
  letter-spacing: -0.04em;
}

.success-subtitle {
  max-width: 560px;
  margin: 16px auto 0;
  color: #64748b;
  font-size: 16px;
  line-height: 1.7;
}

.success-details {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.detail-card {
  padding: 18px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.detail-label {
  display: block;
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-card strong {
  color: #0f172a;
  font-size: 16px;
}

.paid-text {
  color: #15803d !important;
}

.order-box {
  margin-top: 16px;
  padding: 18px;
  border-radius: 20px;
  background: #111827;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.order-box .detail-label {
  color: #cbd5e1;
}

.order-box p {
  margin: 0;
  color: white;
  word-break: break-all;
  font-weight: 700;
}

.copy-btn {
  border: none;
  padding: 10px 15px;
  border-radius: 12px;
  background: white;
  color: #111827;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.copy-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.progress-box {
  margin-top: 26px;
  padding: 18px;
  border-radius: 22px;
  background: white;
  border: 1px solid #e5e7eb;
  display: grid;
  grid-template-columns: auto 1fr auto 1fr auto;
  align-items: center;
  gap: 12px;
}

.progress-step {
  display: grid;
  justify-items: center;
  gap: 8px;
  min-width: 82px;
}

.progress-step span {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #e5e7eb;
  color: #64748b;
  font-weight: 900;
}

.progress-step.active span {
  background: #22c55e;
  color: white;
}

.progress-step p {
  margin: 0;
  color: #475569;
  font-size: 13px;
  font-weight: 800;
  text-align: center;
}

.progress-line {
  height: 3px;
  background: linear-gradient(90deg, #22c55e, #86efac);
  border-radius: 999px;
}

.progress-line.muted {
  background: #e5e7eb;
}

.info-box {
  margin-top: 22px;
  padding: 18px;
  border-radius: 18px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.info-box strong {
  color: #1e3a8a;
}

.info-box p {
  margin: 8px 0 0;
  color: #475569;
  line-height: 1.65;
}

.success-actions {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.primary-action,
.secondary-action {
  min-width: 170px;
  text-align: center;
  padding: 14px 20px;
  border-radius: 15px;
  text-decoration: none;
  font-weight: 900;
  transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
}

.primary-action {
  background: #111827;
  color: white;
  box-shadow: 0 14px 30px rgba(17, 24, 39, 0.24);
}

.primary-action:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 40px rgba(17, 24, 39, 0.30);
}

.secondary-action {
  background: #e5e7eb;
  color: #111827;
}

.secondary-action:hover {
  transform: translateY(-3px);
  background: #dbe1ea;
}

@keyframes pulseSuccess {
  0% {
    transform: scale(0.86);
    opacity: 0.75;
  }
  70% {
    transform: scale(1.16);
    opacity: 0;
  }
  100% {
    transform: scale(1.16);
    opacity: 0;
  }
}

@keyframes floatSuccess {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-18px);
  }
}

@media (max-width: 720px) {
  .success-page {
    padding: 32px 14px;
  }

  .success-card {
    padding: 28px 18px;
    border-radius: 24px;
  }

  .success-details {
    grid-template-columns: 1fr;
  }

  .order-box {
    align-items: flex-start;
    flex-direction: column;
  }

  .progress-box {
    grid-template-columns: 1fr;
  }

  .progress-line {
    width: 3px;
    height: 22px;
    justify-self: center;
  }

  .success-actions {
    flex-direction: column;
  }

  .primary-action,
  .secondary-action {
    width: 100%;
  }
}
`;

export default OrderSuccess;