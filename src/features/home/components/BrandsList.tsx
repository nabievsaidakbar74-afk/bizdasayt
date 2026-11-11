
import Image from "next/image";
import Link from "next/link";

type Brand = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  _count?: {
    products: number;
  };
};

type BrandsListProps = {
  brands: Brand[];
};

export default function BrandsList({ brands }: BrandsListProps) {
  if (!brands?.length) {
    return (
      <div className="py-10 text-center text-gray-500">
        Brendlar mavjud emas
      </div>
    );
  }

  
return (
  <div className="flex gap-5 overflow-x-auto scrollbar-hide">
    {brands.map((brand) => (
      <Link
        key={brand.id}
        href={`/products?brand=${encodeURIComponent(brand.slug)}&page=1&limit=20`}
        className="group flex w-36 shrink-0 flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 transition duration-300 hover:-translate-y-1  hover:shadow-sm"
      >
        <div className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-3">
          {brand.logo ? (
            <Image
              src={brand.logo}
              alt={`${brand.name} logotipi`}
              fill
              unoptimized
              sizes="144px"
              className="object-contain p-3 transition duration-300 group-hover:scale-110"
            />
          ) : (
            <span className="text-3xl font-bold text-gray-300">
              {brand.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <h3 className="mt-3 line-clamp-1 text-center text-sm font-semibold text-gray-800 group-hover:text-[#399765]">
          {brand.name}
        </h3>
      </Link>
    ))}
  </div>
);

}
