import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { changeProductStatus } from '../../../api/change-product-status'
import { editProduct } from '../../../api/edit-product'
import {
  getProductById,
  GetProductByIdResponse,
} from '../../../api/get-product-by-id'
import { getProductCategories } from '../../../api/get-product-categories'
import { Status } from '../../../api/types/product'
import { uploadAttachments } from '../../../api/upload-attachments'
import arrowLeftOrangeIcon from '../../../assets/icons/arrow-left-orange.svg'
import realCurrencyIcon from '../../../assets/icons/real-currency-orange.svg'
import tickIcon from '../../../assets/icons/tick.svg'
import unavailableIcon from '../../../assets/icons/unavailable.svg'
import { CustomSelect } from '../../../components/customSelect'
import { CustomTextarea } from '../../../components/customTextarea'
import { ImageUpload } from '../../../components/imageUpload'
import { InputWithIcon } from '../../../components/inputWithIcon'
import { Label } from '../../../components/label'
import { Tag } from './tag'

const editProductForm = z.object({
  image: z.custom<FileList>(),
  title: z.string(),
  price: z.string(),
  description: z.string(),
  category: z.string(),
})

export type EditProductForm = z.infer<typeof editProductForm>

export function EditProduct() {
  const { id } = useParams() as { id: string }

  const queryClient = useQueryClient()

  const { data: { product } = {} } = useQuery({
    queryKey: ['get-product-by-id', id],
    queryFn: () => getProductById({ id }),
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<EditProductForm>({
    values: {
      image: undefined,
      title: product?.title ?? '',
      price: product?.priceInCents ? centsToPrice(product?.priceInCents) : '',
      description: product?.description ?? '',
      category: product?.category.id ?? '',
    },
  })

  function priceToCents(price: string): number {
    const formattedPrice = price.replace(/\./g, '').replace(',', '.')

    return parseFloat(formattedPrice) * 100
  }

  function centsToPrice(cents: number): string {
    return (cents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
    })
  }

  const { mutateAsync: uploadImage } = useMutation({
    mutationFn: uploadAttachments,
  })

  const { mutateAsync: editProductFn } = useMutation({
    mutationFn: editProduct,
  })

  const {
    mutateAsync: changeProductStatusFn,
    isPending: isChangindProductStatus,
  } = useMutation({
    mutationFn: changeProductStatus,
    onSuccess(_, { id, status }) {
      const cached = queryClient.getQueryData<GetProductByIdResponse>([
        'get-product-by-id',
        id,
      ])

      if (cached) {
        queryClient.setQueryData<GetProductByIdResponse>(
          ['get-product-by-id', id],
          {
            product: { ...cached.product, status },
          },
        )
      }
    },
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: getProductCategories,
  })

  const categoriesToSelect = categories?.map((category) => ({
    label: category.title,
    value: category.id,
  }))

  async function handleChangeProductStatus(status: keyof typeof Status) {
    try {
      await changeProductStatusFn({ id, status })

      toast.success(`Status do produto alterado com sucesso!`)
    } catch (error) {
      toast.error('Erro ao alterar o status do produto.')
    }
  }

  async function handleEditProduct(data: EditProductForm) {
    try {
      let attachmentId = product?.attachments[0]?.id
      const hasNewImage = data.image?.length

      if (hasNewImage) {
        const files = new FormData()
        files.append('files', data.image[0])

        const uploadedImage = await uploadImage({ files })
        attachmentId = uploadedImage?.attachments[0]?.id
      }

      if (!attachmentId) {
        throw new Error()
      }

      await editProductFn({
        id,
        title: data.title,
        categoryId: data.category,
        description: data.description,
        priceInCents: priceToCents(data.price),
        attachmentsIds: [attachmentId],
      })

      toast.success('Produto editado com sucesso!')
    } catch (error) {
      toast.error('Erro ao editar.')
    }
  }

  return (
    <>
      <Helmet title="Edição de Produto" />

      <div className="mb-10 mt-8 flex">
        <div className="flex flex-col gap-2">
          <Link
            to="/products"
            className="action-md flex items-center gap-2 p-0.5 text-[var(--orange-base)] hover:text-[var(--orange-dark)]"
          >
            <img
              src={arrowLeftOrangeIcon}
              className="h-5 w-5"
              alt="Ícone de seta para a esquerda"
            />
            Voltar
          </Link>

          <h2 className="title-md text-[var(--gray-500)]">Editar produto</h2>

          <p className="body-sm text-[var(--gray-300)]">
            Gerencie as informações do produto cadastrado
          </p>
        </div>

        <div className="action-sm ml-auto flex items-end gap-4 pr-3 text-[var(--orange-base)]">
          {product?.status === 'available' ? (
            <>
              <button
                className={`flex items-end gap-2 p-0.5 
                  ${
                    isChangindProductStatus
                      ? 'opacity-55'
                      : 'hover:text-[var(--orange-dark)]'
                  }`}
                disabled={isChangindProductStatus}
                onClick={() => handleChangeProductStatus('sold')}
              >
                <img
                  src={tickIcon}
                  className="h-5 w-5"
                  alt="Íconde de ticado"
                />
                Marcar como vendido
              </button>

              <button
                className={`flex items-end gap-2 p-0.5 
                  ${
                    isChangindProductStatus
                      ? 'opacity-55'
                      : 'hover:text-[var(--orange-dark)]'
                  }`}
                disabled={isChangindProductStatus}
                onClick={() => handleChangeProductStatus('cancelled')}
              >
                <img
                  src={unavailableIcon}
                  className="h-5 w-5"
                  alt="Íconde de indisponível"
                />
                Desativar anúncio
              </button>
            </>
          ) : product?.status === 'sold' ? (
            <>
              <button
                className={`flex items-end gap-2 p-0.5 
                  ${
                    isChangindProductStatus
                      ? 'opacity-55'
                      : 'hover:text-[var(--orange-dark)]'
                  }`}
                disabled={isChangindProductStatus}
                onClick={() => handleChangeProductStatus('available')}
              >
                <img
                  src={tickIcon}
                  className="h-5 w-5"
                  alt="Íconde de ticado"
                />
                Marcar como disponível
              </button>

              <button
                className="flex items-end gap-2 p-0.5 opacity-55"
                disabled
              >
                <img
                  src={unavailableIcon}
                  className="h-5 w-5"
                  alt="Íconde de indisponível"
                />
                Produto vendiddo
              </button>
            </>
          ) : product?.status === 'cancelled' ? (
            <>
              <button
                className={`flex items-end gap-2 p-0.5 
                  ${
                    isChangindProductStatus
                      ? 'opacity-55'
                      : 'hover:text-[var(--orange-dark)]'
                  }`}
                disabled={isChangindProductStatus}
                onClick={() => handleChangeProductStatus('available')}
              >
                <img
                  src={tickIcon}
                  className="h-5 w-5"
                  alt="Íconde de ticado"
                />
                Reativar produto
              </button>

              <button
                className="flex items-end gap-2 p-0.5 opacity-55"
                disabled
              >
                <img
                  src={unavailableIcon}
                  className="h-5 w-5"
                  alt="Íconde de indisponível"
                />
                Produto desabilitado
              </button>
            </>
          ) : (
            ''
          )}
        </div>
      </div>

      {product && (
        <form className="flex gap-6" onSubmit={handleSubmit(handleEditProduct)}>
          <div className="h-[340px] w-[415px]">
            <ImageUpload
              id="image"
              accept=".png"
              placeholder="Selecione a imagem do produto"
              previewURL={product.attachments[0]?.url}
              disabled={['sold', 'cancelled'].includes(product.status)}
              register={register('image')}
            />
          </div>

          <div className="flex w-[591px] flex-col gap-6 rounded-[20px] bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="title-sm text-[var(--gray-300)]">
                Dados do produto
              </p>

              <Tag bgColor="var(--blue-dark)" textColor="var(--white)">
                {Status[product.status]}
              </Tag>
            </div>

            <div className="flex flex-col gap-10">
              <div
                className={`flex flex-col gap-5
                ${['sold', 'cancelled'].includes(product.status) && 'opacity-55'}`}
              >
                <div className="flex gap-5">
                  <div className="w-[323px]">
                    <Label htmlFor="title">Título</Label>
                    <InputWithIcon
                      id="title"
                      placeholder="Nome do produto"
                      disabled={['sold', 'cancelled'].includes(product.status)}
                      {...register('title')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Valor</Label>
                    <InputWithIcon
                      icon={realCurrencyIcon}
                      id="price"
                      placeholder="0,00"
                      disabled={['sold', 'cancelled'].includes(product.status)}
                      {...register('price')}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <CustomTextarea
                    id="description"
                    rows={4}
                    placeholder="Escreva detalhes sobre o produto, tamanho e características"
                    disabled={['sold', 'cancelled'].includes(product.status)}
                    register={register('description')}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <CustomSelect
                    name="category"
                    options={categoriesToSelect}
                    placeholder="Selecione"
                    disabled={['sold', 'cancelled'].includes(product.status)}
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
                    ${
                      isSubmitting ||
                      ['sold', 'cancelled'].includes(product.status)
                        ? 'cursor-not-allowed opacity-55'
                        : 'hover:bg-[var(--orange-dark)]'
                    }
                `}
                  disabled={
                    isSubmitting ||
                    ['sold', 'cancelled'].includes(product.status)
                  }
                >
                  Salvar e atualizar
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  )
}
