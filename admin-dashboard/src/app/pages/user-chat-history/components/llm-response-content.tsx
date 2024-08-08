import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy } from "react-icons/fa";

interface CopyContentProps {
  content: string;
  generated_date: string;
}

const CopyContent: React.FC<CopyContentProps> = ({
  content,
  generated_date,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="position-relative">
      <div className="p-3 border rounded bg-light position-relative">
        <p style={{ fontWeight: "600", color: "#4A90E2" }}>
          Generated plan timestamp{" "}
          <span style={{ fontStyle: "italic", color: "#FF6F61" }}>
            {generated_date}
          </span>
        </p>
        <p className="mb-0">{content}</p>
        {!copied ? (
          <CopyToClipboard text={content} onCopy={handleCopy}>
            <button className="btn btn-outline-secondary position-absolute top-0 end-0 mt-2 me-2">
              <FaCopy size={20} />
            </button>
          </CopyToClipboard>
        ) : (
          <span className="position-absolute top-0 end-0 mt-2 me-2 text-success">
            Copied!
          </span>
        )}
      </div>
    </div>
  );
};

export default CopyContent;
