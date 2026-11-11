import { redirect } from 'next/navigation'
import { pageMeta } from '@/src/lib/seo'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const name = slug.replace(/-/g, " ")
  return pageMeta(name, `${name} kategoriyasidagi mahsulotlar — Bizda.`, `/categories/${slug}`)
}

export default async function CategoriDetail({ params }: Props) {
  const { slug } = await params
  redirect(`/products/${slug}`)
}
