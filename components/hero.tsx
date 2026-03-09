export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Background Image with Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="/black-sports-car-red-lighting.png"
          alt="Modern automotive service background"
          className="w-full h-full object-cover scale-110 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/70 to-red-900/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-red-600/15 to-red-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 border border-red-500/10 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-140px)]">
          
          {/* Left Column - Main Content */}
          <div className="flex flex-col justify-center space-y-8 animate-slide-in-up">
            {/* Badge */}
            <div className="inline-flex items-center w-fit">
              <div className="inline-flex items-center bg-gradient-to-r from-red-500/30 to-red-600/20 text-red-300 px-5 py-2.5 rounded-full text-xs font-semibold border border-red-500/40 backdrop-blur-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2.5 animate-pulse"></div>
                PROFESSIONAL AUTO CARE
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-sans font-bold text-white leading-[1.1] tracking-tight">
                Excellence In Every
                <br />
                <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent animate-pulse">
                  Service
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-white/80 leading-relaxed max-w-xl font-light">
                Trusted by thousands for battery replacements, AC repairs, and comprehensive auto maintenance using cutting-edge technology and expert technicians.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="tel:+971567304650"
                className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/40 text-center overflow-hidden inline-flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <svg className="w-5 h-5 mr-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="relative z-10">Call Now</span>
              </a>
              <a
                href="#services"
                className="group bg-white/10 backdrop-blur-md text-white hover:bg-white/20 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 text-center border border-white/20 hover:border-red-500/50 inline-flex items-center justify-center"
              >
                <span>Learn More</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold text-red-500">24/7</div>
                <p className="text-sm text-white/60">Emergency Service</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">20+</div>
                <p className="text-sm text-white/60">Years Experience</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">5K+</div>
                <p className="text-sm text-white/60">Clients Served</p>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="relative flex flex-col gap-6">
            {/* Main Service Card */}
            <div className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500 hover:border-red-500/50 animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-red-500/30 to-red-600/10 rounded-full blur-2xl group-hover:from-red-500/50 transition-all duration-500"></div>
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                  <h3 className="font-sans font-bold text-2xl text-white mb-2">Express Service</h3>
                  <p className="text-white/70 text-sm">Battery Replacement</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                  </svg>
                </div>
              </div>

              <ul className="space-y-3 relative z-10">
                <li className="flex items-center text-white/80 text-sm">
                  <svg className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  20-30 minutes completion time
                </li>
                <li className="flex items-center text-white/80 text-sm">
                  <svg className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Professional diagnostics included
                </li>
                <li className="flex items-center text-white/80 text-sm">
                  <svg className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  1-2 year warranty 
                </li>
              </ul>

              {/* <button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 relative z-10">
                Book Service
              </button> */}
            </div>

            {/* Secondary Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/15 hover:border-red-500/30 transition-all duration-300 cursor-pointer group" style={{ animationDelay: "0.4s" }}>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500/40 to-red-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-white mb-1">Quick Checks</h4>
                <p className="text-white/60 text-sm">Rapid diagnostics</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/15 hover:border-red-500/30 transition-all duration-300 cursor-pointer group" style={{ animationDelay: "0.5s" }}>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500/40 to-red-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-white mb-1">Premium AC</h4>
                <p className="text-white/60 text-sm">Cooling solutions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
    </section>
  )
}
