const Payment = require("../models/paymentModel.js")
const Course = require("../models/courseModel.js")
const User = require("../models/userModel.js")
const Enrollment = require("../models/enrollmentModel.js")
const CourseDetail = require("../models/courseDetailModel.js")
const mongoose = require("mongoose")

const { Types } = mongoose
const axios = require("axios");
const moment = require("moment");
const config = require("config");
const crypto = require("crypto");
const qs = require("qs");

// Get all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("studentId", "email").populate("courseId")

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    })
  }
}

// Get payments by student
const getPaymentsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params

    const payments = await Payment.find({ studentId }).populate("courseId")

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    })
  }
}

// Get payments by course
const getPaymentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params

    const payments = await Payment.find({ courseId }).populate("studentId", "email")

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    })
  }
}

// Get single payment
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("studentId", "email").populate("courseId")

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    res.status(200).json({
      success: true,
      data: payment,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
      error: error.message,
    })
  }
}

// Create payment
const createPayment = async (req, res) => {
  try {
    const { studentId, courseId, amount, paymentMethod, transactionId, note } = req.body

    // Validate references
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    const student = await User.findById(studentId)
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      })
    }

    // Check if enrollment exists
    const enrollment = await Enrollment.findOne({ courseId, studentId })
    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: "Student must be enrolled in the course before making payment",
      })
    }

    const payment = await Payment.create({
      studentId,
      courseId,
      amount,
      paymentMethod,
      status: "pending",
      transactionId,
      note,
    })

    res.status(201).json({
      success: true,
      data: payment,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message,
    })
  }
}

// Update payment
const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    res.status(200).json({
      success: true,
      data: payment,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update payment",
      error: error.message,
    })
  }
}

// Delete payment
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id)

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete payment",
      error: error.message,
    })
  }
}

// Process payment (mark as completed)
const processPayment = async (req, res) => {
  try {
    const { transactionId } = req.body

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        status: "completed",
        paidAt: Date.now(),
        transactionId,
      },
      { new: true, runValidators: true },
    )

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    // Update enrollment status to active if payment is completed
    await Enrollment.findOneAndUpdate(
      { courseId: payment.courseId, studentId: payment.studentId },
      { status: "active" },
    )

    res.status(200).json({
      success: true,
      data: payment,
      message: "Payment processed successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process payment",
      error: error.message,
    })
  }
}

// Get payment statistics
const getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments()
    const completedPayments = await Payment.countDocuments({ status: "completed" })
    const pendingPayments = await Payment.countDocuments({ status: "pending" })
    const failedPayments = await Payment.countDocuments({ status: "failed" })

    const totalRevenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    res.status(200).json({
      success: true,
      data: {
        totalPayments,
        completedPayments,
        pendingPayments,
        failedPayments,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment statistics",
      error: error.message,
    })
  }
}

// Create VNPay URL
const createVNPayUrl = async (req, res) => {

  const { studentId, courseId, amount, bankCode, language } = req.body;

  const studentObjectId = new mongoose.Types.ObjectId(studentId);
const courseObjectId = new mongoose.Types.ObjectId(courseId);
  console.log(">>> req.body:", req.body);
  console.log(">>> studentId:", studentId);
  console.log(">>> courseId:", courseId);
  process.env.TZ = 'Asia/Ho_Chi_Minh';

  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');

  let ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let config = require('config');

  let tmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');
  // let vnpUrl = config.get('vnp_Url');
  let returnUrl = config.get('vnp_ReturnUrl');
  let orderId = moment(date).format('DDHHmmss');



  let locale = language;
  if (locale === null || locale === '') {
    locale = 'vn';
  }
  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = `Thanh toan cho ma GD:${orderId}`;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  // vnp_Params['vnp_IpnUrl'] = ipnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require('qs');
  console.log(vnp_Params);
  // let signData = querystring.stringify(vnp_Params, { encode: false });
  // let crypto = require("crypto");
  // let hmac = crypto.createHmac("sha512", secretKey);
  // let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
  // vnp_Params['vnp_SecureHash'] = signed;
  // vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", config.get("vnp_HashSecret"));
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  const vnpUrl = config.get("vnp_Url") + "?" + qs.stringify(vnp_Params, { encode: false });
  console.log("vnpUrl:", vnpUrl);
  const data = await Payment.create({
    studentId: studentObjectId,
    courseId: courseObjectId,
    amount,
    orderId,
    note: "Payment for course " + courseId,
  });
  // res.redirect(vnpUrl)
  res.json({ success: true, redirectUrl: vnpUrl });
};

