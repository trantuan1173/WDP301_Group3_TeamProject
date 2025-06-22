import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserClass = () => {
  // Dữ liệu mẫu (mock data) – có thể thay bằng props hoặc API sau này
  const classData = {
    id: 1,
    name: 'Class A',
    description: 'This is class A description.',
    isdeleted: false,
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Class Detail</h2>
      <div className="card">
        <div className="card-body">
          <p><strong>ID:</strong> {classData.id}</p>
          <p><strong>Name:</strong> {classData.name}</p>
          <p><strong>Description:</strong> {classData.description}</p>
          <p><strong>Is Deleted:</strong> {classData.isdeleted ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default UserClass;
