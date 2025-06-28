import React from "react";

const FeedbackList = ({ feedbacks }) => {
  if (!feedbacks || feedbacks.length === 0) return null;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 24,
        marginTop: 32,
        boxShadow: "0 4px 16px #0001",
        width: "100%",
      }}
    >
      <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
        Student Feedback
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
        }}
      >
        {feedbacks.map((fb, index) => (
          <div
            key={fb._id || index}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              padding: 20,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              backgroundColor: "#fdfdfd",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "#dfe6f3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#2d1ca0",
                }}
              >
                {fb.userId?.profileId?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div style={{ fontWeight: 600, fontSize: 18 }}>
                {fb.userId?.profileId?.name || "Anonymous"}
              </div>
            </div>
            <div style={{ fontSize: 25, color: "#fbbf24" }}>
              {"★".repeat(fb.rating)}
              {"☆".repeat(5 - fb.rating)}
            </div>

            <p style={{ fontSize: 16, lineHeight: 1.5, color: "#333" }}>
              {fb.feedback}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;
