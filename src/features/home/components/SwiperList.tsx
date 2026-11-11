"use client";

import Image from "next/image";
import Link from "next/link";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Banner = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  link?: string;
};

function prettyTitle(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b[\p{L}\p{N}]+/gu, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

function prettyButton(value?: string) {
  const text = (value || "").trim();
  const key = text.toLowerCase();
  if (!key || key === "shop now" || key === "shop nows" || key === "wooow") {
    return "Xarid qilish";
  }
  return text;
}

function bannerCopy(item: Banner) {
  const title = prettyTitle(item.title || "");
  const raw = (item.subtitle || "").trim();
  const percentMatch = raw.match(/(\d+)\s*%/);
  const onlyNumber = raw.match(/^(\d+)$/);
  const discount = Number(percentMatch?.[1] || onlyNumber?.[1] || 0);
  const isOnlyDiscount = Boolean(onlyNumber || /^\d+\s*%$/.test(raw));
  const subtitle = !raw || isOnlyDiscount ? "" : raw;

  return {
    title,
    subtitle,
    discount: discount > 0 ? discount : 0,
    buttonText: prettyButton(item.buttonText),
    href: item.link || "/products",
  };
}

export default function SwiperList({ data }: { data: Banner[] }) {
  const slides = Array.isArray(data) ? data : [];

  return (
    <section className="mx-auto w-full max-w-310 px-4">
      <div className="relative">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          navigation={{
            prevEl: ".hero-prev",
            nextEl: ".hero-next",
          }}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={slides.length > 1}
          observer
          observeParents
          watchOverflow
          className="hero-swiper h-64 w-full overflow-hidden rounded-3xl sm:h-80 lg:h-100"
        >
          {slides.map((item) => {
            const copy = bannerCopy(item);
            return (
              <SwiperSlide key={item.id}>
                <div className="relative h-full w-full">
                  <Image
                    src={item.image}
                    alt={copy.title}
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-xl px-6 pb-14 text-white sm:px-12 lg:px-16">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white ring-1 ring-white/25 backdrop-blur-sm">
                          Maxsus taklif
                        </span>
                        {copy.discount ? (
                          <span className="inline-flex rounded-full bg-[#4caf7d] px-3 py-1 text-xs font-extrabold text-white shadow-lg shadow-black/20">
                            -{copy.discount}%
                          </span>
                        ) : null}
                      </div>
                      <h2 className="max-w-lg text-2xl font-extrabold leading-tight tracking-tight drop-shadow-md sm:text-4xl lg:text-[42px]">
                        {copy.title}
                      </h2>
                      {copy.subtitle ? (
                        <p className="mt-3 max-w-md text-sm leading-6 text-white/85 sm:text-base">
                          {copy.subtitle}
                        </p>
                      ) : null}
                      <Link
                        href={copy.href}
                        className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#4caf7d] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#3d9c6c]"
                      >
                        {copy.buttonText}
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <button
          type="button"
          aria-label="Oldingi banner"
          className="hero-prev absolute bottom-5 left-5 z-10 hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md backdrop-blur-sm transition hover:bg-[#4caf7d] hover:text-white sm:flex"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          aria-label="Keyingi banner"
          className="hero-next absolute bottom-5 right-5 z-10 hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md backdrop-blur-sm transition hover:bg-[#4caf7d] hover:text-white sm:flex"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
