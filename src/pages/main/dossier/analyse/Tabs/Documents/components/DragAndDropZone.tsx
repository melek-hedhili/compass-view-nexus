import React from "react";
import FileUpload from "./FileUpload";

interface DragAndDropZoneProps {
  onUpload: (files: File[], onProgress: (fileId: string, progress: number) => void) => Promise<void>;
  loading: boolean;
}

const DragAndDropZone: React.FC<DragAndDropZoneProps> = ({ onUpload, loading }) => {
  return (
    <FileUpload
      name="uploadDocuments"
      maxFiles={10}
      maxSizePerFile={10}
      acceptedTypes={["image/*", "application/pdf"]}
      onUpload={onUpload}
    />
  );
};

export default DragAndDropZone;
