import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { Card } from "react-bootstrap";

export default function UserOverView() {
  const [profile, setProfile] = useState({
    email: "",
    profileData: {
      name: "",
      gender: "",
      dob: "",
      phone: "",
      address: "",
      imageURL: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      setLoading(true);
      const response = await axios.get(
        API_ENDPOINTS.GET_PROFILE_BY_USERID(userId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
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

  return (
    <div className=" p-10 w-full">
      {loading ? (
        <LoadingSpinner size={100} />
      ) : (
        <div>
          <div className="p-4 flex flex-row items-center gap-4 rounded-lg">
            <img
              src={
                profile?.profileData?.imageURL ||
                "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
              }
              alt="Avatar"
              className="w-24 h-24 border-4 object-cover rounded-md"
            />
            <div>
              <div className="text-xl font-semibold text-gray-700">
                Hello, {profile?.profileData?.name}.
              </div>
              <div>Have a nice day, let's progress together!</div>
            </div>
          </div>

          <hr />
        <div>
          <div className="container my-4">
      <div className="row g-4">
        {/* Cột trái */}
        <div className="col-lg-8">
          {/* Manage Courses */}
          <div className="card mb-4">
            <div className="card-header fw-bold">Manage Courses</div>
            <div className="card-body d-flex overflow-auto">
              {['TOEIC Foundation', 'TOEIC Begin', 'IELTS Foundation'].map((course, index) => (
                <div key={index} className="text-center me-4">
                  <img
                    src="https://via.placeholder.com/100x140?text=Course"
                    className="img-fluid mb-2"
                    alt={course}
                  />
                  <p>{course}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Test Results */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span className="fw-bold">Latest test results</span>
              <button className="btn btn-outline-primary btn-sm">Details</button>
            </div>
            <div className="card-body">
              <table className="table table-bordered mb-0">
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Process Test 1</td>
                    <td>7.5/10</td>
                  </tr>
                  <tr>
                    <td>Process Test 1</td>
                    <td>7.5/10</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cột phải */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header fw-bold">Today Schedule</div>
            <div className="card-body">
              {[1, 2].map((slot) => (
                <div key={slot} className="mb-4">
                  <div className="d-flex align-items-center mb-1">
                    <i className="bi bi-clock me-2"></i>
                    <strong>Slot 2 | 10:00 - 12:00 AM</strong>
                  </div>
                  <div className="ms-4">
                    <p className="mb-0">Courses: TOEIC Foundation</p>
                    <p className="mb-0">Place: Class A1</p>
                  </div>
                </div>
              ))}
              <div className="text-center text-muted">
                <small>Your day ends here :)<br />Enjoy your day</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        </div>



        </div>
      )}
    </div>
  );
}
