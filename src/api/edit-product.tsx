import { api } from '../lib/axios'
import { product } from './types/product'

export interface EditProductBody {
  id: string
  title: string
  categoryId: string
  description: string | null
  priceInCents: number
  attachmentsIds: (string | null)[]
}

interface EditProductResponse {
  product: product
}

export async function editProduct({
  id,
  ...body
}: EditProductBody): Promise<EditProductResponse> {
  const respose = await api.put<EditProductResponse>(`/products/${id}`, body)

  return respose.data
}
