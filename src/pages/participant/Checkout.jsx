import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FiLock, FiArrowLeft } from 'react-icons/fi';
import { getStripe } from '../../lib/stripe';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDate } from '../../utils/helpers';

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a1a1a',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#dc2626' },
  },
};

function CheckoutForm({ booking, clientSecret, paymentId }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError('');

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed. Please try again.');
        setProcessing(false);
        return;
      }

      if (result.paymentIntent.status === 'succeeded') {
        await paymentService.verify(paymentId);
        toast.success('Payment successful! Your tickets are ready.');
        navigate('/participant/tickets');
      } else {
        setError('Payment could not be completed. Please try a different card.');
        setProcessing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong finalizing your payment.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <label className="mb-2 block text-sm font-medium">Card details</label>
      <div className="input-field !flex items-center py-3">
        <CardElement options={cardElementOptions} className="w-full" />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={!stripe || processing} className="btn-primary mt-5 w-full">
        <FiLock /> {processing ? 'Processing...' : `Pay ${formatCurrency(booking.totalAmount)}`}
      </button>
      <p className="mt-3 text-center text-xs text-ink/50 dark:text-paper/50">
        Payments are securely processed by Stripe. Your card details never touch our servers.
      </p>
    </form>
  );
}

export default function Checkout() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data: bookingRes } = await bookingService.getById(bookingId);
        const b = bookingRes.data;
        setBooking(b);

        if (b.status !== 'pending') {
          setError(
            b.status === 'confirmed'
              ? 'This booking is already paid for.'
              : `This booking is ${b.status} and can no longer be paid.`
          );
          return;
        }

        const { data: orderRes } = await paymentService.createOrder(bookingId);
        setClientSecret(orderRes.data.clientSecret);
        setPaymentId(orderRes.data.paymentId);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not start checkout for this booking');
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingId]);

  if (loading) return <Loader label="Preparing checkout..." />;

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <Link to="/participant/bookings" className="mb-6 inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink dark:text-paper/60 dark:hover:text-paper">
        <FiArrowLeft /> Back to bookings
      </Link>

      <h1 className="mb-6 text-3xl">Checkout</h1>

      {booking && (
        <div className="card mb-6 p-5">
          <div className="mb-1 font-semibold">{booking.event?.title}</div>
          <div className="mb-3 text-sm text-ink/60 dark:text-paper/60">
            {formatDate(booking.event?.startDate)} · {booking.event?.venue}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>{booking.tierName} × {booking.quantity}</span>
            <span className="font-mono font-semibold">{formatCurrency(booking.totalAmount)}</span>
          </div>
        </div>
      )}

      {error ? (
        <div className="card p-6 text-sm text-red-600">{error}</div>
      ) : (
        clientSecret && (
          <Elements stripe={getStripe()} options={{ clientSecret }}>
            <CheckoutForm booking={booking} clientSecret={clientSecret} paymentId={paymentId} />
          </Elements>
        )
      )}
    </div>
  );
}
