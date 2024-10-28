import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getProfile } from '../api/get-profile'
import { signOut } from '../api/sign-out'
import logoutIcon from '../assets/icons/logout.svg'

export function AccountMenu() {
  const navigate = useNavigate()

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  const { mutateAsync: signOutFn, isPending: isSigningOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      navigate('/sign-in', { replace: true })
    },
  })

  const [isOpen, setIsOpen] = useState(false)

  const toggleAccountMenu = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <div className="relative">
      <div onClick={toggleAccountMenu} className="fcursor-pointer">
        <img
          src={profile?.avatar?.url}
          className="h-12 w-12 cursor-pointer rounded-[10px] object-cover"
          alt="Imagem do usuário"
        />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-3 flex w-[168px] flex-col gap-5 rounded-[12px] bg-white p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <img
              src={profile?.avatar?.url}
              alt="Imagem do usuário"
              className="h-8 w-8 rounded-lg border border-[var(--shape)] object-cover"
            />

            <p className="body-sm text-[var(--gray-300)]">{profile?.name}</p>
          </div>

          <div className="border-t border-[var(--shape)]"></div>

          <button
            className="flex items-center justify-between  p-0.5 text-[var(--orange-base)] transition-colors duration-200 hover:text-[var(--orange-dark)]"
            onClick={() => signOutFn()}
            disabled={isSigningOut}
          >
            <p className="action-sm">Sair</p>

            <img src={logoutIcon} className="h-5 w-5" alt="Ícone de logout" />
          </button>
        </div>
      )}
    </div>
  )
}
