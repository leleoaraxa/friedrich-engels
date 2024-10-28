import { NavLink, NavLinkProps } from 'react-router-dom'

export function CustomNavLink(props: NavLinkProps) {
  return (
    <NavLink
      className={({ isActive }) => `        
        flex h-10 items-center gap-2 rounded-[10px] px-4
        ${
          isActive
            ? 'action-sm pointer-events-none bg-[var(--shape)] text-[var(--orange-base)]'
            : 'body-sm text-[var(--gray-300)] hover:text-[var(--orange-dark)]'
        }
      `}
      {...props}
    />
  )
}
