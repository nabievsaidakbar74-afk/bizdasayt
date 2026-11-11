"use client";

import React, { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function LimitedTimeDeal() {
    const scrollRef:any = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const totalCards = 7; // Kartalarning jami soni
    const cardsPerView = 4; // Ekranda ko'rinadigan kartalar soni
    const totalDots = Math.ceil(totalCards / cardsPerView);

    // Scroll qilinganda qaysi nuqta faol ekanligini aniqlash
    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const maxScroll = scrollWidth - clientWidth;
            if (maxScroll <= 0) return;
            const currentProgress = scrollLeft / maxScroll;
            const newIndex = Math.round(currentProgress * (totalDots - 1));
            setActiveIndex(newIndex);
        }
    };
    // Nuqtani bosganda o'sha qismga o'tish
    const scrollToPage = (index:any) => {
        if (scrollRef.current) {
            const { scrollWidth, clientWidth } = scrollRef.current;
            const maxScroll = scrollWidth - clientWidth;
            const targetScroll = (maxScroll / (totalDots - 1)) * index;
            scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
    };
    // Chap va o'ng tugmalar bosilganda surish
    const scrollByDirection = (direction:any) => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.75; // Bir martada qancha surilishi
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className='max-w-310 w-full mx-auto flex flex-col justify-center gap-8 pb-25'>
            {/* Sarlavha, Chap/O'ng tugmalar va View All */}
            <div className='flex items-center justify-between px-4'>
                <p className='font-bold text-[32px]'>Limited-Time Deal</p>

                <div className='flex items-center gap-4'>
                    {/* Chap va O'ngga surish tugmalari */}


                    <button className='border border-black rounded-[200px] px-6 py-3 cursor-pointer hover:bg-black hover:text-white transition-all duration-300'>
                        View All
                    </button>
                </div>
            </div>

            {/* Scroll bo'ladigan kartalar */}
            <div className='px-4'>

                <div className='flex gap-2 items-center justify-center'>
                    <button
                        onClick={() => scrollByDirection('left')}
                        className='border border-black rounded-full p-3 hover:bg-black hover:text-white transition-all cursor-pointer'
                    >
                        <FaChevronLeft size={16} />
                    </button>

                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className='flex items-center gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4'
                    >
                        {[...Array(totalCards)].map((_, i) => (
                            <div key={i} className='bg-[#ccc] rounded-2xl w-68 h-100 shrink-0'></div>
                        ))}
                    </div>

                    <button
                        onClick={() => scrollByDirection('right')}
                        className='border border-black rounded-full p-3 hover:bg-black hover:text-white transition-all cursor-pointer'
                    >
                        <FaChevronRight size={16} />
                    </button>
                </div>

                {/* Pastdagi nuqtali indikatorlar */}



                <div className='flex items-center justify-center gap-1.5'>
                    {[...Array(totalDots)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToPage(index)}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === index
                                ? 'w-8 bg-black'
                                : 'w-2 bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>





            </div>
        </div>
    );
}