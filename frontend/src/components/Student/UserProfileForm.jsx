import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

export default function UserProfileForm() {
    const [profile, setProfile] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            uploadImageToCloudinary(file);
        }
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "WDP301_Group3_Avatar");
        formData.append("cloud_name", "dvdnw79tk");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dvdnw79tk/image/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.secure_url) {
                setProfile((prevForm) => ({ ...prevForm, imageURL: data.secure_url }));
            } else {
                setError("Không thể upload ảnh lên Cloudinary.");
            }
        } catch (err) {
            console.error("Error uploading image:", err);
            setError("Upload ảnh thất bại.");
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
        if (!isEditing) return;
        try {
            const token = localStorage.getItem("token");
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            setLoading(true);
            const payload = {
                email: profile.email,
                profileData: {
                    ...profile.profileData,
                    imageURL: profile.imageURL,
                },
            };

            const response = await axios.put(API_ENDPOINTS.USER_UPDATE_PROFILE(userId), payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                console.log("Profile updated successfully");
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 rounded shadow p-6 m-4" style={{border: "1px solid #D6BDBD", borderRadius: "10px"}}>
            {loading ? (
                <LoadingSpinner size={50}/>
            ) : (
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
                </label>
            </div>
            )}
            <form className="grid grid-cols-2 gap-4" onSubmit={handleUpdateProfile}>
                <div>
                    <label>Full name</label>
                    <input className="w-full p-4" style={{border: "1px solid #D6BDBD", borderRadius: "10px", backgroundColor: "#EBF5FFC2"}} value={profile?.profileData?.name} placeholder="Full name" disabled={!isEditing} onChange={(e) => setProfile({ ...profile, profileData: { ...profile?.profileData, name: e.target.value } })} />
                </div>
                <div>
                    <label>Email</label>
                    <input className="w-full p-4" style={{border: "1px solid #D6BDBD", borderRadius: "10px", backgroundColor: "#EBF5FFC2"}} value={profile?.email} placeholder="Email" disabled onChange={(e) => setProfile({ ...profile, profileData: { ...profile?.profileData, email: e.target.value } })} />
                </div>
                <div>
                    <label>Gender</label>
                    <select
                        className="w-full p-4"
                        style={{border: "1px solid #D6BDBD", borderRadius: "10px", backgroundColor: "#EBF5FFC2"}}
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
                    <label>Birthdate</label>
                    <input type="date" className="w-full p-4" style={{border: "1px solid #D6BDBD", borderRadius: "10px", backgroundColor: "#EBF5FFC2"}} value={profile?.profileData?.dob} placeholder="Birthdate" required disabled={!isEditing} onChange={(e) => setProfile({ ...profile, profileData: { ...profile?.profileData, dob: e.target.value } })} />
                </div>
                <div>
                    <label>Phone number</label>
                    <input className="w-full p-4" style={{border: "1px solid #D6BDBD", borderRadius: "10px", backgroundColor: "#EBF5FFC2"}} value={profile?.profileData?.phone} placeholder="Phone number" required disabled={!isEditing} onChange={(e) => setProfile({ ...profile, profileData: { ...profile?.profileData, phone: e.target.value } })} />
                </div>
                <div>
                    <label>Address</label>
                    <input className="w-full p-4" style={{border: "1px solid #D6BDBD", borderRadius: "10px", backgroundColor: "#EBF5FFC2"}} value={profile?.profileData?.address} placeholder="Address" disabled={!isEditing} onChange={(e) => setProfile({ ...profile, profileData: { ...profile?.profileData, address: e.target.value } })} />
                </div>

            </form>
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
                    className={`px-6 py-4 rounded ${isEditing ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    onClick={handleUpdateProfile}
                    disabled={!isEditing}
                    type="submit"
                >
                    Save
                </button>
            </div>
        </div>
    );
}