// VNPay return
const vnpayReturn = async (req, res) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject2(vnp_Params);

  let config = require('config');
  let tmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");     
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

  if(secureHash === signed){
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

      res.render('success', {code: vnp_Params['vnp_ResponseCode']})
  } else{
      res.render('success', {code: '97'})
  }
};


// // VNPay IPN
// const vnpayIpn = async (req, res) => {
//   let vnp_Params = req.query;
//   let secureHash = vnp_Params['vnp_SecureHash'];

//   // Lấy chuỗi query gốc từ URL, không bao gồm vnp_SecureHash ban đầu
//   // Đây là cách làm an toàn và chính xác nhất
//   let querystring = require('qs');
//   const originalQuery = querystring.stringify(req.query, { 
//       encode: false,
//       filter: (prefix, value) => value !== '' && prefix !== 'vnp_SecureHash' && prefix !== 'vnp_SecureHashType'
//   });
  
//   let config = require('config');
//   let secretKey = config.get('vnp_HashSecret');
//   let crypto = require("crypto");
//   let hmac = crypto.createHmac("sha512", secretKey);
//   let signed = hmac.update(new Buffer(originalQuery, 'utf-8')).digest("hex");

//   let orderId = vnp_Params['vnp_TxnRef'];
//   let rspCode = vnp_Params['vnp_ResponseCode'];

//   // Dòng log để debug
//   console.log("Original Query for Hashing:", originalQuery);
//   console.log("Received SecureHash:", secureHash);
//   console.log("Generated Signed Hash:", signed);

//   if (secureHash === signed) {
//     // Các bước kiểm tra logic của bạn ở đây (checkOrderId, checkAmount, ...)
//     console.log("Checksum valid. Processing order...");

//     let checkOrderId = true; // Logic kiểm tra orderId tồn tại
//     let checkAmount = true; // Logic kiểm tra số tiền
//     let paymentStatus = '0'; // Logic lấy trạng thái thanh toán hiện tại

//     if (checkOrderId) {
//       if (checkAmount) {
//         if (paymentStatus == "0") {
//           if (rspCode == "00") {
//             // Cập nhật trạng thái thành công
//             console.log("Transaction successful. Updating status to 'Success'.");
//             res.status(200).json({ RspCode: '00', Message: 'Success' });
//           } else {
//             // Cập nhật trạng thái thất bại
//             console.log("Transaction failed. Updating status to 'Failed'.");
//             res.status(200).json({ RspCode: '00', Message: 'Success' }); // Vẫn trả về 'Success' cho VNPay biết đã nhận được IPN
//           }
//         } else {
//           res.status(200).json({ RspCode: '02', Message: 'This order has been updated to the payment status' });
//         }
//       } else {
//         res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
//       }
//     } else {
//       res.status(200).json({ RspCode: '01', Message: 'Order not found' });
//     }
//   } else {
//     console.log("Checksum FAILED!");
//     res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
//   }
// };
const vnpayIpn = async (req, res) => {
  const crypto = require("crypto");
  const config = require("config");
  const qs = require("qs");

  // 1. Lấy toàn bộ tham số từ query
  let vnp_Params = req.query;

  // 2. Lưu và xóa SecureHash để xử lý sau
  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  // 3. Sắp xếp lại object theo key alphabet
  // const sortedParams = {};
  // Object.keys(vnp_Params).sort().forEach(key => {
  //   sortedParams[key] = vnp_Params[key];
  // });

  // 4. Tạo chuỗi dữ liệu để hash
  // const signData = qs.stringify(sortedParams, { encode: false });
  // console.log("Original Query for Hashing:", signData);
  // // 5. Tạo chữ ký hash bằng secretKey
  // const secretKey = config.get('vnp_HashSecret');
  // const hmac = crypto.createHmac("sha512", secretKey);
  // const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", config.get("vnp_HashSecret"));
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  const secretKey = config.get("vnp_HashSecret");
  // 6. Log để debug
  console.log("SecretKey used for hash:", secretKey);
  console.log("Original Query for Hashing:", signData);
  console.log("Received SecureHash:", secureHash);
  console.log("Generated Signed Hash:", signed);

  // 7. So sánh hash
  // if (secureHash === signed) {
  //   // TODO: Kiểm tra vnp_TxnRef, vnp_Amount, trạng thái đơn hàng trong DB ở đây

  //   // Giả sử đơn hợp lệ
  //   res.status(200).json({ RspCode: '00', Message: 'Success' });
  // } else {
  //   res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
  // }
  let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó
  
  let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if(secureHash === signed){ //kiểm tra checksum
      if(checkOrderId){
          if(checkAmount){
              if(paymentStatus=="0"){ //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                  if(rspCode=="00"){
                      //thanh cong
                      //paymentStatus = '1'
                      // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                      res.status(200).json({RspCode: '00', Message: 'Success'})
                  }
                  else {
                      //that bai
                      //paymentStatus = '2'
                      // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                      res.status(200).json({RspCode: '00', Message: 'Success'})
                  }
              }
              else{
                  res.status(200).json({RspCode: '02', Message: 'This order has been updated to the payment status'})
              }
          }
          else{
              res.status(200).json({RspCode: '04', Message: 'Amount invalid'})
          }
      }       
      else {
          res.status(200).json({RspCode: '01', Message: 'Order not found'})
      }
  }
  else {
      res.status(200).json({RspCode: '97', Message: 'Checksum failed'})
  }
};

