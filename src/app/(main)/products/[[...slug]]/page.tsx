import ProductDetail from "@/src/features/products/components/ProductDetail";
import Products from "@/src/features/products/components/Products";
import { getProduct as getProductById } from "@/src/features/products/services/getProducts";
import { getProduct } from "@/src/services/getProduct";
import { allCategoryes } from "@/src/services/categoryes";
import { getBrands } from "@/src/services/getBrands";
import { pageMeta } from "@/src/lib/seo";
import { siteConfig } from "@/src/lib/site";
import { mediaUrl } from "@/src/lib/format";
import { withProductPagination } from "@/src/lib/productsQuery";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Category } from "@/src/features/categories/types/categoryes";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<
    Record<string, string | string[] | undefined>
  >;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return pageMeta(
      "Mahsulotlar",
      "Bizda katalogi: smartfon, noutbuk, audio va boshqa texnika.",
      "/products",
    );
  }

  if (slug.length === 1) {
    const categories = await allCategoryes();
    const category = (categories as Category[]).find((item) => item.slug === slug[0]);
    const name = category?.name || slug[0];
    return pageMeta(
      name,
      category?.description || `${name} kategoriyasidagi mahsulotlar — Bizda.`,
      `/products/${slug[0]}`,
    );
  }

  const product = await getProductById(slug[1]);
  if (!product) {
    return pageMeta("Mahsulot topilmadi", siteConfig.description, "/products");
  }

  const image =
    product.images?.find((item: { isMain?: boolean }) => item.isMain)?.url ||
    product.images?.[0]?.url;
  const description =
    product.shortDescription || product.description || `${product.name} — Bizda do‘konida.`;
  const meta = pageMeta(product.name, description, `/products/${slug[0]}/${slug[1]}`);

  if (image) {
    const url = mediaUrl(image);
    meta.openGraph = {
      ...meta.openGraph,
      type: "website",
      images: [{ url, width: 800, height: 800, alt: product.name }],
    };
    meta.twitter = { ...meta.twitter, images: [url] };
  }

  return meta;
}

export default async function Page({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const searchParam = await searchParams;
  const query = withProductPagination(searchParam);
  const queryString = query.toString();

  const sort = query.get("sort");
  const heading =
    sort === "top"
      ? "Top mahsulotlar"
      : sort === "best-selling"
        ? "Ko'p sotilganlar"
        : "";

  if (!slug || slug.length === 0) {
    const { data, meta } = await getProduct(queryString);
    let title = heading || "Mahsulotlar";
    const brandSlug = query.get("brand");
    if (!heading && brandSlug) {
      const brands = await getBrands();
      const brand = brands.find((item: { slug: string; name: string }) => item.slug === brandSlug);
      title = brand?.name || brandSlug;
    }
    return <Products slug={title} data={data} meta={meta} />;
  }

  if (slug.length === 1) {
    const category = `category=${encodeURIComponent(slug[0])}`;
    const { data, meta } = await getProduct(`${category}&${queryString}`);
    return <Products slug={heading || slug[0]} data={data} meta={meta} />;
  }

  if (slug.length === 2) {
    return <ProductDetail id={slug[1]} />;
  }

  return notFound();
}