"use client"

import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import clsx from "clsx"

type CarouselItem = {
  id: number | string
  imageUrl: string
  title?: string
}

type Props = {
  items: CarouselItem[]
}

export default function HomeCarousel({ items }: Props) {
  const autoplay = useRef(
    Autoplay({
      delay: 4500,               // más lento = más lujo
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 35,             // transición lenta
    },
    [autoplay.current]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    onSelect()
    emblaApi.on("select", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      ref={emblaRef}
    >
      <div className="flex">
        {items.map((item, index) => {
          const isActive = index === selectedIndex

          return (
            <div
              key={item.id}
              className="relative min-w-full h-44 sm:h-56"
            >
              {/* IMAGEN CON FADE */}
              <div
                className={clsx(
                  "absolute inset-0 transition-opacity duration-1200ms ease-in-out",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title || "Perfume destacado"}
                  fill
                  className="object-cover scale-[1.02]"
                  sizes="100vw"
                  priority={isActive}
                />
              </div>

              {/* OVERLAY GRADIENTE PREMIUM */}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />

              {/* TEXTO CON ANIMACIÓN SUAVE */}
              {item.title && (
                <div
                  className={clsx(
                    "absolute bottom-4 left-4 transition-all duration-1200ms ease-out",
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  )}
                >
                  <p className="text-white text-sm sm:text-base font-medium tracking-wide">
                    {item.title}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
