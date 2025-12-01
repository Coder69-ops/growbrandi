"use client";

import AutoScroll from "embla-carousel-auto-scroll";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface Logo {
    id: string;
    description: string;
    image: string;
    className?: string;
}

interface Logos3Props {
    heading?: string;
    logos?: Logo[];
    className?: string;
}

const Logos3 = ({
    heading = "Our Tech Stack & Integrations",
    logos = [
        {
            id: "logo-1",
            description: "React",
            image: "/logos/react.svg",
            className: "h-10 w-auto",
        },
        {
            id: "logo-2",
            description: "Next.js",
            image: "/logos/nextdotjs.svg",
            className: "h-10 w-auto",
        },
        {
            id: "logo-3",
            description: "Tailwind CSS",
            image: "/logos/tailwindcss.svg",
            className: "h-10 w-auto",
        },
        {
            id: "logo-4",
            description: "OpenAI",
            image: "/logos/openai.svg",
            className: "h-10 w-auto",
        },
        {
            id: "logo-5",
            description: "Supabase",
            image: "/logos/supabase.svg",
            className: "h-10 w-auto",
        },
        {
            id: "logo-6",
            description: "Figma",
            image: "/logos/figma.svg",
            className: "h-10 w-auto",
        },
        {
            id: "logo-7",
            description: "Vercel",
            image: "/logos/vercel.svg",
            className: "h-10 w-auto",
        },
        {
            id: "logo-8",
            description: "Stripe",
            image: "/logos/stripe.svg",
            className: "h-10 w-auto",
        },
    ],
}: Logos3Props) => {
    // Duplicate logos to ensure smooth infinite scrolling
    const repeatedLogos = [...logos, ...logos, ...logos];

    return (
        <section className="py-4 w-full">
            <div className="container flex flex-col items-center text-center mb-10">
                <h1 className="text-lg font-bold text-pretty md:text-2xl lg:text-3xl text-white/80">
                    {heading}
                </h1>
            </div>
            <div className="w-full">
                <div className="relative w-full">
                    <Carousel
                        opts={{ loop: true }}
                        plugins={[
                            AutoScroll({
                                playOnInit: true,
                                speed: 1.5,
                                stopOnInteraction: false,
                            }),
                        ]}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {repeatedLogos.map((logo, index) => (
                                <CarouselItem
                                    // Use index in key because IDs are duplicated
                                    key={`${logo.id}-${index}`}
                                    className="flex basis-1/4 justify-center pl-4 sm:basis-1/5 md:basis-1/6 lg:basis-1/8"
                                >
                                    <div className="flex shrink-0 items-center justify-center w-full">
                                        <div className="relative h-16 md:h-24 w-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                                            <img
                                                src={logo.image}
                                                alt={logo.description}
                                                width={40}
                                                height={40}
                                                className={cn(
                                                    "h-10 md:h-14 lg:h-16 w-auto object-contain",
                                                    logo.className
                                                )}
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

export { Logos3 };
