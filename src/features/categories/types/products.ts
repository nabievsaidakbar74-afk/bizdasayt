
export type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isMain: boolean;
};

export type ProductType = {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  discountPercent: number;
  isNew: boolean;
  stock: number;
  availableStock: number;
  brand?: {
    name: string;
    logo?: string | null;
  } | null;
  category?: {
    name: string;
    slug?:string
  } | null;
  images: ProductImage[];
  averageRating: number;
  reviewsCount: number;
  inWishlist?: boolean;
  variants?: { id: string }[];
};
