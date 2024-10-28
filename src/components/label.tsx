import React from 'react'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string
  children: React.ReactNode
}

export function Label({
  htmlFor,
  children,
  className = '',
  ...props
}: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={`label-md ${className}`} {...props}>
      {children}
    </label>
  )
}
