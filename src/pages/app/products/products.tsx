import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'

import { getSellerProducts } from '../../../api/get-seller-products'
import { ProductCard } from './productCard'
import { ProductFilters } from './productFilters'

export function Products() {
  const [searchParams] = useSearchParams()

  const search = searchParams.get('search')
  const status = searchParams.get('status')

  const { data: products } = useQuery({
    queryKey: ['seller-products', search, status],
    queryFn: () => getSellerProducts({ search, status }),
  })

  return (
    <>
      <Helmet title="Produtos" />

      <div className="mb-10 mt-16 flex flex-col gap-2">
        <h2 className="title-md text-[var(--gray-500)]">Seus produtos</h2>

        <p className="body-sm text-[var(--gray-300)]">
          Acesse gerencie a sua lista de produtos à venda
        </p>
      </div>

      <div className="flex gap-6">
        <div className="h-[306px] w-[327px]">
          <ProductFilters />
        </div>

        <div className="flex w-[679px] flex-wrap gap-4">
          {products?.map((product) => {
            return (
              <Link to={`/products/edit/${product.id}`} key={product.id}>
                <ProductCard {...product} />
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
