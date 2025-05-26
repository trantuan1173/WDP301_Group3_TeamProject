import { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function AdminAddCourse({ onClose, onSubmit }) {
    const [form, setForm] = useState({
        nameCourses: "",
        category: "",
        level: "",
        price: "",
        description: "",
        durationDays: "",
        imageURL: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };
    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setImageFile(file);
    //         uploadImageToCloudinary(file);
    //     }
    // };
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          if (!file.type.startsWith("image/")) {
              setError("Chỉ chấp nhận file ảnh.");
              return;
          }
  
          // Đọc ảnh và resize
          const reader = new FileReader();
          reader.onload = (event) => {
              const img = new Image();
              img.onload = () => {
                  const MAX_WIDTH = 1000;
                  const MAX_HEIGHT = 1000;
  
                  let width = img.width;
                  let height = img.height;
  
                  if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                      if (width > height) {
                          height *= MAX_WIDTH / width;
                          width = MAX_WIDTH;
                      } else {
                          width *= MAX_HEIGHT / height;
                          height = MAX_HEIGHT;
                      }
                  }
  
                  const canvas = document.createElement("canvas");
                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext("2d");
                  ctx.drawImage(img, 0, 0, width, height);
  
                  canvas.toBlob((blob) => {
                      if (blob.size > 10 * 1024 * 1024) {
                          setError("Ảnh sau khi nén vẫn lớn hơn 10MB.");
                          return;
                      }
                      setError("");
                      setImageFile(blob);
                      uploadImageToCloudinary(blob);
                  }, "image/jpeg", 0.8); // nén ở mức chất lượng 80%
              };
              img.src = event.target.result;
          };
          reader.readAsDataURL(file);
      }
  };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "WDP301_Group3");
        formData.append("cloud_name", "dvdnw79tk");

        try {
            setUploadingImage(true);
            const res = await fetch("https://api.cloudinary.com/v1_1/dvdnw79tk/image/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.secure_url) {
                setForm((prevForm) => ({ ...prevForm, imageURL: data.secure_url }));
            } else {
                setError("Không thể upload ảnh lên Cloudinary.");
            }
        } catch (err) {
            console.error("Error uploading image:", err);
            setError("Upload ảnh thất bại.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async () => {
        const {
            nameCourses,
            category,
            level,
            price,
            description,
            durationDays,
            imageURL,
        } = form;

        if (!nameCourses) return setError("Course name is required");
        if (!imageURL) return setError("Please upload course image");

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            // Tạo khóa học
            const courseRes = await axios.post(
                API_ENDPOINTS.CREATE_COURSE,
                { nameCourses },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const courseId = courseRes.data.data._id;

            // Tạo chi tiết khóa học
            await axios.post(
                API_ENDPOINTS.CREATE_COURSE_DETAIL,
                {
                    courseId,
                    type: category,
                    level,
                    price: parseFloat(price),
                    description,
                    durationDays: parseInt(durationDays),
                    imageURL,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (onSubmit) onSubmit();
            onClose();
        } catch (err) {
            console.error(err);
            setError("Add course failed");
        } finally {
            setLoading(false);
        }
    };

    return (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    
    <div
      className="absolute inset-0 bg-black/30"
      onClick={onClose}
    ></div>

    
    <div
      className="relative z-10 bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Course</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-100 p-2 rounded">
          <label>Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {uploadingImage && (
            <LoadingSpinner size={20} text="Uploading..."/>
          )}
          {form.imageURL && (
            <div>
              <img src={form.imageURL} alt="Preview" width="150" />
            </div>
          )}
        </div>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="bg-blue-100 p-2 rounded"
        >
          <option value="" disabled>Course Category</option>
          <option value="ielts">IELTS</option>
          <option value="toeic">TOEIC</option>
        </select>

        <input
          name="nameCourses"
          value={form.nameCourses}
          onChange={handleChange}
          className="bg-blue-100 p-2 rounded"
          placeholder="Course Name"
        />
        <input
          name="level"
          value={form.level}
          onChange={handleChange}
          className="bg-blue-100 p-2 rounded"
          placeholder="Level"
        />
        <input
          name="durationDays"
          value={form.durationDays}
          onChange={handleChange}
          className="bg-blue-100 p-2 rounded"
          placeholder="Duration"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          className="bg-blue-100 p-2 rounded"
          placeholder="Price"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="bg-blue-100 p-2 rounded col-span-1 md:col-span-2"
          rows={3}
          placeholder="Description"
        />
      </div>

      {error && <p className="text-red-500 text-center mb-2">{error}</p>}

      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500"
        >
          Close
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-900 text-white px-6 py-2 rounded hover:bg-indigo-800"
        >
          {loading ? "Adding..." : "Add Course"}
        </button>
      </div>
    </div>
  </div>
);

}

