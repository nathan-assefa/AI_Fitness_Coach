import React from "react";

interface DownloadDocumentButtonProps {
  userId: string;
}

const DownloadDocumentButton: React.FC<DownloadDocumentButtonProps> = ({
  userId,
}) => {
  const handleDownload = async () => {
    const apiUrl: string = import.meta.env.VITE_SERVER_URL;
    try {
      const response = await fetch(`${apiUrl}/download/recent/${userId}/`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(new Blob([blob]));

      const link = document.createElement("a");
      link.href = url;
      // link.setAttribute("download", `document_${userId}.doc`);
      const generatedAt = new Date()
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");
      link.setAttribute(
        "download",
        `document_userId_${userId}_generatedAt_${generatedAt}.doc`
      );

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  return (
    <button
      style={{
        width: "100%",
        borderRadius: "0",
      }}
      className="btn btn-primary"
      onClick={handleDownload}
    >
      Download Plan For The User
      <span style={{ marginLeft: "8px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-download"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
      </span>
    </button>
  );
};

export default DownloadDocumentButton;
