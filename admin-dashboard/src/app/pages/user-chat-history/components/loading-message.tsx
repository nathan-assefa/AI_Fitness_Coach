import React from "react";

const LoadingMessage: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ marginRight: "10px" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mb-0">
          Please wait, your plan is being generated. This may take a moment...
        </p>
      </div>
    </div>
  );
};

export default LoadingMessage;
