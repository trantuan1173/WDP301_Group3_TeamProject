import React from "react";

export default function ClassInfoTab({ classInfo }) {
  if (!classInfo) return <div>Đang tải thông tin lớp...</div>;
  const course = classInfo.course || {};
  const detail = course.detail || {};

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <div className="font-bold text-xl mb-2">
          {classInfo.className || "Tên lớp"}
        </div>
        <div className="mb-1">
          Khóa học: <span className="font-semibold">{course.name || "?"}</span>
        </div>
        <div className="mb-1">
          Level: <span className="font-semibold">{detail.level || "?"}</span>
        </div>
        <div className="mb-1">
          Type: <span className="font-semibold">{detail.type || "?"}</span>
        </div>
        <div className="mb-1">
          Thời lượng:{" "}
          <span className="font-semibold">
            {classInfo.progress}/{detail.durationDays || "?"} buổi
          </span>
        </div>
        <div className="mb-1">
          Ghi chú: <span className="font-semibold">{classInfo.note || ""}</span>
        </div>
      </div>
      <div>
        <img
          src={detail.imageURL || "/no-image.png"}
          alt="Course"
          className="w-48 h-48 object-contain rounded border"
        />
      </div>
    </div>
  );
}