"use client"

import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Shield,
  Award,
  Zap,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowUp,
} from "lucide-react"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer id="contact" className="relative bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center group">
            <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-500/20 transition-colors">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-sm font-semibold">Licensed & Insured</p>
          </div>
          <div className="text-center group">
            <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-500/20 transition-colors">
              <Award className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-sm font-semibold">Certified Technicians</p>
          </div>
          <div className="text-center group">
            <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-500/20 transition-colors">
              <Star className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-sm font-semibold">5-Star Rated</p>
          </div>
          <div className="text-center group">
            <div className="bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-500/20 transition-colors">
              <Zap className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-sm font-semibold">24/7 Emergency</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-red-600 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                AutoFix Pro
              </h3>
            </div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Your trusted partner for premium automotive repair and maintenance services. We deliver excellence with
              every service, backed by certified technicians and state-of-the-art equipment.
            </p>

            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 hover:bg-red-500 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-red-500 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-red-500 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-red-500 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 text-red-500">Our Services</h4>
            <ul className="space-y-3">
              {[
                "Car Battery Replacement",
                "AC Repair & Service",
                "Oil Change Service",
                "Brake Pads Replacement",
                "Car Inspection",
                "Jumpstart Service",
                "Car Detailing",
                "Emergency Recovery",
              ].map((service, index) => (
                <li
                  key={index}
                  className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer flex items-center"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 text-red-500">Contact & Hours</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">+1 (800) 123-4567</p>
                  <p className="text-gray-400 text-sm">24/7 Emergency Line</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">info@autofixpro.com</p>
                  <p className="text-gray-400 text-sm">Quick Response</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white">123 Auto Service Blvd</p>
                  <p className="text-gray-400">Dubai, UAE 12345</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold">Mon-Fri: 8AM-8PM</p>
                  <p className="text-gray-400">Sat-Sun: 9AM-6PM</p>
                  <p className="text-red-500 text-sm font-semibold">24/7 Emergency</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-400">
              © 2024 AutoFix Pro. All rights reserved. |
              <span className="text-red-500 font-semibold"> Licensed & Insured Professional Service</span>
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Serving Dubai and surrounding areas with premium automotive care
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="bg-red-500 hover:bg-red-600 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
          >
            <ArrowUp className="w-5 h-5 text-white group-hover:animate-bounce" />
          </button>
        </div>
      </div>
    </footer>
  )
}
