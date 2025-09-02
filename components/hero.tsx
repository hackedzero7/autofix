export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src="/black-sports-car-red-lighting.png"
          alt="Modern automotive service background"
          className="w-full h-full object-cover scale-110 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/70 to-red-900/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-red-500/30 to-red-600/10 rounded-full animate-float blur-sm hidden lg:block"></div>
        <div
          className="absolute bottom-32 right-32 w-20 h-20 bg-gradient-to-br from-red-400/40 to-red-500/20 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-br from-red-600/50 to-red-700/30 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/4 left-20 w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-full animate-float hidden lg:block"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Geometric shapes */}
        <div className="absolute top-40 left-1/4 w-8 h-8 border-2 border-red-500/30 rotate-45 animate-spin-slow hidden lg:block"></div>
        <div className="absolute bottom-40 left-1/3 w-6 h-6 bg-red-500/20 transform rotate-12 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 animate-slide-in-up">
            <div className="inline-flex items-center bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-400 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-red-500/30 backdrop-blur-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
              24/7 Emergency Service Available
            </div>

            <h1 className="text-6xl lg:text-8xl font-serif font-bold text-white mb-8 leading-[0.9] tracking-tight">
              <span className="block">Expert</span>
              <span className="block bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Auto Care
              </span>
              <span className="block text-4xl lg:text-5xl font-sans font-light text-white/80 mt-2">Solutions</span>
            </h1>

            <p className="text-xl lg:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl font-light">
              Professional car battery replacement, AC repair, and comprehensive auto maintenance with
              <span className="text-red-400 font-medium"> cutting-edge technology</span> and expert technicians.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <a
                href="tel:+1234567890"
                className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-5 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/25 text-center flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <svg
                  className="w-6 h-6 mr-3 group-hover:animate-pulse relative z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="relative z-10">Get Free Quote</span>
              </a>
              <a
                href="#services"
                className="group bg-white/10 backdrop-blur-md text-white hover:bg-white/20 px-10 py-5 rounded-2xl text-lg font-semibold transition-all duration-300 text-center border border-white/20 hover:border-red-500/50 flex items-center justify-center"
              >
                <span>Explore Services</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

          
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative max-w-md mx-auto lg:mx-0">
              {/* Background decoration */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-full blur-3xl"></div>

              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-white mb-1">Express Service</h3>
                    <p className="text-white/70">Battery Replacement</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-white/80">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Under 30 minutes
                  </div>
                  <div className="flex items-center text-white/80">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free diagnostic
                  </div>
                  <div className="flex items-center text-white/80">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    2-year warranty
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
