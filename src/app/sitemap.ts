import type { MetadataRoute } from "next";
import { allCategoryes } from "@/src/services/categoryes";
import { getAllProducts } from "@/src/features/products/services/getProducts";
import { absoluteUrl } from "@/src/lib/site";
import type { Category } from "@/src/features/categories/types/categoryes";
import type { Product } from "@/src/features/products/types/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([allCategoryes(), getAllProducts()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/about",
    "/contact",
    "/categories",
  ].map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = (categories as Category[]).map((category) => ({
    url: absoluteUrl(`/products/${category.slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = (products as Product[]).map((product) => ({
    url: absoluteUrl(`/products/${product.category?.slug || "item"}/${product.id}`),
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
