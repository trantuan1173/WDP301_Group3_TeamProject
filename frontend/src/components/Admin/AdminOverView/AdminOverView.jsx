import React, { useEffect, useState } from "react";
import AdminOverviewQuickActions from "./AdminOverviewQuickActions";
import AdminOverviewNewStudents from "./AdminOverviewNewStudents";
import AdminOverviewCourseStats from "./AdminOverviewCourseStats";
import AdminOverviewLastFeedback from "./AdminOverviewLastFeedback";
import AdminOverViewStats from "./AdminOverViewStats";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import LoadingSpinner from "../../LoadingSpinner";

export default function AdminOverView({ onQuickAction }) {
    const [accounts, setAccounts] = useState([]);
    const [courses, setCourses] = useState([]);
    const [feedbacksTeacher, setFeedbacksTeacher] = useState([]);
    const [feedbacksCourse, setFeedbacksCourse] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            const [accRes, courseRes, fbTeacherRes, fbCourseRes, paymentRes] = await Promise.all([
                axios.get(API_ENDPOINTS.GET_ALL_ACCOUNT, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(API_ENDPOINTS.GET_ALL_COURSE_DETAIL, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(API_ENDPOINTS.GET_ALL_FEEDBACK_TEACHER, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(API_ENDPOINTS.GET_ALL_FEEDBACK_COURSE, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(API_ENDPOINTS.GET_ALL_PAYMENT, { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            setAccounts(accRes.data.data || []);
            setCourses(courseRes.data.data || []);
            setFeedbacksTeacher(fbTeacherRes.data.data || []);
            setFeedbacksCourse(fbCourseRes.data.data || []);
            setPayments(paymentRes.data.data || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <LoadingSpinner size={120} text="Loading..." />;

    return (
        <div className="p-8 min-h-screen">
            <AdminOverViewStats accounts={accounts} courses={courses} payments={payments} />
            <div className="flex gap-6 mt-6 flex-col lg:flex-row">
                <div className="flex flex-col gap-6 w-full lg:w-1/2">
                    <AdminOverviewQuickActions onQuickAction={onQuickAction} />
                    <AdminOverviewCourseStats courses={courses} />
                </div>
                <div className="w-full lg:w-1/2">
                    <AdminOverviewNewStudents accounts={accounts} />
                </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminOverviewLastFeedback
                    feedbacks={feedbacksTeacher}
                    type="teacher"
                    title="Latest Teacher Feedback"
                />
                <AdminOverviewLastFeedback
                    feedbacks={feedbacksCourse}
                    type="course"
                    title="Latest Course Feedback"
                />
            </div>
        </div>
    );
}