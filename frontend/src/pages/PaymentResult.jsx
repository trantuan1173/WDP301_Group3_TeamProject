import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentResult = () => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      const params = new URLSearchParams(window.location.search);
      try {
        const response = await axios.get(`http://localhost:9999/api/payments/vnpay_return?${params.toString()}`);
        setResult(response.data);
      } catch (error) {
        setResult({ success: false, message: 'Có lỗi xảy ra khi xử lý kết quả thanh toán.' });
      }
    };

    fetchResult();
  }, []);

  if (!result) return <p>Đang kiểm tra kết quả thanh toán...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Kết quả thanh toán</h2>
      {result.success ? (
        <p style={{ color: 'green' }}>✅ Thanh toán thành công! Mã đơn: {result.data?.vnp_TxnRef}</p>
      ) : (
        <p style={{ color: 'red' }}>❌ Thanh toán thất bại. Mã lỗi: {result.code}</p>
      )}
    </div>
  );
};

export default PaymentResult;