import { cn } from "@/lib/utils";
import * as React from "react";
import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";

interface FormWrapperProps<TFormValues> {
  methods: UseFormReturn<any, undefined>;
  onSubmit?: SubmitHandler<TFormValues>;
  children: React.ReactNode;
  scrollToErroredInputs?: boolean;
  orderedFields?: string[];
  className?: string;
}

export function Form<TFormValues>({
  methods,
  onSubmit,
  children,
  className,
  scrollToErroredInputs = false,
  orderedFields = [],
}: FormWrapperProps<TFormValues>) {
  // submit handler with error scrolling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await methods.trigger();

    if (!isValid && scrollToErroredInputs) {
      const errors = methods.formState.errors;
      if (Object.keys(errors).length === 0) return;

      const firstErrorField =
        orderedFields.length > 0
          ? orderedFields.find((field) => field in errors)
          : Object.keys(errors)[0];

      if (!firstErrorField) return;

      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        if (firstErrorField === "description") {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          errorElement.focus();
        }
      }
      return;
    }
    if (onSubmit) methods.handleSubmit(onSubmit)(e);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit}
        className={cn("w-full flex flex-col", className)}
      >
        {children}
      </form>
    </FormProvider>
  );
}
