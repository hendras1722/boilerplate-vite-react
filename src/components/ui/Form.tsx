import React, { createContext, useContext, useState, useImperativeHandle, forwardRef } from 'react'
import type { ZodSchema } from 'zod'

interface FormContextType {
  state: Record<string, unknown>
  errors: Record<string, string>
  clearError: (path: string) => void
  validateField: (path: string, value: unknown) => void
}

const FormContext = createContext<FormContextType | null>(null)

export interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  state: Record<string, unknown>
  schema?: ZodSchema
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>
  onValidateError?: (errors: Array<{ name: string; message: string }>) => void
}

export interface FormRefInstance {
  setErrors: (errors: Array<{ name: string; message: string }>) => void
  validate: () => boolean
}

export const Form = forwardRef<FormRefInstance, FormProps>(
  ({ children, state, schema, onSubmit, onValidateError, ...props }, ref) => {
    const [errors, setErrorsState] = useState<Record<string, string>>({})

    const clearError = (path: string) => {
      setErrorsState((prev) => {
        const next = { ...prev }
        delete next[path]
        return next
      })
    }

    const validateField = (path: string, value: unknown) => {
      if (!schema) return
      
      try {
        // Construct an updated state object with the new value of the validated field
        // to avoid validating against stale state since React updates state asynchronously.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const setNestedValue = (obj: any, pathStr: string, val: any): any => {
          const parts = pathStr.split('.')
          const root = { ...obj }
          let current = root
          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i]
            current[part] = { ...current[part] }
            current = current[part]
          }
          current[parts[parts.length - 1]] = val
          return root
        }

        const updatedState = setNestedValue(state, path, value)
        const result = schema.safeParse(updatedState)
        if (result.success) {
          clearError(path)
        } else {
          // Find if there is an error for this specific field path
          const fieldError = result.error.issues.find(
            (issue) => issue.path.join('.') === path
          )
          if (fieldError) {
            setErrorsState((prev) => ({ ...prev, [path]: fieldError.message }))
          } else {
            clearError(path)
          }
        }
      } catch {
        // ignore
      }
    }

    const validate = (): boolean => {
      if (!schema) return true
      
      const result = schema.safeParse(state)
      if (result.success) {
        setErrorsState({})
        return true
      } else {
        const newErrors: Record<string, string> = {}
        const errorList: Array<{ name: string; message: string }> = []
        
        result.error.issues.forEach((issue) => {
          const pathStr = issue.path.join('.')
          newErrors[pathStr] = issue.message
          errorList.push({ name: pathStr, message: issue.message })
        })
        
        setErrorsState(newErrors)
        if (onValidateError) {
          onValidateError(errorList)
        }
        return false
      }
    }

    useImperativeHandle(ref, () => ({
      setErrors: (apiErrors) => {
        const errorMap: Record<string, string> = {}
        apiErrors.forEach((err) => {
          errorMap[err.name] = err.message
        })
        setErrorsState(errorMap)
      },
      validate
    }))

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const isValid = validate()
      if (isValid && onSubmit) {
        await onSubmit(e)
      }
    }

    return (
      <FormContext.Provider value={{ state, errors, clearError, validateField }}>
        <form onSubmit={handleSubmit} {...props}>
          {children}
        </form>
      </FormContext.Provider>
    )
  }
)
Form.displayName = 'Form'

export interface FormFieldProps {
  name: string
  label?: string
  children: React.ReactElement
  className?: string
  style?: React.CSSProperties
}

export function FormField({ name, label, children, className, style }: FormFieldProps) {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('FormField must be used inside a Form component')
  }

  const error = context.errors[name]
  const child = React.Children.only(children) as React.ReactElement<{
    onChange?: (e: unknown) => void
    style?: React.CSSProperties
    id?: string
  }>

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | unknown) => {
    // Invoke child's original onChange first
    if (child.props.onChange) {
      child.props.onChange(e)
    }

    const value = e && typeof e === 'object' && 'target' in e 
      ? (e as React.ChangeEvent<HTMLInputElement>).target.value 
      : e

    // Clear error immediately on change
    context.clearError(name)
    // Run Zod validation for this field
    context.validateField(name, value)
  }

  // Determine if child is a custom component that accepts our custom props (like error)
  const isCustomField = typeof child.type !== 'string'

  // Construct overridden props for the child component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childProps: any = {
    onChange: handleValueChange,
  }

  if (isCustomField) {
    // If it's a custom field component like <InputField />, we pass error directly
    childProps.error = error
  } else {
    // If it's a raw HTML element (like <input> or <textarea>), we apply styles
    childProps.style = {
      ...child.props.style,
      border: error ? '1px solid #ef4444' : child.props.style?.border,
      outline: error ? 'none' : child.props.style?.outline,
    }
  }

  const clonedChild = React.cloneElement(child, childProps)

  return (
    <div 
      className={`form-field-wrapper ${className || ''}`} 
      style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', ...style }}
    >
      {/* Renders label for raw HTML inputs. Custom fields render their own labels */}
      {!isCustomField && label && (
        <label 
          htmlFor={child.props.id || name} 
          style={{ 
            fontWeight: '500', 
            fontSize: '0.9rem', 
            color: 'var(--text-h)', 
            marginBottom: '0.25rem', 
            display: 'block' 
          }}
        >
          {label}
        </label>
      )}

      {clonedChild}

      {/* Renders error text for raw HTML inputs. Custom fields render their own error text */}
      {!isCustomField && error && (
        <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  )
}
