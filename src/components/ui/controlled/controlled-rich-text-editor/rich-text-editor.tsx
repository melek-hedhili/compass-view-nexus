import {
  Controller,
  type FieldPath,
  type FieldValues,
  get,
  useFormContext,
} from "react-hook-form";
import type {
  QuillEditorProps,
  QuillTextEditorProps,
} from "./rich-text-editor.types";
import Quill from "react-quill-new";

import { type FC } from "react";
import {
  richTextEditorDefaultFormats,
  richTextEditorDefaultModules,
} from "./rich-text-editor.utils";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import "./rich-text-editor.css";
import "react-quill-new/dist/quill.snow.css";

const QuillEditorRoot: FC<QuillEditorProps & { hasError?: boolean }> = ({
  hasError = false,
  height = 230,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-col overflow-hidden rounded-md border quill-editor-root",
      hasError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
    )}
    style={{ height: typeof height === "number" ? `${height}px` : height }}
  >
    <Quill {...props} />
  </div>
);

const RichTextEditor = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  title,
  placeholder,
  height = 230,
  loading = false,
  id,
  helperText,
  required = false,
  rules,
}: QuillTextEditorProps<TFieldValues, TName>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();
  const fieldError = get(errors, name);
  const errorMessage = fieldError?.message as string;
  const hasError = !!fieldError;
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value: string) => {
          if (required && (!value || value === "<p><br></p>")) {
            return "Ce champ est requis";
          }

          // Get the minLength from rules if it exists
          const minLength = rules?.minLength as
            | { value: number; message: string }
            | undefined;

          if (minLength) {
            // Remove HTML tags and normalize whitespace
            const textContent = value
              ?.replace(/<[^>]+>/g, "")
              .replace(/&nbsp;/g, " ")
              .replace(/\s+/g, " ")
              .trim();

            if (textContent.length < minLength.value) {
              return minLength.message;
            }
          }

          return true;
        },
        ...rules,
      }}
      render={({ field: { onChange, value } }) => (
        <div className="space-y-2">
          {title && (
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {title}
            </p>
          )}
          <QuillEditorRoot
            id={id}
            modules={richTextEditorDefaultModules}
            formats={richTextEditorDefaultFormats}
            onChange={onChange}
            placeholder={placeholder}
            value={value || ""}
            hasError={hasError}
            height={height}
          />
          {loading && (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            </div>
          )}
          {(hasError || helperText) && (
            <p className="text-red-600 text-xs mt-1" role="alert">
              {errorMessage || helperText}
            </p>
          )}
        </div>
      )}
    />
  );
};

export { RichTextEditor, QuillEditorRoot };
