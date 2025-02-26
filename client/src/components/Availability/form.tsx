import * as React from "react"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"
import { TextField, FormControl, FormLabel, FormHelperText } from "@mui/material"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  return {
    name: fieldContext.name,
    error: fieldState?.error,
    ...fieldState,
  }
}

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={className} {...props} />
})
FormItem.displayName = "FormItem"

const FormLabelComponent = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof FormLabel>
>(({ className, ...props }, ref) => {
  const { error } = useFormField()

  return (
    <FormLabel
      ref={ref}
      error={!!error}
      className={className}
      {...props}
    />
  )
})
FormLabelComponent.displayName = "FormLabelComponent"

const FormControlComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { error } = useFormField()

  return (
    <FormControl
      ref={ref}
      error={!!error}
      className={className}
      {...props}
    />
  )
})
FormControlComponent.displayName = "FormControlComponent"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm text-slate-500 ${className}`}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      className={`text-sm font-medium text-red-500 ${className}`}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

const FormControlInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof TextField>
>(({ className, ...props }, ref) => {
  const { error } = useFormField()

  return (
    <TextField
      ref={ref}
      error={!!error}
      helperText={error?.message}
      fullWidth
      className={className}
      {...props}
    />
  )
})
FormControlInput.displayName = "FormControlInput"

export {
  useFormField,
  Form,
  FormItem,
  FormLabelComponent as FormLabel,
  FormControlComponent as FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormControlInput as FormInput,
}
