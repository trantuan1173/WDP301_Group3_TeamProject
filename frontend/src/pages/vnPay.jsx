

import React, { useState } from 'react';
import axios from 'axios';

const VNPay = () => {
  // const [amount, setAmount] = useState(10000);
  // const [bankCode, setBankCode] = useState('');
  // const [language, setLanguage] = useState('vn');

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('http://localhost:9999/api/payments/create_payment_url', {
  //       amount: 10000,
  //       bankCode,
  //       language
  //     });
  //     window.location.href = response.request.responseURL;
  //   } catch (error) {
  //     console.error('Thanh toán thất bại:', error);
  //   }
  // };

  // return (
  //   <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
  //     <h2>Thanh toán VNPAY</h2>
  //     <form onSubmit={handleSubmit}>
  //       <div>
  //         <label>Số tiền: </label>
  //         <input
  //           type="number"
  //           value={amount}
  //           onChange={(e) => setAmount(e.target.value)}
  //         />
  //       </div>
  //       <div>
  //         <label>Mã ngân hàng: </label>
  //         <select value={bankCode} onChange={(e) => setBankCode(e.target.value)}>
  //           <option value="VNPAYQR">VNPAYQR</option>
  //           <option value="VNBANK">VNBANK</option>
  //         </select>
  //       </div>
  //       <div>
  //         <label>Ngôn ngữ: </label>
  //         <select value={language} onChange={(e) => setLanguage(e.target.value)}>
  //           <option value="vn">Tiếng Việt</option>
  //           <option value="en">English</option>
  //         </select>
  //       </div>
  //       <button type="submit">Thanh toán</button>
  //     </form>
  //   </div>
  // );
  const createPayment = async () => {
    const response = await fetch("https://beenglishcenter.gicunhco.com/api/payments/create_payment_url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({studentId: "68333981403318cecdab0a98", courseId: "68347991403318cecdab0c12", amount: 10000, bankCode: "VNBANK", language: "vn" })
    });
    const data = await response.json();
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    }
  }


    return (
        <div>
            <h1>Thanh toán</h1>
            <button onClick={createPayment}>Thanh toán</button>
        </div>
    )
};

export default VNPay;