
export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string;
  sortOrder: number;
  isMain: boolean;
  createdAt: string;
}

export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  [key: string]: unknown;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  barcode: string;
  price: number;
  oldPrice: number | null;
  discountPercent: number;
  stock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  brandId: string;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isPopular: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;

  brand: ProductBrand;
  category: ProductCategory;
  images: ProductImage[];
  variants: ProductVariant[];

  averageRating: number;
  reviewsCount: number;
}
