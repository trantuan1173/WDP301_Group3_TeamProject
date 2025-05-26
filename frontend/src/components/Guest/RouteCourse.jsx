import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';

const roadmapData = {
    toeic: [
        {
            title: "TỪ MẤT GỐC - 450+",
            desc: "Cải thiện khả năng từ mất gốc đến 450+/990 TOEIC",
            levels: [
                { name: "TOEIC Foundation", desc: "Xây nền" },
                { name: "TOEIC Beginner", desc: "350+/990 TOEIC" },
                { name: "TOEIC Pre-Intermediate", desc: "450+/990 TOEIC" }
            ]
        },
        {
            title: "TỪ 450 - 700+ TOEIC",
            desc: "Chiến lược học tập tối ưu, luyện nghe chuyên sâu. Phát triển toàn diện kỹ năng Listening & Reading. Cam kết đạt mục tiêu, sẵn sàng cho TOEIC cấp độ cao.",
            levels: [
                { name: "TOEIC Pre-Intermediate", desc: "450+/990 TOEIC" },
                { name: "TOEIC Intermediate", desc: "550+/990 TOEIC" },
                { name: "TOEIC Advanced", desc: "700+/990 TOEIC" }
            ]
        },
        {
            title: "4 KỸ NĂNG",
            desc: "Lộ trình phát triển toàn diện 4 KỸ NĂNG Listening - Reading - Speaking - Writing trong vòng 10 - 11 tháng. Giáo trình chuyên sâu, phương pháp hiệu quả. Từ mất gốc đến thành thạo, sẵn sàng cho mọi thử thách TOEIC.",
            levels: [
                { name: "TOEIC Beginner", desc: "350+/990 TOEIC" },
                { name: "TOEIC Pre-Intermediate", desc: "450+/990 TOEIC" },
                { name: "TOEIC Intermediate", desc: "550+/990 TOEIC" },
                { name: "TOEIC Advanced", desc: "700+/990 TOEIC" }
            ]
        }
    ],
    ielts: [
        {
            title: "TỪ MẤT GỐC - 5.0",
            desc: "Cá nhân hóa lộ trình học IELTS theo level từ mất gốc đến 5.0/9.0",
            levels: [
                { name: "IELTS Foundation", desc: "-3.0/9.0" },
                { name: "IELTS Beginner", desc: "3.5-4.0/9.0" },
                { name: "IELTS Pre-Intermediate", desc: "4.5-5.0/9.0" }
            ]
        },
        {
            title: "TỪ 5.0 - 7.5+ IELTS",
            desc: "Chiến lược học tập tối ưu, luyện đề chuyên sâu. Phát triển toàn diện kỹ năng Listening & Reading. Cam kết đạt mục tiêu, sẵn sàng cho IELTS cấp độ cao.",
            levels: [
                { name: "IELTS Intermediate", desc: "5.5-6.0" },
                { name: "IELTS Upper", desc: "6.5-7.0" },
                { name: "IELTS Advanced", desc: "7.5-8.0+" }
            ]
        }
    ]
};

