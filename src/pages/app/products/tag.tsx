import React from 'react'

interface TagProps {
  bgColor: string
  textColor: string
  children: React.ReactNode
}

export function Tag({ bgColor, textColor, children }: TagProps) {
  return (
    <div
      className={`label-sm items-center justify-center rounded-full bg-[${bgColor}] px-2 py-1 text-[${textColor}]`}
    >
      {children}
    </div>
  )
}
