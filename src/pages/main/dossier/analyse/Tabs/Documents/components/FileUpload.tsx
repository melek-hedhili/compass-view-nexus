
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useController, useFormContext } from "react-hook-form";

interface FileProps extends File {
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
  onUpload?: (files: File[], onProgress: (fileId: string, progress: number) => void) => Promise<void>;
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  maxFiles = 2,
  maxSizePerFile = 4,
  acceptedTypes = ["image/*", "application/pdf"],
  onUpload,
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadingFile[]>([]);
  
  const { control } = useFormContext();
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: [],
  });

  // Handle real file upload with progress
  const handleRealUpload = useCallback(async (files: File[]) => {
    if (!onUpload) return;

    // Initialize uploading files with proper IDs
    const filesToUpload = files.map((file, index) => {
      const fileId = file.name + index; // Use filename + index as consistent ID
      const fileWithExtras: FileProps = Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: fileId,
      });
      
      return {
        file: fileWithExtras,
        id: fileId,
        progress: 0,
      };
    });

    setUploadingFiles(prev => [...prev, ...filesToUpload]);

    // Progress callback function
    const onProgress = (fileId: string, progress: number) => {
      setUploadingFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: Math.min(progress, 100) }
            : f
        )
      );
    };

    try {
      // Call the upload function with progress callback
      await onUpload(files, onProgress);
      
      // Move completed files to uploaded state
      setUploadingFiles(prev => prev.filter(f => !filesToUpload.some(tf => tf.id === f.id)));
      setUploadedFiles(prev => {
        const completedFiles = filesToUpload.map(f => ({
          ...f,
          progress: 100,
          url: URL.createObjectURL(f.file),
        }));
        const newFiles = [...prev, ...completedFiles];
        onChange(newFiles.map(f => f.file));
        return newFiles;
      });
    } catch (error) {
      // Remove failed uploads
      setUploadingFiles(prev => prev.filter(f => !filesToUpload.some(tf => tf.id === f.id)));
      console.error('Upload failed:', error);
    }
  }, [onUpload, onChange]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const totalFiles = uploadedFiles.length + uploadingFiles.length + acceptedFiles.length;
    
    if (totalFiles > maxFiles) {
      // Handle max files error
      return;
    }

    const validFiles = acceptedFiles.filter(file => file.size <= maxSizePerFile * 1024 * 1024);
    
    if (validFiles.length > 0) {
      // Add files to uploaded state immediately without uploading
      const filesToAdd = validFiles.map(file => {
        const fileId = Math.random().toString(36).substr(2, 9);
        const fileWithExtras: FileProps = Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: fileId,
        });
        
        return {
          file: fileWithExtras,
          id: fileId,
          progress: 0,
          url: URL.createObjectURL(file),
        };
      });

      setUploadedFiles(prev => {
        const newFiles = [...prev, ...filesToAdd];
        onChange(newFiles.map(f => f.file));
        return newFiles;
      });
    }
  }, [uploadedFiles.length, uploadingFiles.length, maxFiles, maxSizePerFile, onChange]);

  const removeUploadingFile = useCallback((fileId: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const removeUploadedFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => {
      const newFiles = prev.filter(f => f.id !== fileId);
      onChange(newFiles.map(f => f.file));
      return newFiles;
    });
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
    maxSize: maxSizePerFile * 1024 * 1024,
  });

  return (
    <Card className="border rounded-lg overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">uploadthing</h3>
          <p className="text-sm text-muted-foreground">
            File upload using uploadthing.
          </p>
        </div>

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
              <p className="text-sm font-medium">Drag & drop images here</p>
              <p className="text-xs text-muted-foreground">
                Or click to browse (max {maxFiles} files, up to {maxSizePerFile}MB each)
              </p>
            </div>
            <Button variant="outline" size="sm">
              Browse files
            </Button>
          </div>
        </div>

        {/* Uploading Files */}
        {uploadingFiles.map((file) => (
          <div key={file.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
            <div className="flex-shrink-0">
              {file.file.type.startsWith('image/') ? (
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

        {/* Upload Button */}
        {uploadedFiles.length > 0 && (
          <div className="flex justify-end">
            <Button 
              onClick={() => {
                if (onUpload && uploadedFiles.length > 0) {
                  handleRealUpload(uploadedFiles.map(f => f.file));
                  // Clear selected files after upload
                  setUploadedFiles([]);
                  onChange([]);
                }
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Upload {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}
            </Button>
          </div>
        )}

        {/* Selected Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Selected files</h4>
            <div className="grid grid-cols-2 gap-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    {file.url && file.file.type.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : file.url && file.file.type === 'application/pdf' ? (
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
                        <span className="text-xs text-center truncate px-2">{file.file.name}</span>
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

        {error && (
          <p className="text-sm text-destructive">{error.message}</p>
        )}
      </div>
    </Card>
  );
};

export default FileUpload;
