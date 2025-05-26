import React, { useEffect, useRef, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';

const roadmapData = {
    toeic: [
        {
            title: "FROM BEGINNER - 450+",
            desc: "Improve your skills from beginner to 450+/990 TOEIC",
            levels: [
                { name: "TOEIC Foundation", desc: "Build the foundation" },
                { name: "TOEIC Beginner", desc: "350+/990 TOEIC" },
                { name: "TOEIC Pre-Intermediate", desc: "450+/990 TOEIC" }
            ]
        },
        {
            title: "FROM 450 - 700+ TOEIC",
            desc: "Optimal learning strategies, intensive listening practice. Comprehensive development of Listening & Reading skills. Commitment to achieving goals, ready for advanced TOEIC.",
            levels: [
                { name: "TOEIC Pre-Intermediate", desc: "450+/990 TOEIC" },
                { name: "TOEIC Intermediate", desc: "550+/990 TOEIC" },
                { name: "TOEIC Advanced", desc: "700+/990 TOEIC" }
            ]
        },
        {
            title: "4 SKILLS",
            desc: "Comprehensive roadmap for developing all 4 SKILLS: Listening - Reading - Speaking - Writing in 10-11 months. Intensive curriculum, effective methods. From beginner to mastery, ready for all TOEIC challenges.",
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
            title: "FROM BEGINNER - 5.0",
            desc: "Personalized IELTS learning roadmap from beginner to 5.0/9.0",
            levels: [
                { name: "IELTS Foundation", desc: "-3.0/9.0" },
                { name: "IELTS Beginner", desc: "3.5-4.0/9.0" },
                { name: "IELTS Pre-Intermediate", desc: "4.5-5.0/9.0" }
            ]
        },
        {
            title: "FROM 5.0 - 7.5+ IELTS",
            desc: "Optimal learning strategies, intensive test practice. Comprehensive development of Listening & Reading skills. Commitment to achieving goals, ready for advanced IELTS.",
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
    const [activeTab, setActiveTab] = useState('intro');

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
    const chunkArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    // Banner/Header
    const renderHeader = () => (
        <div
            style={{
            width: '100vw',
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            overflow: 'hidden',
            background: '#fff'
        }}>
            <div
    style={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        overflow: 'hidden',
    }}
>
            {/* Banner background (image) */}
            <Carousel interval={5000} controls={true} indicators={true} pause={false}>
            <Carousel.Item>
                <img
                    src="/images/Banner.png"
                    alt="Banner 1"
                    style={{ width: '100vw', height: "100%  ", objectFit: 'cover', display: 'block' }}
                />
            </Carousel.Item>
            {/* Add more banner slides if needed */}
            <Carousel.Item>
                <img
                    src="/images/Banner1.png"
                    alt="Banner 2"
                    style={{ width: '100vw', height: "100%  ", objectFit: 'cover', display: 'block' }}
                />
            </Carousel.Item>
        </Carousel>
        </div>
            {/* Menu */}
            <div
                style={{
                    display: 'flex',
                    background: '#fff',
                    borderBottom: '1px solid #e0e0e0',
                    height: 40,
                    alignItems: 'center',
                }}
            >
                {/* Introduction */}
                <div
                    onClick={() => setActiveTab('intro')}
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        background: activeTab === 'intro' ? '#12006b' : '#fff',
                        color: activeTab === 'intro' ? '#fff' : '#000',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'intro' ? '2px solid #12006b' : 'none',
                    }}
                >
                    Introduction
                </div>

                {/* Opening Schedule */}
                <div
                    onClick={() => setActiveTab('schedule')}
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        fontWeight: 500,
                        cursor: 'pointer',
                        background: activeTab === 'schedule' ? '#12006b' : 'transparent',
                        color: activeTab === 'schedule' ? '#fff' : '#000',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    Opening Schedule
                </div>

                {/* Courses (dropdown) */}
                <div
                    style={{
                        flex: 1,
                        position: 'relative',
                        background: activeTab === 'courses' ? '#12006b' : 'transparent',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <select
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setActiveTab('courses');
                        }}
                        style={{
                            appearance: 'none',
                            width: '100%',
                            height: '100%',
                            padding: '0 32px 0 16px',
                            border: 'none',
                            background: 'transparent',
                            color: activeTab === 'courses' ? '#fff' : '#000',
                            fontWeight: 'bold',
                            textAlignLast: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <option style={{ color: '#000' }} value="all">Courses</option>
                        <option style={{ color: '#000' }} value="toeic">TOEIC</option>
                        <option style={{ color: '#000' }} value="ielts">IELTS</option>

                    </select>
                    {/* Arrow icon ▼ */}
                    <div
                        style={{
                            position: 'absolute',
                            right: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            fontSize: 12,
                            color: activeTab === 'courses' ? '#fff' : '#000',
                        }}
                    >
                        ▼
                    </div>
                </div>

                {/* Registration Guide */}
                <div
                    onClick={() => setActiveTab('guide')}
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        fontWeight: 500,
                        cursor: 'pointer',
                        background: activeTab === 'guide' ? '#12006b' : 'transparent',
                        color: activeTab === 'guide' ? '#fff' : '#000',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    Registration Guide
                </div>

                {/* Support */}
                <div
                    onClick={() => setActiveTab('support')}
                    style={{
                        flex: 1,
                        textAlign: 'center',
                        fontWeight: 500,
                        cursor: 'pointer',
                        background: activeTab === 'support' ? '#12006b' : 'transparent',
                        color: activeTab === 'support' ? '#fff' : '#000',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    Support
                </div>
            </div>
            
        </div>
    );


    // Component to render each roadmap and course type
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
                    minHeight: 350,
                    maxHeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Carousel interval={5000} controls={coursesArr.length > 3} indicators={false} pause={false}>
                        {chunkArray(coursesArr, 3).map((group, idx) => (
                            <Carousel.Item key={idx}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr',
                                    gap: 24,
                                    minHeight: 330
                                }}>
                                    {group.map((course, i) => (
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
                                            <img src={course.imageURL} alt={course.nameCourses} style={{ width: '100%', height: "auto", borderRadius: 8, marginBottom: 8, objectFit: 'cover' }} />
                                            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{course.nameCourses}</div>
                                            <div style={{ fontSize: 13, marginBottom: 8 }}>Duration: {course.durationDays} sessions</div>
                                            <button style={{
                                                background: '#19b46a',
                                                color: '#fff',
                                                border: '2px solid #19b46a',
                                                borderRadius: 6,
                                                padding: '6px 16px',
                                                fontSize: 14,
                                                fontWeight: 500,
                                                cursor: 'pointer'
                                            }}>Learn more</button>
                                        </div>
                                    ))}
                                    {/* If group < 3, add empty boxes for alignment */}
                                    {Array.from({ length: 3 - group.length }).map((_, idx2) => (
                                        <div key={`empty-${idx2}`} />
                                    ))}
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
            </div>
        </div>
    );

    // Determine which sections to display based on filter
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