import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

export default function UserProfileForm() {
    const [profile, setProfile] = useState({
        email: "",
        profileData: {
            name: "",
            gender: "",
            dob: "",
            phone: "",
            address: "",
            imageURL: "",
        }
    });
    const [isEditing, setIsEditing] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);


    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         if (file.size > 10 * 1024 * 1024) {
    //             setError("Ảnh phải nhỏ hơn 10MB.");
    //             return;
    //         }
    //         setError("");
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
        formData.append("upload_preset", "WDP301_Group3_Avatar");
        formData.append("cloud_name", "dvdnw79tk");

        try {
            setUploadingImage(true);
            const res = await fetch("https://api.cloudinary.com/v1_1/dvdnw79tk/image/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            console.log("Image uploaded URL:", data.secure_url);
            if (data.secure_url) {
                console.log("Image uploaded URL:", data.secure_url);
                setProfile((prevForm) => ({
                    ...prevForm,
                    profileData: {
                        ...prevForm.profileData,
                        imageURL: data.secure_url,
                    },
                }));
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

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            setLoading(true);
            const response = await axios.get(API_ENDPOINTS.GET_PROFILE_BY_USERID(userId), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                // Format dob về yyyy-MM-dd để dùng trong input[type="date"]
                const formatDOB = (dob) => {
                    return dob ? new Date(dob).toISOString().split("T")[0] : "";
                };

                const formattedProfile = {
                    email: response.data.data.email,
                    profileData: {
                        ...response.data.data.profile,
                        dob: formatDOB(response.data.data.profile.dob),
                    },
                };

                setProfile(formattedProfile);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const { gender, dob, phone } = profile.profileData;
        if (!gender || !dob || !phone) {
            setError("Please fill in all required fields.");
            return;
        }
        if (!isEditing) return;
        try {
            const token = localStorage.getItem("token");
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            setLoading(true);
            const payload = {
                email: profile.email,
                profileData: {
                    name: profile.profileData.name,
                    gender: profile.profileData.gender,
                    dob: profile.profileData.dob,
                    phone: profile.profileData.phone,
                    address: profile.profileData.address,
                    imageURL: profile.profileData.imageURL,
                },
            };

            const response = await axios.put(API_ENDPOINTS.USER_UPDATE_PROFILE(userId), payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                console.log("Profile updated successfully");
                setError("");
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 rounded shadow p-6 m-4" style={{ border: "1px solid #D6BDBD", borderRadius: "10px", backgroundColor: "#FFFFFF" }}>
            {loading ? (
                <LoadingSpinner size={100} />
            ) : (
                <div>
                    <div className="flex justify-center mb-4">
                        <label className="relative cursor-pointer group">
                            <img
                                src={profile?.profileData?.imageURL || "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full border-4 border-yellow-300 object-cover"
                            />
                            {isEditing && (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-sm font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        Edit
                                    </div>
                                </>
                            )}
                            {uploadingImage && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                                    <LoadingSpinner size={30} />
                                </div>
                            )}
                        </label>
                    </div>
                    <form className="grid grid-cols-2 gap-4" onSubmit={handleUpdateProfile}>
                        <div>
                            <label>Full name</label>
                            <input className="w-full p-4" style={{ border: "1px solid #D6BDBD", borderRadius: "10px", backgroundColor: "#EBF5FFC2" }} value={profile?.profileData?.name} placeholder="Full name" disabled={!isEditing} onChange={(e) => setProfile({ ...profile, profileData: { ...profile?.profileData, name: e.target.value } })} />
                        </div>
                        <div>
                            <label>Email</label>
                            <input className="w-full p-4" style={{ border: "1px solid #D6BDBD", borderRadius: "10px", backgroundColor: "#EBF5FFC2" }} value={profile?.email} placeholder="Email" disabled onChange={(e) => setProfile({ ...profile, profileData: { ...profile?.profileData, email: e.target.value } })} />
                        </div>
                        <div>
                            <label>Gender <span className="text-red-500">*</span></label>
                            <select
                                className="w-full p-4"
                                style={{ border: "1px solid #D6BDBD", borderRadius: "10px", backgroundColor: "#EBF5FFC2" }}
                                value={profile?.profileData?.gender ?? ""}
                                disabled={!isEditing}
                                required
                                onChange={(e) =>
                                    setProfile({ ...profile, profileData: { ...profile?.profileData, gender: e.target.value } })
                                }
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label>Birthdate <span className="text-red-500">*</span></label>
                            <input type="date" className="w-full p-4" style={{ border: "1px solid #D6BDBD", borderRadius: "10px", backgroundColor: "#EBF5FFC2" }} value={profile?.profileData?.dob} placeholder="Birthdate" required disabled={!isEditing} onChange={(e) => setProfile({ ...profile, profileData: { ...profile?.profileData, dob: e.target.value } })} />
                        </div>
                        <div>
                            <label>Phone number <span className="text-red-500">*</span></label>
                            <input
                                className="w-full p-4"
                                style={{ border: "1px solid #D6BDBD", borderRadius: "10px", backgroundColor: "#EBF5FFC2" }}
                                value={profile?.profileData?.phone}
                                placeholder="Phone number"
                                required
                                disabled={!isEditing}
                                onChange={(e) =>
                                    setProfile({ ...profile, profileData: { ...profile?.profileData, phone: e.target.value } })
                                }
                            />
                        </div>
                        <div>
                            <label>Address</label>
                            <input className="w-full p-4" style={{ border: "1px solid #D6BDBD", borderRadius: "10px", backgroundColor: "#EBF5FFC2" }} value={profile?.profileData?.address} placeholder="Address" disabled={!isEditing} onChange={(e) => setProfile({ ...profile, profileData: { ...profile?.profileData, address: e.target.value } })} />
                        </div>

                    </form>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="mt-4 flex justify-end">
                        {!isEditing && (
                            <button
                                className="bg-yellow-500 text-white px-6 py-4 rounded mr-2"
                                onClick={() => setIsEditing(true)}
                                type="button"
                            >
                                Update Profile
                            </button>
                        )}
                        <button
                    className={`px-6 py-4 rounded ${
                        isEditing && !uploadingImage
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                            onClick={handleUpdateProfile}
                    disabled={!isEditing || uploadingImage}
                            type="submit"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
