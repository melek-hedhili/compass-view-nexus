import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useController, useFormContext } from "react-hook-form";

export interface FileProps extends File {
  preview: string;
  id: string;
}

interface UploadingFile {
  file: FileProps;
  id: string;
  progress: number;
  url?: string;
}

interface FileUploadProps {
  name: string;
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
  acceptedTypes?: string[];
  onError?: (error: string | null) => void;
}

const ControlledDropZone: React.FC<FileUploadProps> = ({
  name,
  maxFiles = 2,
  maxSizePerFile = 2, // Set default max file size to 2 MB
  acceptedTypes = ["image/*", "application/pdf"],
  onError,
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadingFile[]>([]);
  const [dropError, setDropError] = useState<string | null>(null);

  const { control } = useFormContext();
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: [],
  });

  // Simulate file upload with progress
  const simulateUpload = useCallback(
    (file: File) => {
      const fileId = Math.random().toString(36).substr(2, 9);
      const fileWithExtras: FileProps = Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: fileId,
      });

      const uploadingFile: UploadingFile = {
        file: fileWithExtras,
        id: fileId,
        progress: 0,
      };

      setUploadingFiles((prev) => [...prev, uploadingFile]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  progress: Math.min(f.progress + Math.random() * 20, 100),
                }
              : f
          )
        );
      }, 200);

      // Complete upload after 2-3 seconds
      setTimeout(() => {
        clearInterval(interval);
        const completedFile: UploadingFile = {
          ...uploadingFile,
          progress: 100,
          url: URL.createObjectURL(file),
        };

        setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
        setUploadedFiles((prev) => {
          const newFiles = [...prev, completedFile];
          onChange(newFiles.map((f) => f.file));
          setDropError(null); // Clear error on successful upload
          if (onError) onError(null);
          return newFiles;
        });
      }, 2000 + Math.random() * 1000);
    },
    [onChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const totalFiles =
        uploadedFiles.length + uploadingFiles.length + acceptedFiles.length;

      if (totalFiles > maxFiles) {
        // Handle max files error
        return;
      }

      let hasOversized = false;
      acceptedFiles.forEach((file) => {
        if (file.size <= maxSizePerFile * 1024 * 1024) {
          simulateUpload(file);
          setDropError(null); // Clear error if a valid file is added
          if (onError) onError(null);
        } else {
          hasOversized = true;
        }
      });
      if (hasOversized) {
        setDropError(
          `Un ou plusieurs fichiers dépassent la taille maximale autorisée (${maxSizePerFile} Mo).`
        );
        if (onError)
          onError(
            `Un ou plusieurs fichiers dépassent la taille maximale autorisée (${maxSizePerFile} Mo).`
          );
      }
    },
    [
      uploadedFiles.length,
      uploadingFiles.length,
      maxFiles,
      maxSizePerFile,
      simulateUpload,
      onError,
    ]
  );

  const removeUploadingFile = useCallback((fileId: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const removeUploadedFile = useCallback(
    (fileId: string) => {
      setUploadedFiles((prev) => {
        const newFiles = prev.filter((f) => f.id !== fileId);
        onChange(newFiles.map((f) => f.file));
        if (newFiles.length === 0) setDropError(null); // Clear error if all files removed
        if (newFiles.length === 0 && onError) onError(null);
        return newFiles;
      });
    },
    [onChange, onError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
    maxSize: maxSizePerFile * 1024 * 1024,
  });

  return (
    <Card className="border rounded-lg overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Drag & Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-3">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Glissez-déposez des fichiers ici
              </p>
              <p className="text-xs text-muted-foreground">
                Ou cliquez pour parcourir (max {maxFiles} fichiers, jusqu'à{" "}
                {maxSizePerFile} Mo chacun)
              </p>
            </div>
            <Button variant="outline" size="sm">
              Parcourir les fichiers
            </Button>
          </div>
        </div>
        {dropError && (
          <div className="text-red-500 text-sm mt-2">{dropError}</div>
        )}

        {/* Uploading Files */}
        {uploadingFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg"
          >
            <div className="flex-shrink-0">
              {file.file.type.startsWith("image/") ? (
                <div className="w-10 h-10 bg-muted rounded overflow-hidden">
                  <img
                    src={URL.createObjectURL(file.file)}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                  <Upload className="h-4 w-4" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.file.size / 1024 / 1024).toFixed(1)} MB
              </p>
              <Progress value={file.progress} className="h-1 mt-1" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeUploadingFile(file.id)}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Fichiers téléchargés</h4>
            <div className="flex flex-row space-x-3 overflow-x-auto pb-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="relative group min-w-[128px] w-32"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    {file.url && file.file.type.startsWith("image/") ? (
                      <img
                        src={file.url}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : file.url && file.file.type === "application/pdf" ? (
                      <div className="w-full h-full relative">
                        <iframe
                          src={file.url}
                          className="w-full h-full border-0"
                          title={file.file.name}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                          <FileText className="h-3 w-3 inline mr-1" />
                          {file.file.name}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                        <span className="text-xs text-center truncate px-2">
                          {file.file.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeUploadedFile(file.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error.message}</p>}
      </div>
    </Card>
  );
};

export default ControlledDropZone;
