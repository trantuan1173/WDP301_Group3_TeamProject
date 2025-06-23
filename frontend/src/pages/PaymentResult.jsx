import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/Layouts/NavBar';
const PaymentResult = () => {
  const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const responseCode = searchParams.get("vnp_ResponseCode");
    const transactionStatus = searchParams.get("vnp_TransactionStatus");
    const amount = searchParams.get("vnp_Amount");
    const bankCode = searchParams.get("vnp_BankCode");
    const txnRef = searchParams.get("vnp_TxnRef");
    const payDate = searchParams.get("vnp_PayDate");
    const orderInfo = searchParams.get("vnp_OrderInfo");

    const isSuccess = responseCode === "00" && transactionStatus === "00";

    return (
        <div>
            <NavBar />
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F6FA] p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                <img src={isSuccess ? "/icons/checkIcon.png" : "/icons/deleteIcon.png"} alt="Logo" className="h-16 mb-4 mx-auto" />
                <h1 className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {isSuccess ? "Payment Success!" : "Payment Failed!"}
                </h1>

                <div className="text-left text-sm text-gray-700 space-y-2">
                    {txnRef && <p><strong>Mã giao dịch:</strong> {txnRef}</p>}
                    {orderInfo && <p><strong>Thông tin:</strong> {decodeURIComponent(orderInfo)}</p>}
                    {bankCode && <p><strong>Ngân hàng:</strong> {bankCode}</p>}
                    {amount && <p><strong>Số tiền:</strong> {(amount / 100).toLocaleString()} VND</p>}
                    {payDate && <p><strong>Thời gian:</strong> {`${payDate?.slice(6, 8)}/${payDate?.slice(4, 6)}/${payDate?.slice(0, 4)} ${payDate?.slice(8, 10)}:${payDate?.slice(10, 12)}`}</p>}
                </div>

                <button
                    className="mt-6 bg-[#120E7D] text-white px-6 py-2 rounded hover:bg-[#0f0c66]"
                    onClick={() => navigate('/')}
                >
                    {isSuccess ? "Back to Home" : "Back to Home"}
                </button>
            </div>
            </div>
        </div>
    );
};

export default PaymentResult;