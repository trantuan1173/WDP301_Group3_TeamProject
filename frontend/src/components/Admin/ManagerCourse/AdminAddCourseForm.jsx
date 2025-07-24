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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }
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
              setError("Compressed image is still larger than 10MB.");
              return;
            }
            setError("");
            setImageFile(blob);
            uploadImageToCloudinary(blob);
          }, "image/jpeg", 0.8);
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
        setError("Failed to upload image to Cloudinary.");
      }
    } catch (err) {
      setError("Image upload failed.");
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

    if (!nameCourses) return setError("Course name is required.");
    if (!category) return setError("Please select course category.");
    if (!level) return setError("Course level is required.");
    if (!price) return setError("Course price is required.");
    if (isNaN(price) || parseFloat(price) < 0)
      return setError("Price must be a number greater than or equal to 0.");
    if (!durationDays) return setError("Course duration is required.");
    if (isNaN(durationDays) || parseInt(durationDays) <= 0)
      return setError("Duration must be a number greater than 0.");
    if (!imageURL) return setError("Course image is required.");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const courseRes = await axios.post(
        API_ENDPOINTS.CREATE_COURSE,
        { nameCourses },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const courseId = courseRes.data.data._id;

      const detailRes = await axios.post(
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

      if (onSubmit) {
        onSubmit({
          ...detailRes.data.data,
          courseId: { _id: courseId, nameCourses },
          nameCourses,
        });
      }
      onClose();
    } catch (err) {
      setError("Add course failed.");
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
              <LoadingSpinner size={20} text="Uploading..." />
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
            className="bg-blue-100 p-2 rounded h-[56px] min-h-[56px] max-h-[56px] w-full"
          >
            <option value="" disabled>Course Category</option>
            <option value="ielts">IELTS</option>
            <option value="toeic">TOEIC</option>
          </select>

          <input
            name="nameCourses"
            value={form.nameCourses}
            onChange={handleChange}
            placeholder="Course Name"
            className="bg-blue-100 p-2 rounded"
          />
          <input
            name="level"
            value={form.level}
            onChange={handleChange}
            placeholder="Level "
            className="bg-blue-100 p-2 rounded"
          />
          <input
            name="durationDays"
            value={form.durationDays}
            onChange={handleChange}
            type="number"
            min="1"
            placeholder="Duration "
            className="bg-blue-100 p-2 rounded"
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            min="0"
            placeholder="Price"
            className="bg-blue-100 p-2 rounded"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="bg-blue-100 p-2 rounded col-span-1 md:col-span-2"
            rows={3}
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
