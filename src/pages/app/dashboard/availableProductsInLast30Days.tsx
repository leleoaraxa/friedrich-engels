import { useQuery } from '@tanstack/react-query'

import { getAvailableProductsInLast30Days } from '../../../api/get-available-products-in-last-30-days'
import storeIcon from '../../../assets//icons/store.svg'

export function AvailableProductsInLast30Days() {
  const { data: availableProducts } = useQuery({
    queryKey: ['metrics', 'available-roducts-in-last-30-days'],
    queryFn: getAvailableProductsInLast30Days,
  })

  return (
    <div className="flex gap-4 rounded-[20px] bg-[var(--white)] pl-3 pr-7">
      <div className="my-3 flex h-[86px] w-20 items-center justify-center rounded-xl bg-[var(--blue-light)]">
        <img src={storeIcon} className="h-10 w-10" alt="Ícone de uma loja" />
      </div>

      <div className="flex flex-col justify-between py-5">
        <h1 className="title-lg text-[var(--gray-400)]">
          {availableProducts?.amount}
        </h1>
        <p className="body-xs text-[var(--gray-300)]">Produtos anunciados</p>
      </div>
    </div>
  )
}
