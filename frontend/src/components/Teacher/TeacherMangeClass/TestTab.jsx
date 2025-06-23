import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faFileExport, faSearch, faDownload } from "@fortawesome/free-solid-svg-icons";
import ChooseTestModal from "../teacherModal/ChooseTestModal";
import AssignTestModal from "../teacherModal/AssignTestModal";

const TestTab = ({ classId, courseId }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChooseModal, setShowChooseModal] = useState(false);
  const [assignData, setAssignData] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [className, setClassName] = useState("");
  const [userId, setUserId] = useState(null);

  // Lấy userId từ token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id || decoded._id);
      } catch (e) {
        setUserId(null);
      }
    }
  }, []);

  // Lấy danh sách bài kiểm tra đã assign cho lớp
  useEffect(() => {
    if (!classId) return;
    const fetchAssigns = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_ENDPOINTS.GET_TEST_ASSIGN_BY_CLASS(classId), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const assigns = res.data.data || [];
        setAssignData(assigns);

        // Lấy tên khóa học và tên lớp từ dữ liệu đầu tiên (nếu có)
        if (assigns.length > 0) {
          setCourseName(assigns[0].courseId?.nameCourses || "");
          setClassName(assigns[0].classId?.name || assigns[0].classId || "");
        } else {
          setCourseName("");
          setClassName("");
        }
      } catch (err) {
        setAssignData([]);
        setCourseName("");
        setClassName("");
      }
    };
    fetchAssigns();
  }, [classId]);
//    const handleUploadTest = () => {
//         axios.post(API_ENDPOINTS.UPLOAD_TEST_FROM_XLSX, {
//             classId,
//             courseId
//         })
//             .then((response) => {
//                 console.log(response.data);
//             })
//             .catch((error) => {
//                 console.error('Error uploading test:', error);
//             });
//     }

  const handleDownloadTemplate = () => {
    axios.get(API_ENDPOINTS.DOWNLOAD_XLSX_TEMPLATE, {
      responseType: 'blob',
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'test-template.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error('Error downloading template:', error);
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f9fc]">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-bold text-3xl mb-8 text-[#111827]">Bài Kiểm Tra</h2>
          <div className="flex flex-col md:flex-row gap-6 mb-8 justify-center">
            <div className="flex-1 flex justify-center">
              <div className="bg-[#0a2540] text-white rounded-xl flex items-center justify-center h-[53px] w-[293px] font-semibold text-lg shadow">
                Course: {courseName || "Chưa có tên khóa học"}
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-[#0a2540] text-white rounded-xl flex items-center justify-center h-[53px] w-[293px] font-semibold text-lg shadow">
                {className || "Chưa có tên lớp"}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <span className="font-bold text-lg text-[#111827]">Danh sách</span>
              <div className="flex-1 border-b-2 border-[#e0e7ef] mb-2 md:mb-0" />
              <form className="flex items-center gap-2 max-w-md w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài kiểm tra..."
                  className="rounded-full px-4 py-2 border border-[#e0e7ef] bg-white shadow w-full"
                />
                <button type="button" className="rounded-full bg-white border-0 p-2 shadow">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </form>
              <button
                className="flex items-center gap-2 bg-[#DFE9FF] text-[#111827] rounded-xl px-6 py-2 font-semibold shadow min-w-[150px]"
                onClick={() => setShowCreateModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} /> Tạo mới
              </button>
              <button
                className="flex items-center gap-2 bg-[#DFE9FF] text-[#111827] rounded-xl px-6 py-2 font-semibold shadow min-w-[150px]"
                onClick={handleDownloadTemplate}
              >
                <FontAwesomeIcon icon={faDownload} /> Template
              </button>
            </div>

            <div className="flex gap-3 mb-4">
              <button
                className="bg-[#DFE9FF] text-[#111827] rounded-lg px-6 py-2 font-semibold flex items-center gap-2 shadow"
              >
                Thời gian
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button
                className="bg-[#DFE9FF] text-[#111827] rounded-lg px-6 py-2 font-semibold flex items-center gap-2 shadow"
              >
                <FontAwesomeIcon icon={faFileExport} /> Xuất dữ liệu
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-[#f5f9fc] rounded-xl">
                <thead>
                  <tr className="border-b-2 border-[#e0e7ef]">
                    <th className="py-2 px-4 text-left text-[#111827] font-semibold">STT</th>
                    <th className="py-2 px-4 text-left text-[#111827] font-semibold">Tên</th>
                    <th className="py-2 px-4 text-left text-[#111827] font-semibold">Thời gian</th>
                    <th className="py-2 px-4 text-left text-[#111827] font-semibold">Mô tả</th>
                    <th className="py-2 px-4 text-left text-[#111827] font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-400">Chưa có bài kiểm tra nào</td>
                    </tr>
                  ) : (
                    assignData.map((assign, idx) => (
                      <tr key={assign._id} className="border-b border-[#e0e7ef]">
                        <td className="py-2 px-4">{idx + 1}</td>
                        <td className="py-2 px-4 font-semibold">{assign.testId?.title || assign.title}</td>
                        <td className="py-2 px-4 font-bold">
                          {assign.startDate ? new Date(assign.startDate).toLocaleString("vi-VN") : ""}
                        </td>
                        <td className="py-2 px-4">{assign.testId?.description || assign.description}</td>
                        <td className="py-2 px-4">
                          <button className="p-1 me-2 text-indigo-600 hover:text-indigo-900">
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button className="p-1 text-blue-600 hover:text-blue-900">
                            <FontAwesomeIcon icon={faFileExport} />
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-900">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modals */}
          <AssignTestModal
            show={showCreateModal}
            onHide={() => setShowCreateModal(false)}
            onSubmit={() => setShowCreateModal(false)}
            switchToChooseModal={() => {
              setShowCreateModal(false);
              setShowChooseModal(true);
            }}
          />
          <ChooseTestModal
            show={showChooseModal}
            onHide={() => setShowChooseModal(false)}
            onBack={() => {
              setShowChooseModal(false);
              setShowCreateModal(true);
            }}
            courseId={courseId}
            classId={classId}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
};

export default TestTab;