import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Status } from '../../../api/types/product'
import saleTagIcon from '../../../assets/icons/sale-tag.svg'
import searchIcon from '../../../assets/icons/search.svg'
import { CustomSelect } from '../../../components/customSelect'
import { InputWithIcon } from '../../../components/inputWithIcon'

const productFiltersSchema = z.object({
  search: z.string(),
  status: z.string(),
})

export type ProductFiltersSchema = z.infer<typeof productFiltersSchema>

export function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search')
  const status = searchParams.get('status')

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<ProductFiltersSchema>({
    resolver: zodResolver(productFiltersSchema),
    defaultValues: {
      search: search ?? '',
      status: status ?? '',
    },
  })

  const statusOptions = Object.entries(Status).map(([key, value]) => ({
    label: value,
    value: key,
  }))

  async function handleApplyFilter({ search, status }: ProductFiltersSchema) {
    setSearchParams((state) => {
      if (search) {
        state.set('search', search)
      } else {
        state.delete('search')
      }

      if (status) {
        state.set('status', status)
      } else {
        state.delete('status')
      }

      return state
    })
  }

  return (
    <div className="flex h-full w-full flex-col gap-6 rounded-[20px] bg-[var(--white)] p-6">
      <h3 className="title-sm text-[var(gray-300)]">Filtrar</h3>

      <form
        className="flex flex-col gap-10"
        onSubmit={handleSubmit(handleApplyFilter)}
      >
        <div className="flex flex-col gap-5">
          <InputWithIcon
            icon={searchIcon}
            id="search"
            placeholder="Pesquisar"
            {...register('search')}
          />

          <CustomSelect
            name="status"
            options={statusOptions}
            placeholder="Status"
            icon={saleTagIcon}
            control={control}
          />
        </div>

        <button
          type="submit"
          className={`action-md flex h-14 w-full items-center justify-center rounded-[.625rem] bg-[var(--orange-base)] px-4 text-[var(--white)] transition-colors duration-200
              ${isSubmitting ? 'cursor-not-allowed opacity-55' : 'hover:bg-[var(--orange-dark)]'}`}
          disabled={isSubmitting}
        >
          Aplicar filtro
        </button>
      </form>
    </div>
  )
}
