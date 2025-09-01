"use client"

import type React from "react"
import { Car, Zap } from "lucide-react"

import { useState, useEffect } from "react"

export default function Header() {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "services", "about", "testimonials", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Call once to set initial state

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-600 rounded-xl flex items-center justify-center animate-glow shadow-lg">
                    <Car className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <Zap className="w-2 h-2 text-white animate-ping" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent">
                    CBR
                  </h1>
                  <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                    Car Battery Replacement
                  </p>
                </div>
              </div>
            </div>
          </div>

          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#services"
                onClick={(e) => handleSmoothScroll(e, "services")}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-primary/10 rounded-lg relative group ${
                  activeSection === "services" ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                Services
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    activeSection === "services" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </a>
              <a
                href="#about"
                onClick={(e) => handleSmoothScroll(e, "about")}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-primary/10 rounded-lg relative group ${
                  activeSection === "about" ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                About
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    activeSection === "about" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </a>
              <a
                href="#testimonials"
                onClick={(e) => handleSmoothScroll(e, "testimonials")}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-primary/10 rounded-lg relative group ${
                  activeSection === "testimonials" ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                Reviews
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    activeSection === "testimonials" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </a>
              <a
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, "contact")}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-primary/10 rounded-lg relative group ${
                  activeSection === "contact" ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                Contact
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    activeSection === "contact" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </a>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center text-sm text-muted-foreground">
              <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              24/7 Emergency
            </div>
            <a
              href="tel:+1234567890"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/25 animate-pulse-red"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
