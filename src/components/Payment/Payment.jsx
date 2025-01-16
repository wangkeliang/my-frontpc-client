import React from 'react';

const Payment = ({ purchaseData, onPaymentComplete, onBack }) => {
  return (
    <div>
      <h2>Payment</h2>
      <p>Purchase Data: {JSON.stringify(purchaseData)}</p>
      <button onClick={onBack}>Back</button>
      <button
        onClick={() =>
          onPaymentComplete({ paymentResult: 'Payment Successful' })
        }
      >
        Complete Payment
      </button>
    </div>
  );
};

export default Payment;
