import {
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from "react-hook-form";

interface QuillEditorProps {
  id?: string;
  autoModules?: boolean | Record<string, any>;
  autoFormat?: boolean | string[];
  modules?: Record<string, any>;
  formats?: string[];
  onChange: (value: string) => void;
  placeholder: any;
  value: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  height?: number | string;
  loading?: boolean;
}
interface QuillEditorRootProps {
  hasError?: boolean;
}
interface QuillTextEditorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  title?: string;
  placeholder?: string;
  height?: number;
  loading?: boolean;
  helperText?: string;
  required?: boolean;
  id?: string;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
}
export type { QuillEditorProps, QuillEditorRootProps, QuillTextEditorProps };
