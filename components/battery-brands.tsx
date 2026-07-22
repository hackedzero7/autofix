"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { Battery, ShieldCheck, Sparkles, Zap, Award } from "lucide-react"

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
    warranty: "36-48 Months",
    description: "High-durability maintenance-free batteries with patented Silver-X alloy technology.",
    logo: (
      <svg className="h-9 sm:h-11 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    warranty: "24-36 Months",
    description: "Official OEM specification batteries built to rigorous General Motors quality standards.",
    logo: (
      <svg className="h-9 sm:h-11 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    warranty: "24-36 Months",
    description: "Precision-engineered German batteries providing reliable cold cranking power in severe temperatures.",
    logo: (
      <svg className="h-9 sm:h-11 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    warranty: "24-36 Months",
    description: "Preferred choice for European luxury vehicles including BMW, Audi, Mercedes, and Porsche.",
    logo: (
      <svg className="h-9 sm:h-11 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    warranty: "24-30 Months",
    description: "Heavy-duty tropical spec batteries tailored for intense heat resistance and heavy electric loads.",
    logo: (
      <svg className="h-9 sm:h-11 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    warranty: "24-36 Months",
    description: "Korea's leading battery manufacturer, original factory equipment for Hyundai and Kia vehicles.",
    logo: (
      <svg className="h-9 sm:h-11 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    warranty: "24-36 Months",
    description: "Advanced Carbon Boost 2.0 technology for up to 2x faster recharging and superior energy output.",
    logo: (
      <svg className="h-9 sm:h-11 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    warranty: "24-36 Months",
    description: "Rugged commercial-grade construction designed for heavy 4x4 off-roading and commercial fleets.",
    logo: (
      <svg className="h-9 sm:h-11 w-auto transition-transform duration-300 group-hover:scale-105" viewBox="0 0 160 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="10" width="150" height="30" fill="#E11D48" rx="2" />
        <text x="14" y="31" fontFamily="var(--font-sans), sans-serif" fontWeight="900" fontSize="18" fill="#FFFFFF" letterSpacing="1">CHLORIDE</text>
      </svg>
    )
  }
]

export default function BatteryBrands() {
  const [selectedBrand, setSelectedBrand] = useState<BatteryBrand | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Duplicate list multiple times for seamless infinite scrolling loop
  const duplicatedBrands = [
    ...batteryBrandsData,
    ...batteryBrandsData,
    ...batteryBrandsData,
  ]

  const reverseDuplicatedBrands = [
    ...batteryBrandsData.slice().reverse(),
    ...batteryBrandsData.slice().reverse(),
    ...batteryBrandsData.slice().reverse(),
  ]

  return (
    <section id="battery-brands" className="py-20 bg-black relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f15_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f15_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-full text-red-500 text-xs sm:text-sm font-semibold mb-6 tracking-wide uppercase shadow-sm">
          <Battery className="w-4 h-4 animate-pulse" />
          <span>Official Battery Authorized Partner</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
          Battery{" "}
          <span className="text-red-500 bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">
            Brands
          </span>
        </h2>

        <p className="text-lg sm:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
          We stock and install 100% genuine, factory-fresh car batteries from world-leading manufacturers with full warranty coverage and instant on-site fitting.
        </p>

        <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 mx-auto mt-8 rounded-full"></div>
      </div>

      {/* Row 1: Sliding Marquee (Left to Right) */}
      <div 
        className="relative w-full overflow-hidden py-4 my-2 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient overlays on left and right for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>

        <motion.div
          className="flex gap-6 w-max"
          animate={{
            x: isPaused ? undefined : ["0%", "-33.333333%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 35,
              ease: "linear",
            },
          }}
        >
          {duplicatedBrands.map((brand, index) => (
            <div
              key={`row1-${brand.name}-${index}`}
              onClick={() => setSelectedBrand(brand)}
              className="flex-shrink-0 w-64 sm:w-72 bg-neutral-900/80 border border-neutral-800 hover:border-red-500/60 rounded-2xl p-5 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] hover:-translate-y-1 cursor-pointer group/card flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-800/80 px-2.5 py-1 rounded-md border border-neutral-700/50">
                  {brand.country}
                </span>
                <span className="text-red-400/80 group-hover/card:text-red-400 transition-colors text-xs font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {brand.warranty || "Warranty"}
                </span>
              </div>

              <div className="h-16 flex items-center justify-center my-2 bg-neutral-950/60 rounded-xl p-3 border border-neutral-800/80 group-hover/card:border-red-500/30 transition-colors">
                {brand.logo}
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800/60">
                <div className="font-bold text-white text-base group-hover/card:text-red-400 transition-colors flex items-center justify-between">
                  <span>{brand.name}</span>
                  <Zap className="w-4 h-4 text-red-500 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-neutral-400 truncate mt-0.5">
                  {brand.tagline}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Row 2: Reverse Sliding Marquee (Right to Left) */}
      <div 
        className="relative w-full overflow-hidden py-4 my-2 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none"></div>

        <motion.div
          className="flex gap-6 w-max"
          animate={{
            x: isPaused ? undefined : ["-33.333333%", "0%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {reverseDuplicatedBrands.map((brand, index) => (
            <div
              key={`row2-${brand.name}-${index}`}
              onClick={() => setSelectedBrand(brand)}
              className="flex-shrink-0 w-64 sm:w-72 bg-neutral-900/80 border border-neutral-800 hover:border-red-500/60 rounded-2xl p-5 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] hover:-translate-y-1 cursor-pointer group/card flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-800/80 px-2.5 py-1 rounded-md border border-neutral-700/50">
                  {brand.country}
                </span>
                <span className="text-red-400/80 group-hover/card:text-red-400 transition-colors text-xs font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {brand.warranty || "Warranty"}
                </span>
              </div>

              <div className="h-16 flex items-center justify-center my-2 bg-neutral-950/60 rounded-xl p-3 border border-neutral-800/80 group-hover/card:border-red-500/30 transition-colors">
                {brand.logo}
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800/60">
                <div className="font-bold text-white text-base group-hover/card:text-red-400 transition-colors flex items-center justify-between">
                  <span>{brand.name}</span>
                  <Zap className="w-4 h-4 text-red-500 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-neutral-400 truncate mt-0.5">
                  {brand.tagline}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Feature Highlights Grid beneath slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 flex items-start gap-4 hover:border-red-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-1">100% Genuine Batteries</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Directly sourced from authorized manufacturers with official manufacturer code verification.
              </p>
            </div>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 flex items-start gap-4 hover:border-red-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 flex-shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-1">On-Site Installation</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Free battery delivery and instant professional installation at your location within 30 minutes.
              </p>
            </div>
          </div>

          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 flex items-start gap-4 hover:border-red-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-1">Free Battery Health Check</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Digital alternator, starter motor, and voltage drop diagnostic included with every service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Detail Modal when user clicks a brand card */}
      {selectedBrand && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedBrand(null)}
        >
          <div 
            className="bg-neutral-900 border border-neutral-800 hover:border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBrand(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
            >
              ✕
            </button>

            <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 text-xs font-semibold px-3 py-1 rounded-full border border-red-500/20 mb-4">
              {selectedBrand.country}
            </div>

            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 flex items-center justify-center mb-6">
              {selectedBrand.logo}
            </div>

            <h3 className="text-2xl font-bold font-serif mb-1">{selectedBrand.name}</h3>
            <p className="text-red-400 font-medium text-sm mb-4">{selectedBrand.tagline}</p>

            <p className="text-neutral-300 text-sm leading-relaxed mb-6">
              {selectedBrand.description}
            </p>

            <div className="bg-neutral-950/80 rounded-xl p-4 border border-neutral-800/80 space-y-2 text-xs mb-6">
              <div className="flex justify-between text-neutral-400">
                <span>Warranty Period:</span>
                <span className="text-white font-semibold">{selectedBrand.warranty}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Service Guarantee:</span>
                <span className="text-white font-semibold">1-to-1 Replacement</span>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href="#contact"
                onClick={() => setSelectedBrand(null)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded-xl text-center text-sm transition-colors shadow-lg shadow-red-600/30"
              >
                Inquire For {selectedBrand.name}
              </a>
              <button
                onClick={() => setSelectedBrand(null)}
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
