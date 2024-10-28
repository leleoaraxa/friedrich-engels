import { useQuery } from '@tanstack/react-query'

import { getViewsReceivedInLast30Days } from '../../../api/views-received-in-last-30-days'
import userMultipleIcon from '../../../assets//icons/user-multiple.svg'

export function ViewsReceivedInLast30Days() {
  const { data: viewsReceived } = useQuery({
    queryKey: ['mretics', 'views-received-in-last-30-days'],
    queryFn: getViewsReceivedInLast30Days,
  })

  return (
    <div className="flex gap-4 rounded-[20px] bg-[var(--white)] pl-3 pr-7">
      <div className="my-3 flex h-[86px] w-20 items-center justify-center rounded-xl bg-[var(--blue-light)]">
        <img
          src={userMultipleIcon}
          className="h-10 w-10"
          alt="Ícone de múltiplos usuários"
        />
      </div>

      <div className="flex flex-col justify-between py-5">
        <h1 className="title-lg text-[var(--gray-400)]">
          {viewsReceived?.amount}
        </h1>
        <p className="body-xs text-[var(--gray-300)]">Pessoas visitantes</p>
      </div>
    </div>
  )
}
