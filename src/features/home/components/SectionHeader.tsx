import Link from "next/link";
import { ArrowRight } from "lucide-react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  /** "Barchasi" tugmasi yo'nalishi — berilmasa tugma chiqmaydi */
  href?: string;
};

export default function SectionHeader({
  title,
  subtitle,
  href,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          {/* Brend rangidagi vertikal aksent chizig'i */}
          <span className="h-9 w-1.5 rounded-full bg-gradient-to-b from-[#4caf7d] to-[#2e7d54] shadow-sm shadow-[#4caf7d]/30" />
          {href ? (
            <Link href={href} className="transition hover:text-[#2f8a58]">
              <h2 className="text-[26px] font-extrabold tracking-tight text-gray-900 sm:text-[30px]">
                {title}
              </h2>
            </Link>
          ) : (
            <h2 className="text-[26px] font-extrabold tracking-tight text-gray-900 sm:text-[30px]">
              {title}
            </h2>
          )}
        </div>
        {subtitle && (
          <p className="mt-2 pl-[18px] text-sm text-gray-500">{subtitle}</p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1.5 rounded-full border border-[#4caf7d]/25 bg-[#edf8ee] px-5 py-2.5 text-sm font-semibold text-[#399765] transition-all duration-300 hover:border-[#4caf7d] hover:bg-[#4caf7d] hover:text-white hover:shadow-lg hover:shadow-[#4caf7d]/25"
        >
          Barchasi
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
