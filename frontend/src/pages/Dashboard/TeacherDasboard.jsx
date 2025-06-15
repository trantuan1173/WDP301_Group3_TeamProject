import React, { useState } from "react";
import TeacherSideMenu from "../../components/Layouts/TeacherSideMenu";
import NavBar from "../../components/Layouts/NavBar";
import { Col, Row, Button, Card, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";




const teacherMockDataForDashBoard = {
  name: "Thanh",
  schedule: [
    { slot: 2, time: "10:00 AM - 12:00 AM", course: "TOEIC Foundation", place: "Class A1" },
    { slot: 2, time: "10:00 AM - 12:00 AM", course: "TOEIC Foundation", place: "Class A1" },
  ],
  takeAttendance: [
    { class: "Class - A1" },
    { class: "Class - A2" },
    { class: "Class - A3" },
  ],
};
import TeacherViewShedule from "../../components/Teacher/TeacherViewShedule";
import TeacherOverView from "../../components/Teacher/TeacherOverView";
import TeacherViewClass from "../../components/Teacher/TeacherMangeClass/TeacherViewClass";
import TeacherManageTest from "../../components/Teacher/TeacherMangeClass/TeacherManageTest";
import TeacherViewScore from "../../components/Teacher/TeacherMangeClass/TeacherViewScore";

const TeacherDashboard = () => {
  const [selectedKey, setSelectedKey] = useState("overview");

  return (
    <div className="h-screen flex flex-col">
      <header className="w-full">
        <NavBar />
      </header>

      <div className="flex min-h-screen bg-gray-50">
        <TeacherSideMenu />
        <div className="flex-1 p-4">
          {/* Banner */}
          <Row className="mb-4" style={{ position: "relative", height: 295, overflow: "hidden" }}>
            {/* Banner Text Overlay */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 40,
                zIndex: 2,
                color: "#FFFFFF",
                padding: "16px 24px",
                borderRadius: 12,
                maxWidth: "60%",
                marginTop: 60,
                marginLeft: 90,
              }}
            >
              <h3 className="text-2xl font-bold mb-2" style={{ color: "#FFFFFF", fontSize: 32 }}>Improve your students skills</h3>
              <span style={{ color: "#FFFFFF", fontSize: 24 }}>Our great system is good for your schools/university</span>
              <br />
              <Button
                style={{
                  marginTop: 12,
                  background: "#FFFFFF",
                  color: "#3B2175 ",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: 24,
                  borderRadius: 17,
                  padding: "6px 20px",
                  marginLeft: 60,
                  height: 67,
                  width: 264,
                }}
              >
                Create Exam
              </Button>
            </div>

            {/* Banner Image */}
            <img
              src="images/viewcourse.png"
              alt="Dashboard Banner Illustration"
              className="w-full h-auto rounded-lg shadow-lg"
              style={{
                height: 300,
                objectFit: "cover",
                objectPosition: "center -5px", // shift image 5px upward to crop top
                width: "100%",
              }}
            />
          </Row>


          <Container className="bg-white p-4 rounded-lg shadow-sm">
            {/* Profile */}
            <Row className="align-items-center mb-2">
              <Col xs="auto">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Avatar"
                  style={{ width: 60, height: 60, borderRadius: "50%" }}
                />
              </Col>
              <Col>
                <h2 className="text-2xl font-bold mb-0">Hello, {teacherMockDataForDashBoard.name}</h2>
                <span className="text-gray-600">Have a nice day, let's progress together!</span>
              </Col>
            </Row>

            <hr style={{ borderTop: "2px solid", margin: "20px 0", color: "#000000", width: "828.962609771677" }} />


            <Row className="content container mt-3">
              {/* Quick Actions & Attendance */}
              <Col md={7} className="mb-4">

                {/* Quick Actions */}
                <Card className="mb-4" style={{
                  borderRadius: 14,
                  border: "1.5px solid #f0f0f0",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                }}>

                  <Card.Body>
                    <Card.Title className="mb-1" style={{ fontWeight: 700, fontSize: 26 }}>Quick Actions</Card.Title>
                    <Card.Subtitle className="mb-3" style={{ color: "#8c8c8c", fontSize: 16, fontWeight: 400 }}>
                      Common tasks for your role
                    </Card.Subtitle>
                    <div>
                      <Button
                        variant="light"
                        className="w-100 text-start mb-3"
                        style={{
                          border: "1.5px solid #f0f0f0",
                          borderRadius: 10,
                          fontSize: 18,
                          fontWeight: 500,
                          color: "#222",
                          boxShadow: "none",
                          padding: "14px 18px",
                        }}
                      >
                        <i className="bi bi-people me-2"></i> Manage Users
                      </Button>
                      <Button
                        variant="light"
                        className="w-100 text-start mb-3"
                        style={{
                          border: "1.5px solid #f0f0f0",
                          borderRadius: 10,
                          fontSize: 18,
                          fontWeight: 500,
                          color: "#222",
                          boxShadow: "none",
                          padding: "14px 18px",
                        }}
                      >
                        <i className="bi bi-journal-bookmark me-2"></i> Manage Courses
                      </Button>
                      <Button
                        variant="light"
                        className="w-100 text-start"
                        style={{
                          border: "1.5px solid #f0f0f0",
                          borderRadius: 10,
                          fontSize: 18,
                          fontWeight: 500,
                          color: "#222",
                          boxShadow: "none",
                          padding: "14px 18px",
                        }}
                      >
                        <i className="bi bi-calendar3 me-2"></i> Manage Classes
                      </Button>
                    </div>
                  </Card.Body>
                </Card>

                {/* Take Attendance */}
                <Card style={{
                  borderRadius: 14,
                  border: "1.5px solid #f0f0f0",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)"
                }}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span style={{ fontWeight: 700, fontSize: 24, color: "#757575" }}>
                        Take attendance
                      </span>
                      <Button
                        size="sm"
                        style={{
                          borderRadius: 8,
                          fontWeight: "bold",
                          background: "#2d186c",
                          border: "none",
                          fontSize: 16,
                          padding: "2px 22px",
                        }}
                      >
                        Details
                      </Button>
                    </div>
                    <ul className="list-unstyled mb-0">
                      {teacherMockDataForDashBoard.takeAttendance.map((item, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#222",
                            padding: "10px 0 10px 24px",
                            borderBottom:
                              idx !== teacherMockDataForDashBoard.takeAttendance.length - 1
                                ? "1px solid #d6d6d6"
                                : "none",
                          }}
                        >
                          {item.class}
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>

              {/* Today Schedule */}
              <Col md={5}>

                <Card style={{
                  borderRadius: 14,
                  border: "1.5px solid #f0f0f0",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                  minHeight: 416
                }}>
                  <Card.Body>
                    <Card.Title style={{ fontWeight: "bold", fontSize: 22, paddingBottom: 30 }}>Today Schedule</Card.Title>
                    
                    {teacherMockDataForDashBoard.schedule.map((item, idx) => (
                      <div key={idx} className="mb-3">
                        <div style={{ fontWeight: "bold" }}>
                         <FontAwesomeIcon icon={faClock} style={{ marginRight: 8, color: "#8c8c8c" }} />

                          Slot {item.slot} | {item.time}
                        </div>
                        <div style={{ fontSize: 15 }}>
                          Courses: {item.course}<br />
                          Place: {item.place}
                        </div>
                        <hr />
                      </div>
                    ))}
                    <div className="text-center text-muted" style={{ fontSize: 14 }}>
                      Your day ends here:)<br />Enjoy your day
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>

        </div>
      </div>
    </div>
      <header className="w-full">
        <NavBar />
      </header>
      <div className="flex min-h-screen bg-gray-50 ">
        <TeacherSideMenu
          selectedKey={selectedKey}
          onMenuSelect={setSelectedKey}
        />
        <div className="flex-1 p-4">
          {selectedKey === "overview" && <TeacherOverView />}
          {selectedKey === "schedule" && <TeacherViewShedule />}
          {selectedKey === "classes" && <TeacherViewClass />}
          {selectedKey === "exams" && <TeacherManageTest />}
          {selectedKey === "scores" && <TeacherViewScore />}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;