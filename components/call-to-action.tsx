"use client"

import { useState, useEffect } from "react"
import { Phone, MessageCircle, Clock, Shield, Zap, ArrowRight, Star, CheckCircle } from "lucide-react"

export default function CallToAction() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    { icon: Clock, text: "24/7 Emergency Service", color: "text-red-400" },
    { icon: Shield, text: "Licensed & Insured", color: "text-red-400" },
    { icon: Zap, text: "Same Day Service", color: "text-red-400" },
  ]

  return (
    <section className="relative py-24 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-0 w-1 h-32 bg-gradient-to-b from-transparent via-red-500 to-transparent"></div>
        <div className="absolute top-1/2 right-0 w-1 h-32 bg-gradient-to-b from-transparent via-red-500 to-transparent"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 border border-red-500/30 rotate-45 animate-spin-slow"></div>
        <div className="absolute top-40 right-20 w-6 h-6 border border-red-400/20 rotate-12 animate-bounce-slow"></div>
        <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-red-500/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-5 h-5 border-2 border-red-400/30 rounded-full animate-ping"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/20 rounded-full px-6 py-2 mb-6">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">Emergency Service Available</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 font-serif">
            Need Auto Repair Service{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Today?</span>
          </h2>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            Don't wait for small problems to become big expenses. Our certified technicians are ready to get you back on
            the road with professional, reliable service.
          </p>

          <div className="flex justify-center items-center gap-8 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 transition-all duration-500 ${
                    activeFeature === index ? "scale-110 opacity-100" : "scale-100 opacity-60"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                  <span className="text-white font-medium hidden sm:block">{feature.text}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div
          className={`flex flex-col lg:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Primary CTA - Call Now */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-400 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <a
              href="tel:+1234567890"
              className="relative flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl"
            >
              <Phone className="w-5 h-5" />
              <span>Call (123) 456-7890</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Secondary CTA - WhatsApp */}
          <div className="group relative">
            <a
              href="https://wa.me/1234567890"
              className="flex items-center gap-3 bg-black/50 backdrop-blur-sm border-2 border-red-500/30 hover:border-red-400 text-white hover:bg-red-600/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform group-hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Tertiary CTA - Free Quote */}
          <div className="group relative">
            <a
              href="#contact"
              className="flex items-center gap-3 bg-transparent border-2 border-white/30 hover:border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform group-hover:scale-105"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Get Free Quote</span>
            </a>
          </div>
        </div>

        <div
          className={`mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {[
            { number: "5000+", label: "Happy Customers", icon: Star },
            { number: "24/7", label: "Emergency Service", icon: Clock },
            { number: "15min", label: "Response Time", icon: Zap },
            { number: "100%", label: "Satisfaction Rate", icon: Shield },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center group">
                <div className="bg-black/30 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 group-hover:border-red-400/40 transition-all duration-300">
                  <Icon className="w-8 h-8 text-red-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div
          className={`mt-12 text-center transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-red-400 text-sm font-medium">Available Now - Call for Immediate Service</span>
          </div>
        </div>
      </div>
    </section>
  )
}
