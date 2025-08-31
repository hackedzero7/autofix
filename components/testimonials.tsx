"use client"

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"
import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    
    {
      quote:
        "Fixed my AC in no time. The technician was knowledgeable and explained everything clearly. Great customer service and fair pricing. Will definitely use again!",
      name: "Mike Rodriguez",
      designation: "AC Repair • Business Bay • ⭐⭐⭐⭐⭐",
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Been using AutoFix Pro for all my car maintenance. Always reliable, honest pricing, and quality work. Trust them completely with my BMW. Best service in Dubai!",
      name: "Emily Chen",
      designation: "Full Service • Jumeirah • ⭐⭐⭐⭐⭐",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Outstanding jumpstart service at 2 AM! They arrived quickly and got me back on the road. Truly 24/7 service as advertised. Saved my night!",
      name: "Ahmed Al-Rashid",
      designation: "Jumpstart Service • Marina • ⭐⭐⭐⭐⭐",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Professional oil change service with premium quality oil. They even checked other fluids for free. Great value for money and excellent customer care!",
      name: "Lisa Thompson",
      designation: "Oil Change • JLT • ⭐⭐⭐⭐⭐",
      src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Brake pads replacement was done perfectly. The mechanic explained everything and showed me the old parts. Very transparent and professional service.",
      name: "David Wilson",
      designation: "Brake Service • DIFC • ⭐⭐⭐⭐⭐",
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ]

  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-br from-black via-gray-950 to-black relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-52 h-52 bg-red-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-10 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-10 left-1/4 w-36 h-36 bg-red-400/10 rounded-full blur-2xl animate-pulse delay-3000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600/20 via-blue-500/15 to-red-500/20 border border-blue-500/30 rounded-full px-8 py-4 mb-8 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-500 group">
            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm font-semibold text-blue-400 tracking-wide group-hover:text-blue-300 transition-colors">
                Google
              </span>
            </div>
            <div className="w-px h-6 bg-gray-600 group-hover:bg-gray-500 transition-colors"></div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-semibold text-yellow-400 tracking-wide group-hover:text-yellow-300 transition-colors">
                Reviews
              </span>
            </div>
          </div>

          <h2 className="text-5xl lg:text-7xl font-serif font-bold text-white mb-8 leading-tight">
            What Our{" "}
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent animate-pulse">
              Customers
            </span>{" "}
            Say
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Real reviews from real customers on <span className="text-blue-400 font-semibold">Google</span> with{" "}
            <span className="text-red-400 font-semibold">verified purchases</span>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            <div className="group bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl px-6 py-6 hover:border-red-500/50 transition-all duration-500 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Google Reviews</div>
            </div>

            <div className="group bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl px-6 py-6 hover:border-red-500/50 transition-all duration-500 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent mb-2">
                4.9
              </div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Google Rating</div>
              <div className="flex gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 text-yellow-400 fill-current opacity-0 group-hover:opacity-100 transition-opacity delay-100"
                    style={{ transitionDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>

            <div className="group bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl px-6 py-6 hover:border-red-500/50 transition-all duration-500 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Emergency Service</div>
            </div>

            <div className="group bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl px-6 py-6 hover:border-red-500/50 transition-all duration-500 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent mb-2">
                15min
              </div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Avg Response</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
      </div>
    </section>
  )
}
