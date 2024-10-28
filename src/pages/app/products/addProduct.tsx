import { useMutation, useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { createProduct } from '../../../api/create-product'
import { getProductCategories } from '../../../api/get-product-categories'
import { uploadAttachments } from '../../../api/upload-attachments'
import realCurrencyIcon from '../../../assets/icons/real-currency-orange.svg'
import { CustomSelect } from '../../../components/customSelect'
import { CustomTextarea } from '../../../components/customTextarea'
import { ImageUpload } from '../../../components/imageUpload'
import { InputWithIcon } from '../../../components/inputWithIcon'
import { Label } from '../../../components/label'

const addProductForm = z.object({
  image: z.custom<FileList>(),
  title: z.string(),
  price: z.string(),
  description: z.string(),
  category: z.string(),
})

export type AddProductForm = z.infer<typeof addProductForm>

export function AddProduct() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<AddProductForm>({
    defaultValues: {
      category: '',
    },
  })

  function priceToCents(price: string): number {
    const formattedPrice = price.replace(/\./g, '').replace(',', '.')

    return parseFloat(formattedPrice) * 100
  }

  const { mutateAsync: uploadImage } = useMutation({
    mutationFn: uploadAttachments,
  })

  const { mutateAsync: addProduct } = useMutation({
    mutationFn: createProduct,
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: getProductCategories,
  })

  const categoriesToSelect = categories?.map((category) => ({
    label: category.title,
    value: category.id,
  }))

  async function handleAddProduct(data: AddProductForm) {
    try {
      const hasImage = data.image?.length

      if (!hasImage) {
        throw new Error()
      }

      const files = new FormData()
      files.append('files', data.image[0])

      const uploadedImage = await uploadImage({ files })
      const attachmentId = uploadedImage?.attachments[0]?.id

      const response = await addProduct({
        title: data.title,
        categoryId: data.category,
        description: data.description,
        priceInCents: priceToCents(data.price),
        attachmentsIds: [attachmentId],
      })

      toast.success('Cadastro realizado com sucesso!', {
        action: {
          label: 'Ver produto',
          onClick: () => navigate(`/products/edit/${response.product.id}`),
        },
      })
    } catch (error) {
      toast.error('Erro ao cadastrar.')
    }
  }

  return (
    <>
      <Helmet title="Cadastro de Produto" />

      <div className="mb-10 mt-16 flex flex-col gap-2">
        <h2 className="title-md text-[var(--gray-500)]">Novo produto</h2>

        <p className="body-sm text-[var(--gray-300)]">
          Cadastre um produto para venda no Marketplace
        </p>
      </div>

      <form className="flex gap-6" onSubmit={handleSubmit(handleAddProduct)}>
        <div className="h-[340px] w-[415px]">
          <ImageUpload
            id="image"
            accept=".png"
            register={register('image')}
            placeholder="Selecione a imagem do produto"
          />
        </div>

        <div className="flex w-[591px] flex-col gap-6 rounded-[20px] bg-white p-6">
          <p className="title-sm text-[var(--gray-300)]">Dados do produto</p>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-5">
              <div className="flex gap-5">
                <div className="w-[323px]">
                  <Label htmlFor="title">Título</Label>
                  <InputWithIcon
                    id="title"
                    placeholder="Nome do produto"
                    {...register('title')}
                  />
                </div>

                <div>
                  <Label htmlFor="price">Valor</Label>
                  <InputWithIcon
                    icon={realCurrencyIcon}
                    id="price"
                    placeholder="0,00"
                    {...register('price')}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <CustomTextarea
                  rows={4}
                  placeholder="Escreva detalhes sobre o produto, tamanho e características"
                  register={register('description')}
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <CustomSelect
                  name="category"
                  options={categoriesToSelect}
                  placeholder="Selecione"
                  control={control}
                />
              </div>
            </div>

            <div className="flex h-12 gap-3">
              <Link to="/products" className="flex h-full w-full">
                <button
                  className={`action-md flex w-full items-center justify-center rounded-[.625rem] border border-[var(--orange-base)] bg-white px-4 text-[var(--orange-base)] transition-colors duration-200 
                    ${isSubmitting ? 'cursor-not-allowed opacity-55' : 'hover:border-[var(--orange-dark)] hover:text-[var(--orange-dark)]'}
                    `}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
              </Link>

              <button
                type="submit"
                className={`action-md flex h-full w-full items-center justify-center rounded-[.625rem] bg-[var(--orange-base)] px-4 text-[var(--white)] transition-colors duration-200
                    ${isSubmitting ? 'cursor-not-allowed opacity-55' : 'hover:bg-[var(--orange-dark)]'}
                `}
                disabled={isSubmitting}
              >
                Salvar e publicar
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
