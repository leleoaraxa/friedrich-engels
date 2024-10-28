import { useQuery } from '@tanstack/react-query'

import { getSoldProductsInLast30Days } from '../../../api/get-sold-products-in-last-30-days'
import saleTagBlueIcon from '../../../assets//icons/sale-tag-blue.svg'

export function SoldProductsInLast30Days() {
  const { data: soldProducts } = useQuery({
    queryKey: ['metrics', 'sold-products-in-last-30-days'],
    queryFn: getSoldProductsInLast30Days,
  })

  return (
    <div className="flex gap-4 rounded-[20px] bg-[var(--white)] pl-3 pr-7">
      <div className="my-3 flex h-[86px] w-20 items-center justify-center rounded-xl bg-[var(--blue-light)]">
        <img
          src={saleTagBlueIcon}
          className="h-10 w-10"
          alt="Ícone de tag de venda"
        />
      </div>

      <div className="flex flex-col justify-between py-5">
        <h1 className="title-lg text-[var(--gray-400)]">
          {soldProducts?.amount}
        </h1>
        <p className="body-xs text-[var(--gray-300)]">Produtos vendidos</p>
      </div>
    </div>
  )
}
