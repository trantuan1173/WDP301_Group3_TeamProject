import React from "react";
import { FaEye, FaExchangeAlt, FaTrash } from "react-icons/fa";

export default function AdminManageClassStudentList({ students, onViewDetail, onChangeClass, onRemove }) {
  if (!students || students.length === 0)
    return <div className="text-gray-600 mt-2">No student data</div>;

  return (
    <table className="min-w-[400px] w-full border rounded shadow text-sm">
      <thead>
        <tr className="bg-gray-100 text-gray-700">
          <th className="py-2 px-3 text-left font-normal">No.</th>
          <th className="py-2 px-3 text-left font-normal">Email</th>
          <th className="py-2 px-3 text-center font-normal">Action</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student, idx) => (
          <tr key={student._id || idx} className="border-b hover:bg-gray-50">
            <td className="py-2 px-3">{idx + 1}</td>
            <td className="py-2 px-3">{student.email || "Unknown"}</td>
            <td className="py-2 px-3 text-center flex gap-3 justify-center">
              <button
                title="View detail"
                className="text-blue-600 hover:text-blue-800"
                onClick={() => onViewDetail && onViewDetail(student)}
              >
                <FaEye />
              </button>
              <button
                title="Change class"
                className="text-yellow-600 hover:text-yellow-800"
                onClick={() => onChangeClass && onChangeClass(student)}
              >
                <FaExchangeAlt />
              </button>
              <button
                title="Remove from class"
                className="text-red-600 hover:text-red-800"
                onClick={() => onRemove && onRemove(student)}
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}