// const querydr = (req, res) => {

//   process.env.TZ = 'Asia/Ho_Chi_Minh';
//   let date = new Date();

//   let config = require('config');
//   let crypto = require("crypto");

//   let vnp_TmnCode = config.get('vnp_TmnCode');
//   let secretKey = config.get('vnp_HashSecret');
//   let vnp_Api = config.get('vnp_Api');

//   let vnp_TxnRef = req.body.orderId;
//   let vnp_TransactionDate = req.body.transDate;

//   let vnp_RequestId = moment(date).format('HHmmss');
//   let vnp_Version = '2.1.0';
//   let vnp_Command = 'querydr';
//   let vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;

//   let vnp_IpAddr = req.headers['x-forwarded-for'] ||
//     req.connection.remoteAddress ||
//     req.socket.remoteAddress ||
//     req.connection.socket.remoteAddress;

//   let currCode = 'VND';
//   let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

//   let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TxnRef + "|" + vnp_TransactionDate + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;

//   let hmac = crypto.createHmac("sha512", secretKey);
//   let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");

//   let dataObj = {
//     'vnp_RequestId': vnp_RequestId,
//     'vnp_Version': vnp_Version,
//     'vnp_Command': vnp_Command,
//     'vnp_TmnCode': vnp_TmnCode,
//     'vnp_TxnRef': vnp_TxnRef,
//     'vnp_OrderInfo': vnp_OrderInfo,
//     'vnp_TransactionDate': vnp_TransactionDate,
//     'vnp_CreateDate': vnp_CreateDate,
//     'vnp_IpAddr': vnp_IpAddr,
//     'vnp_SecureHash': vnp_SecureHash
//   };
//   // /merchant_webapi/api/transaction
//   request({
//     url: vnp_Api,
//     method: "POST",
//     json: true,
//     body: dataObj
//   }, function (error, response, body) {
//     console.log(response);
//   });

// };

const querydr = (req, res) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  let date = new Date();
  let config = require('config');
  let crypto = require("crypto");

  // --- LOG DỮ LIỆU ĐẦU VÀO ---
  console.log("--- Bắt đầu gọi API QueryDR ---");
  console.log("Request Body nhận được:", req.body);

  let vnp_TmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret'); // QUAN TRỌNG: Kiểm tra lại key này
  let vnp_Api = config.get('vnp_Api');

  let vnp_TxnRef = req.body.orderId;
  let vnp_TransactionDate = req.body.transDate; // Định dạng phải là YYYYMMDDHHmmss

  let vnp_RequestId = moment(date).format('HHmmss');
  let vnp_Version = '2.1.0';
  let vnp_Command = 'querydr';
  let vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;

  let vnp_IpAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

  let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

  let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TxnRef + "|" + vnp_TransactionDate + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;

  // --- LOG CÁC THÀNH PHẦN CỦA CHUỖI DATA ---
  console.log("--- Các thành phần tạo chuỗi hash ---");
  console.log("vnp_RequestId:", vnp_RequestId);
  console.log("vnp_Version:", vnp_Version);
  console.log("vnp_Command:", vnp_Command);
  console.log("vnp_TmnCode:", vnp_TmnCode);
  console.log("vnp_TxnRef (orderId):", vnp_TxnRef);
  console.log("vnp_TransactionDate (transDate):", vnp_TransactionDate);
  console.log("vnp_CreateDate:", vnp_CreateDate);
  console.log("vnp_IpAddr:", vnp_IpAddr);
  console.log("vnp_OrderInfo:", vnp_OrderInfo);
  console.log("secretKey (kiểm tra xem có load được không):", secretKey ? "OK" : "FAILED TO LOAD");

  // --- LOG CHUỖI DATA CUỐI CÙNG ---
  console.log("Chuỗi data để hash (QUAN TRỌNG):", data);

  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");
  
  console.log("SecureHash đã tạo:", vnp_SecureHash);
  console.log("--- Kết thúc Log ---");

  let dataObj = {
      'vnp_RequestId': vnp_RequestId,
      'vnp_Version': vnp_Version,
      'vnp_Command': vnp_Command,
      'vnp_TmnCode': vnp_TmnCode,
      'vnp_TxnRef': vnp_TxnRef,
      'vnp_OrderInfo': vnp_OrderInfo,
      'vnp_TransactionDate': vnp_TransactionDate,
      'vnp_CreateDate': vnp_CreateDate,
      'vnp_IpAddr': vnp_IpAddr,
      'vnp_SecureHash': vnp_SecureHash
  };

  // /merchant_webapi/api/transaction
  const axios = require("axios");

  axios.post(vnp_Api, dataObj)
    .then(response => {
      console.log("Kết quả trả về từ VNP:", response.data);
      res.status(200).json(response.data);
    })
    .catch(error => {
      console.error("Lỗi gọi API VNPay:", error.message);
      res.status(500).json({ success: false, message: "Lỗi gọi API VNPay", error: error.message });
    });
};

