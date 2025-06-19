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
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            const [accRes, courseRes, feedbackRes] = await Promise.all([
                axios.get(API_ENDPOINTS.GET_ALL_ACCOUNT, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(API_ENDPOINTS.GET_ALL_COURSE_DETAIL, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(API_ENDPOINTS.GET_ALL_STUDENT_FEEDBACK, { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            setAccounts(accRes.data.data || []);
            setCourses(courseRes.data.data || []);
            setFeedbacks(feedbackRes.data.data || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <LoadingSpinner size={120} text="Loading..." />;

    return (
        <div className="p-8 min-h-screen">
            <AdminOverViewStats accounts={accounts} courses={courses} />
            <div className="flex gap-6 mt-6">
                {/* Cột bên trái: Quick Actions + Course Stats */}
                <div className="flex flex-col gap-6 w-1/2">
                    <AdminOverviewQuickActions onQuickAction={onQuickAction} />
                    <AdminOverviewCourseStats courses={courses} />
                </div>
                {/* Cột bên phải: New Student Add */}
                <div className="w-1/2">
                    <AdminOverviewNewStudents accounts={accounts} />
                </div>
            </div>
            <div className="mt-6">
                <AdminOverviewLastFeedback feedbacks={feedbacks} />
            </div>
        </div>
    );
}