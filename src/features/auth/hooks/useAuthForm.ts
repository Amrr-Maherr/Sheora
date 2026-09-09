import { useState, type FormEvent } from "react";

type FieldErrors<T> = Partial<Record<keyof T, string>>;

type UseAuthFormOptions<T extends object> = {
  initialValues: T;
  validate: (values: T) => FieldErrors<T>;
};

export function useAuthForm<T extends object>({
  initialValues,
  validate,
}: UseAuthFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof T, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSubmitting(false);
  };

  return { values, errors, isSubmitting, handleChange, handleSubmit };
}