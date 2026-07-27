"use client"

import React, { useState, useRef } from "react"
import { Battery, ShieldCheck, Zap, Award, ChevronLeft, ChevronRight, X } from "lucide-react"

export interface BatteryBrand {
  name: string
  tagline: string
  country: string
  logo: React.ReactNode
  description?: string
  warranty?: string
}

const batteryBrandsData: BatteryBrand[] = [
  {
    name: "Amaron",
    tagline: "Lasts Long. Really Long.",
    country: "Silver-X Tech",
    warranty: "Official Manufacturer Warranty",
    description: "High-durability maintenance-free batteries with patented Silver-X alloy technology.",
    logo: (
      <svg className="h-8 sm:h-10 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="10" width="150" height="30" fill="#84CC16" rx="2" />
        <text x="16" y="31" fontFamily="var(--font-sans), sans-serif" fontWeight="900" fontSize="18" fill="#1E3A1E" letterSpacing="0.5">AMARON</text>
        <text x="16" y="37" fontFamily="var(--font-sans), sans-serif" fontWeight="700" fontSize="4" fill="#1E3A1E" opacity="0.8" letterSpacing="0.2">LASTS LONG. REALLY LONG.</text>
      </svg>
    )
  },
  {
    name: "ACDelco",
    tagline: "GM OEM Specification",
    country: "USA General Motors",
    warranty: "Official Manufacturer Warranty",
    description: "Official OEM specification batteries built to rigorous General Motors quality standards.",
    logo: (
      <svg className="h-8 sm:h-10 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="skewX(-10)">
          <text x="15" y="36" fontFamily="var(--font-sans), sans-serif" fontWeight="900" fontSize="32" fill="#E11D48">AC</text>
          <text x="62" y="36" fontFamily="var(--font-sans), sans-serif" fontWeight="900" fontSize="26" fill="#1E3A8A" letterSpacing="-0.5">Delco</text>
        </g>
      </svg>
    )
  },
  {
    name: "Bosch",
    tagline: "German Power & Precision",
    country: "Germany OEM",
    warranty: "Official Manufacturer Warranty",
    description: "Precision-engineered German batteries providing reliable cold cranking power in severe temperatures.",
    logo: (
      <svg className="h-8 sm:h-10 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="25" r="11" stroke="#94A3B8" strokeWidth="2.5" fill="none" />
        <circle cx="20" cy="25" r="5" fill="#94A3B8" />
        <path d="M20 10 V40 M5 25 H35" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" />
        <text x="42" y="34" fontFamily="var(--font-sans), sans-serif" fontWeight="900" fontSize="24" fill="#E11D48" letterSpacing="0.5">BOSCH</text>
      </svg>
    )
  },
  {
    name: "Varta",
    tagline: "European Luxury Fitting",
    country: "Germany Clarios",
    warranty: "Official Manufacturer Warranty",
    description: "Preferred choice for European luxury vehicles including BMW, Audi, Mercedes, and Porsche.",
    logo: (
      <svg className="h-8 sm:h-10 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 14 L24 14 L20 34 L16 34 Z" fill="#1E40AF" />
        <path d="M15 17 L21 17 L19 27 L17 27 Z" fill="#FBBF24" />
        <text x="32" y="33" fontFamily="var(--font-sans), sans-serif" fontWeight="900" fontSize="22" fill="#1E40AF" letterSpacing="1">VARTA</text>
      </svg>
    )
  },
  {
    name: "Super Gold X",
    tagline: "Extreme Tropical Spec",
    country: "Asian Heavy Duty",
    warranty: "Official Manufacturer Warranty",
    description: "Heavy-duty tropical spec batteries tailored for intense heat resistance and heavy electric loads.",
    logo: (
      <svg className="h-8 sm:h-10 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="156" height="46" rx="4" fill="#0A4E9B" />
        <path d="M10 12 Q17 10 24 12 L24 24 C24 31 17 38 17 38 C17 38 10 31 10 24 Z" fill="url(#goldGradBrand)" stroke="#FBBF24" strokeWidth="1" />
        <g fill="#FBBF24">
          <circle cx="13" cy="15" r="0.6" />
          <circle cx="15" cy="14.5" r="0.7" />
          <circle cx="17" cy="14" r="0.9" />
          <circle cx="19" cy="14.5" r="0.7" />
          <circle cx="21" cy="15" r="0.6" />
          <text x="11.5" y="21" fontFamily="sans-serif" fontWeight="900" fontSize="2.5" fill="#FFFFFF">SUPER</text>
          <text x="12" y="25" fontFamily="sans-serif" fontWeight="900" fontSize="2.5" fill="#FFFFFF">GOLD</text>
        </g>
        <g transform="skewX(-10)">
          <text x="32" y="22" fontFamily="var(--font-sans), sans-serif" fontWeight="900" fontSize="15" fill="#FFFFFF" letterSpacing="0.2">SUPER</text>
          <text x="38" y="38" fontFamily="var(--font-sans), sans-serif" fontWeight="900" fontSize="15" fill="#FFFFFF" letterSpacing="0.2">GOLD</text>
          <text x="88" y="38" fontFamily="var(--font-sans), sans-serif" fontWeight="900" fontSize="20" fill="#92400E">X</text>
          <text x="88" y="38" fontFamily="var(--font-sans), sans-serif" fontWeight="900" fontSize="20" fill="#FBBF24" opacity="0.85">X</text>
        </g>
        <defs>
          <linearGradient id="goldGradBrand" x1="10" y1="12" x2="24" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#451A03" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    name: "Sebang Rocket",
    tagline: "Hyundai & Kia Factory Fitted",
    country: "Korea OEM",
    warranty: "Official Manufacturer Warranty",
    description: "Korea's leading battery manufacturer, original factory equipment for Hyundai and Kia vehicles.",
    logo: (
      <svg className="h-8 sm:h-10 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="skewX(-10)">
          <text x="18" y="36" fontFamily="var(--font-sans), sans-serif" fontWeight="900" fontSize="32" fill="#E11D48" letterSpacing="-1">SB</text>
          <text x="62" y="36" fontFamily="var(--font-sans), sans-serif" fontWeight="900" fontSize="32" fill="#1E3A8A" letterSpacing="-1">K</text>
        </g>
        <circle cx="88" cy="18" r="2" stroke="#1E3A8A" strokeWidth="0.5" fill="none" />
        <text x="87" y="19.5" fontFamily="sans-serif" fontSize="2" fill="#1E3A8A">R</text>
      </svg>
    )
  },
  {
    name: "Exide",
    tagline: "Fast Recharging Carbon Boost",
    country: "USA / Europe Tech",
    warranty: "Official Manufacturer Warranty",
    description: "Advanced Carbon Boost 2.0 technology for up to 2x faster recharging and superior energy output.",
    logo: (
      <svg className="h-8 sm:h-10 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="skewX(-5)">
          <text x="10" y="32" fontFamily="var(--font-sans), sans-serif" fontWeight="900" fontSize="28" fill="#0F52BA" letterSpacing="-0.5">EXIDE</text>
          <path d="M11 22 H17 M14 19 V25" stroke="#0F52BA" strokeWidth="2.5" />
          <text x="14" y="42" fontFamily="var(--font-sans), sans-serif" fontWeight="800" fontSize="7" fill="#0F52BA" letterSpacing="4">BATTERIES</text>
        </g>
      </svg>
    )
  },
  {
    name: "Chloride",
    tagline: "Heavy Industrial & 4x4",
    country: "Commercial Grade",
    warranty: "Official Manufacturer Warranty",
    description: "Rugged commercial-grade construction designed for heavy 4x4 off-roading and commercial fleets.",
    logo: (
      <svg className="h-8 sm:h-10 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="10" width="150" height="30" fill="#E11D48" rx="2" />
        <text x="14" y="31" fontFamily="var(--font-sans), sans-serif" fontWeight="900" fontSize="18" fill="#FFFFFF" letterSpacing="1">CHLORIDE</text>
      </svg>
    )
  }
]

export default function BatteryBrands() {
  const [selectedBrandIndex, setSelectedBrandIndex] = useState(0)
  const [activeBrandModal, setActiveBrandModal] = useState<BatteryBrand | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const handleScroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 340
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }

    if (direction === "left") {
      setSelectedBrandIndex((prev) => Math.max(0, prev - 1))
    } else {
      setSelectedBrandIndex((prev) => Math.min(batteryBrandsData.length - 1, prev + 1))
    }
  }

  const scrollToIndex = (index: number) => {
    setSelectedBrandIndex(index)
    if (sliderRef.current) {
      const cardWidth = 320
      sliderRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth"
      })
    }
  }

  // Multiplied array for seamless bottom continuous loop
  const duplicatedBrands = [
    ...batteryBrandsData,
    ...batteryBrandsData,
    ...batteryBrandsData,
  ]

  return (
    <section id="battery-brands" className="py-20 bg-black text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3.5 py-1.5 rounded-full text-red-500 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              <span>GENUINE FACTORY SEALED BRANDS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Authorized Battery Brand Partners
            </h2>

            <p className="text-neutral-400 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
              We stock 100% factory fresh batteries from world leading manufacturers, supplied directly with written manufacturer warranties.
            </p>
          </div>

          {/* Slider Arrow Controls */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={() => handleScroll("left")}
              className="w-11 h-11 rounded-full bg-[#16171a] border border-neutral-800 hover:border-red-500 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95"
              aria-label="Previous Brand"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="w-11 h-11 rounded-full bg-[#16171a] border border-neutral-800 hover:border-red-500 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95"
              aria-label="Next Brand"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Upper Slider Card Box */}
        <div className="bg-[#121316] border border-neutral-800/90 rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl relative">
          
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-2 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {batteryBrandsData.map((brand, idx) => {
              const isSelected = selectedBrandIndex === idx

              return (
                <div
                  key={`main-brand-${brand.name}`}
                  onClick={() => {
                    setSelectedBrandIndex(idx)
                    setActiveBrandModal(brand)
                  }}
                  className={`flex-shrink-0 w-72 sm:w-80 rounded-2xl p-5 bg-[#1a1c22] border transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
                    isSelected
                      ? "border-red-500 ring-1 ring-red-500/60 shadow-[0_0_25px_rgba(239,68,68,0.2)]"
                      : "border-neutral-800/80 hover:border-red-500/50"
                  }`}
                >
                  {/* Logo Container */}
                  <div className="bg-[#121316] rounded-xl h-28 sm:h-32 flex items-center justify-center p-4 mb-4 border border-neutral-800/60 group-hover:border-red-500/40 transition-colors">
                    {brand.logo}
                  </div>

                  {/* Info below logo */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-white text-lg sm:text-xl group-hover:text-red-500 transition-colors">
                        {brand.name}
                      </h3>
                      <span className="bg-red-500/15 border border-red-500/30 text-red-400 text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        {brand.country}
                      </span>
                    </div>

                    <p className="text-neutral-400 text-xs sm:text-sm">
                      {brand.tagline}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination Indicators Bar */}
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-neutral-800/60">
            {batteryBrandsData.map((_, idx) => (
              <button
                key={`dot-${idx}`}
                onClick={() => scrollToIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  selectedBrandIndex === idx
                    ? "w-8 h-2 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                    : "w-2 h-2 bg-neutral-700 hover:bg-neutral-500"
                }`}
                aria-label={`Go to brand slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

        {/* Bottom Continuous Brand Loop Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-red-500" />
            <span>CONTINUOUS BRAND LOOP</span>
          </div>

          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% GENUINE TESTED STOCK</span>
          </div>
        </div>

        {/* Bottom Continuous Banner Container */}
        <div className="bg-[#121316] border border-neutral-800/90 rounded-2xl p-4 overflow-hidden relative group">
          {/* Gradient fade on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#121316] to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#121316] to-transparent z-20 pointer-events-none"></div>

          {/* Sliding Track */}
          <div className="flex gap-4 w-max animate-marquee group-hover:[animation-play-state:paused]">
            {duplicatedBrands.map((brand, idx) => (
              <div
                key={`loop-brand-${brand.name}-${idx}`}
                onClick={() => setActiveBrandModal(brand)}
                className="bg-[#1a1c22] border border-neutral-800/80 hover:border-red-500/60 rounded-xl p-3 flex items-center gap-4 min-w-[250px] transition-all cursor-pointer group/card"
              >
                <div className="bg-[#121316] rounded-lg p-2 h-12 w-28 flex items-center justify-center border border-neutral-800/60 group-hover/card:border-red-500/30 transition-colors">
                  {brand.logo}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm group-hover/card:text-red-500 transition-colors">
                    {brand.name}
                  </h4>
                  <span className="text-neutral-400 text-xs block">
                    {brand.country}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Brand Detail Modal */}
      {activeBrandModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveBrandModal(null)}
        >
          <div 
            className="bg-[#16171a] border border-neutral-800 hover:border-red-500/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveBrandModal(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 text-xs font-semibold px-3 py-1 rounded-full border border-red-500/20 mb-4">
              {activeBrandModal.country}
            </div>

            <div className="bg-[#121316] p-6 rounded-2xl border border-neutral-800 flex items-center justify-center mb-6">
              {activeBrandModal.logo}
            </div>

            <h3 className="text-2xl font-bold font-serif mb-1">{activeBrandModal.name}</h3>
            <p className="text-red-500 font-medium text-sm mb-4">{activeBrandModal.tagline}</p>

            <p className="text-neutral-300 text-sm leading-relaxed mb-6">
              {activeBrandModal.description}
            </p>

            <div className="bg-[#121316] rounded-xl p-4 border border-neutral-800/80 space-y-2 text-xs mb-6">
              <div className="flex justify-between text-neutral-400">
                <span>Warranty Status:</span>
                <span className="text-white font-semibold">Official Factory Covered</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Installation:</span>
                <span className="text-white font-semibold">Free On-Site Fitting</span>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href="#contact"
                onClick={() => setActiveBrandModal(null)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded-xl text-center text-sm transition-colors shadow-lg shadow-red-600/30"
              >
                Inquire For {activeBrandModal.name}
              </a>
              <button
                onClick={() => setActiveBrandModal(null)}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
