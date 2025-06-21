import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import NavBar from '../Layouts/NavBar';
const UserPaymentProcess = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const location = useLocation();
    const courseDetailData = location.state;
    const [paymentMethod, setPaymentMethod] = useState("VNPay");

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const res = await axios.get(API_ENDPOINTS.AUTH_PROFILE, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data.data);
        };
        fetchData();
    }, []);

    const handlePayment = async () => {
        if (paymentMethod === "VNPay") {
            const token = localStorage.getItem("token");
            const res = await axios.post("https://beenglishcenter.gicunhco.com/api/payments/create_payment_url", {
                headers: { Authorization: `Bearer ${token}` },
                courseId: courseDetailData._id,
                language: "vn",
            });
            console.log(res.data);
            if (res.data.success) {
                window.location.href = res.data.data.redirectUrl;
            }
        }
    }
    return (
        <div>
            <NavBar />
            <div className="p-6 bg-[#F1F6FA] min-h-screen">
                <div className="container">
                    <button
                        className="border-2 border-[#120E7D] text-[#120E7D] font-medium px-4 py-1 rounded mb-6"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <p className="text-xl font-bold mb-4 text-[#120E7D]">Contact information</p>
                                <div className="flex flex-col gap-4 ml-6">
                                    <div className="flex justify-between items-center w-full">
                                        <label className="text-[#8E8E8E] font-medium w-24">Name:</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={user?.profile?.name || ''}
                                            className="bg-gray-100 p-2 rounded right-0 text-[#120E7D] w-full"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center w-full">
                                        <label className="text-[#8E8E8E] font-medium w-24">Email:</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={user?.email || ''}
                                            className="bg-gray-100 p-2 rounded right-0 text-[#120E7D] w-full"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center w-full">
                                        <label className="text-[#8E8E8E] font-medium w-24">Phone:</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={user?.profile?.phone || ''}
                                            className="bg-gray-100 p-2 rounded right-0 text-[#120E7D] w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <p className="text-xl font-bold mb-4 text-[#120E7D]">Payment method</p>
                                <div className="flex flex-col gap-4 ml-6" onChange={(e) => setPaymentMethod(e.target.value)}>
                                    <label className="flex flex-nowrap items-center gap-3 w-full">
                                        <input type="radio" value="VNPay" name="payment" className="w-5 h-5 shrink-0" defaultChecked />
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <img
                                                src="https://cdn.brandfetch.io/idV02t6WJs/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B"
                                                alt="VNPay"
                                                className="w-24 h-auto object-contain"
                                            />
                                            <span className="font-medium text-[#333] whitespace-nowrap">VN Pay</span>
                                        </div>
                                    </label>

                                    <label className="flex flex-nowrap items-center gap-3 w-full">
                                        <input type="radio" value="MoMo" name="payment" className="w-5 h-5 shrink-0" />
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <img
                                                src="https://cdn.brandfetch.io/idn4xaCzTm/w/180/h/180/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B"
                                                alt="MoMo"
                                                className="w-14 h-auto object-contain"
                                            />
                                            <span className="font-medium text-[#333] whitespace-nowrap">MoMo</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">
                            <p className="text-lg font-semibold text-gray-600">Order summary</p>
                            <div className="flex gap-4 items-center">
                                <img src={courseDetailData?.details?.imageURL} alt="Course" className="w-16 h-16 object-cover rounded" />
                                <div>
                                    <p className="font-medium">{courseDetailData?.nameCourses}</p>
                                    <p className="text-sm text-gray-500">{courseDetailData?.details?.price?.toLocaleString()} VND</p>
                                </div>
                            </div>

                            <hr />
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Apply Coupon</span>
                                <input type="text" placeholder="Enter coupon" className="bg-gray-100 p-1 px-2 rounded text-sm" />
                            </div>

                            <div className="text-sm">
                                <p>Subtotal: <span className="float-right">{courseDetailData?.details?.price?.toLocaleString()} VND</span></p>
                                <p>Order code: <span className="float-right">#123</span></p>
                            </div>

                            <hr />
                            <div className="text-xl font-bold text-gray-700 flex justify-between">
                                <span>Total:</span>
                                <span>{courseDetailData?.details?.price?.toLocaleString()} VND</span>
                            </div>

                            <button onClick={handlePayment} className="mt-4 w-full bg-[#120E7D] text-white font-semibold py-2 rounded hover:bg-[#0f0c66] transition">
                                Pay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPaymentProcess;