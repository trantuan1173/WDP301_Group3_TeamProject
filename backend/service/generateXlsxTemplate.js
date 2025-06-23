const XLSX = require("xlsx")
const fs = require("fs")
const path = require("path")

const data = [
  {
    question: "What is 2+2?",
    option1: "1",
    option2: "2",
    option3: "3",
    option4: "4",
    correctAnswer: "4",
  },
]

// Chuyển thành sheet
const worksheet = XLSX.utils.json_to_sheet(data)

// Tạo workbook và thêm sheet
const workbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workbook, worksheet, "Questions")

// Đường dẫn lưu
const dir = path.join(__dirname, "templates")
const filePath = path.join(dir, "test-template.xlsx")

// Tạo thư mục nếu chưa có
if (!fs.existsSync(dir)) fs.mkdirSync(dir)

// Ghi file
XLSX.writeFile(workbook, filePath)

console.log("✅ Đã tạo file test-template.xlsx tại:", filePath)