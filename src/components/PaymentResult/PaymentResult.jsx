import React from 'react';

const PaymentResult = ({ result, onClose }) => {
  return (
    <div>
      <h2>Payment Result</h2>
      <p>Result: {JSON.stringify(result)}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default PaymentResult;