const RouteCourse = () => {
    const [toeicCourses, setToeicCourses] = useState([]);
    const [ieltsCourses, setIeltsCourses] = useState([]);
    const [filter, setFilter] = useState('all'); // all | toeic | ielts

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.GET_COURSES);
                const data = res.data.data;
                setToeicCourses(data.filter(course => course.type === "toeic"));
                setIeltsCourses(data.filter(course => course.type === "ielts"));
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };
        fetchCourses();
    }, []);

    // Banner/Header
    const renderHeader = () => (
        <div>
            {/* Menu */}
            <div style={{
                display: 'flex',
                background: '#fff',
                borderBottom: '1px solid #e0e0e0',
                height: 40,
                alignItems: 'center'
            }}>
                <div style={{
                    background: '#12006b',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '0 32px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                }}>
                    Giới thiệu
                </div>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%'
                }}>
                    <div style={{
                        flex: 1,
                        textAlign: 'center',
                        fontWeight: 500,
                        cursor: 'pointer'
                    }}>
                        Lịch khai giảng
                    </div>
                    {/* Khóa học filter */}
                    <div style={{
                        flex: 1,
                        textAlign: 'center',
                        fontWeight: 500,
                        cursor: 'pointer',
                        position: 'relative'
                    }}>
                        <div style={{ position: 'relative', display: 'inline-block', marginLeft: 8 }}>
                            <select
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                                style={{
                                    appearance: 'none',
                                    padding: '6px 12px',

                                    cursor: 'pointer',
                                    width: 140,
                                }}
                            >
                                <option value="all">Khóa học</option>
                                <option value="toeic">TOEIC</option>
                                <option value="ielts">IELTS</option>
                            </select>
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: 12,
                                    pointerEvents: 'none',
                                    transform: 'translateY(-50%)',
                                    fontSize: 12,
                                    color: '#555'
                                }}
                            >
                                ▼
                            </div>
                        </div>
                    </div>
                    <div style={{
                        flex: 1,
                        textAlign: 'center',
                        fontWeight: 500,
                        cursor: 'pointer'
                    }}>
                        Hướng dẫn đăng ký học
                    </div>
                    <div style={{
                        flex: 1,
                        textAlign: 'center',
                        fontWeight: 500,
                        cursor: 'pointer'
                    }}>
                        Hỗ trợ
                    </div>
                </div>
            </div>
            {/* Banner background (ảnh) */}
            <div style={{ height: 400, width: '100%' }}>
                <img
                    src="/images/Banner.png"
                    alt="Banner"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
        </div>
    );

    // Component render cho từng loại roadmap và course
    const renderSection = (title, roadmapArr, coursesArr) => (
        <div style={{ marginBottom: 48 }}>
            {/* Title Course */}
            <div style={{
                fontWeight: 'bold',
                fontSize: 32,
                marginBottom: 24,
                textAlign: 'left',
                color: '#222'
            }}>
                <span style={{
                    display: 'inline-block',
                    width: 8,
                    height: 32,
                    background: '#aaa',
                    borderRadius: 2,
                    marginRight: 12
                }}></span>
                {title} Course
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
                <div style={{
                    flex: 1,
                    minWidth: 420,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16
                }}>
                    <div style={{
                        background: '#f0f7ff',
                        padding: 16,
                        borderRadius: 8,
                        fontWeight: 'bold',
                        marginBottom: 8,
                        fontSize: 28,
                        width: '100%',
                        alignSelf: 'stretch',
                        textAlign: 'center',
                        border: '1px solid #c9e2fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        
                        {title} Roadmap
                    </div>
                    <Accordion defaultActiveKey="0" alwaysOpen>
                        {roadmapArr.map((item, idx) => (
                            <Accordion.Item eventKey={idx.toString()} key={idx}
                                style={{
                                    background: '#f0f7ff',
                                    border: '1px solid #c9e2fa',
                                    borderRadius: 8,
                                    marginBottom: 16
                                }}
                            >
                                <Accordion.Header>{item.title}</Accordion.Header>
                                <Accordion.Body>
                                    <div style={{ fontSize: 13, marginBottom: 8 }}>{item.desc}</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {item.levels.map((level, i) => (
                                            <button
                                                key={i}
                                                className="btn btn-light w-100 mb-2 text-start"
                                                style={{
                                                    border: '1px solid #bfc9d1',
                                                    borderRadius: 8,
                                                    fontWeight: 500,
                                                    fontSize: 15,
                                                    background: '#fff'
                                                }}
                                            >
                                                <div>{level.name}</div>
                                                <div style={{ fontSize: 12, color: '#666' }}>{level.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>
                {/* Courses */}
                <div style={{
                    flex: 2,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 24,
                    minHeight: 700,
                    maxHeight: 700,
                    overflowY: 'auto'
                }}>
                    {coursesArr.map((course, i) => (
                        <div
                            key={i}
                            style={{
                                background: '#f0f7ff',
                                border: '1px solid #c9e2fa',
                                borderRadius: 8,
                                padding: 16,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                minHeight: 330,
                                alignSelf: 'flex-start'
                            }}
                        >
                            <img src={course.imageURL} alt={course.nameCourses} style={{ width: '100%', borderRadius: 8, marginBottom: 8, objectFit: 'cover' }} />
                            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{course.nameCourses}</div>
                            <div style={{ fontSize: 13, marginBottom: 8 }}>Thời lượng: {course.durationDays} buổi</div>
                            <button style={{
                                background: '#19b46a',
                                color: '#fff',
                                border: '2px solid #19b46a',
                                borderRadius: 6,
                                padding: '6px 16px',
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}>Tìm hiểu thêm</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Xác định dữ liệu hiển thị theo filter
    let sections = [];
    if (filter === 'all') {
        sections = [
            renderSection('TOEIC', roadmapData.toeic, toeicCourses),
            renderSection('IELTS', roadmapData.ielts, ieltsCourses)
        ];
    } else if (filter === 'toeic') {
        sections = [
            renderSection('TOEIC', roadmapData.toeic, toeicCourses)
        ];
    } else if (filter === 'ielts') {
        sections = [
            renderSection('IELTS', roadmapData.ielts, ieltsCourses)
        ];
    }

    return (
        <div>
            {renderHeader()}
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 0' }}>
                {sections}
            </div>
        </div>
    );
};

export default RouteCourse;