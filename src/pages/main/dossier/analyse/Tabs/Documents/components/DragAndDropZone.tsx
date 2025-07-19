import { Button } from "@/components/ui/button";
import ControlledDropZone from "@/components/ui/controlled/controlled-drop-zone/ControlledDropZone";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

const DragAndDropZone: React.FC<{
  onUploadAttachementFiles: () => void;
  loading: boolean;
}> = ({ onUploadAttachementFiles, loading }) => {
  const { watch } = useFormContext();
  const files: File[] = watch("uploadDocuments") || [];
  const [dropError, setDropError] = useState<string | null>(null);

  return (
    <>
      <ControlledDropZone
        name="uploadDocuments"
        maxFiles={10}
        maxSizePerFile={10}
        acceptedTypes={["image/*", "application/pdf"]}
        onError={setDropError}
      />
      {dropError && (
        <div className="text-red-500 text-sm mt-2">{dropError}</div>
      )}
      {files.length > 0 && !dropError && (
        <Button
          onClick={() => onUploadAttachementFiles()}
          loading={loading}
          className="mt-2"
        >
          Ajouter des fichiers
        </Button>
      )}
    </>
  );
};

export default DragAndDropZone;