const refund = (req, res) => {

  process.env.TZ = 'Asia/Ho_Chi_Minh';
  let date = new Date();

  let config = require('config');
  let crypto = require("crypto");

  let vnp_TmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');
  let vnp_Api = config.get('vnp_Api');

  let vnp_TxnRef = req.body.orderId;
  let vnp_TransactionDate = req.body.transDate;
  let vnp_Amount = req.body.amount * 100;
  let vnp_TransactionType = req.body.transType;
  let vnp_CreateBy = req.body.user;

  let currCode = 'VND';

  let vnp_RequestId = moment(date).format('HHmmss');
  let vnp_Version = '2.1.0';
  let vnp_Command = 'refund';
  let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;

  let vnp_IpAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;


  let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

  let vnp_TransactionNo = '0';

  let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
  let hmac = crypto.createHmac("sha512", secretKey);
  let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");

  let dataObj = {
    'vnp_RequestId': vnp_RequestId,
    'vnp_Version': vnp_Version,
    'vnp_Command': vnp_Command,
    'vnp_TmnCode': vnp_TmnCode,
    'vnp_TransactionType': vnp_TransactionType,
    'vnp_TxnRef': vnp_TxnRef,
    'vnp_Amount': vnp_Amount,
    'vnp_TransactionNo': vnp_TransactionNo,
    'vnp_CreateBy': vnp_CreateBy,
    'vnp_OrderInfo': vnp_OrderInfo,
    'vnp_TransactionDate': vnp_TransactionDate,
    'vnp_CreateDate': vnp_CreateDate,
    'vnp_IpAddr': vnp_IpAddr,
    'vnp_SecureHash': vnp_SecureHash
  };

  axios.post(vnp_Api, dataObj)
    .then(response => {
      console.log("Kết quả trả về từ VNP:", response.data);
      res.status(200).json(response.data);
    })
    .catch(error => {
      console.error("Lỗi gọi API VNPay:", error.message);
      res.status(500).json({ success: false, message: "Lỗi gọi API VNPay", error: error.message });
    });

};

// function sortObject(obj) {
// 	let sorted = {};
// 	let str = [];
// 	let key;
// 	for (key in obj){
// 		if (obj.hasOwnProperty(key)) {
// 		str.push(encodeURIComponent(key));
// 		}
// 	}
// 	str.sort();
//     for (key = 0; key < str.length; key++) {
//         sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
//     }
//     return sorted;
// }
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (let i = 0; i < str.length; i++) {
    let decodedKey = decodeURIComponent(str[i]);
    sorted[str[i]] = encodeURIComponent(obj[decodedKey]).replace(/%20/g, "+");
  }
  return sorted;
}
// function sortObject(obj) {
//   let sorted = {};
//   let str = [];
//   let key;
//   for (key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       str.push(encodeURIComponent(key));
//     }
//   }
//   str.sort();
//   for (key = 0; key < str.length; key++) {
//     sorted[str[key]] = encodeURIComponent(obj[decodeURIComponent(str[key])]).replace(/%20/g, "+");
//   }
//   return sorted;
// }

function sortObject2(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      sorted[key] = obj[key];
    }
  }

  return sorted;
}

module.exports = {
  getPayments,
  getPaymentsByStudent,
  getPaymentsByCourse,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  processPayment,
  getPaymentStats,
  createVNPayUrl,
  vnpayReturn,
  vnpayIpn,
  querydr,
  refund,
}