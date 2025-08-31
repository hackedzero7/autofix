export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/black-sports-car-red-lighting.png"
          alt="Modern automotive service background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-primary/30 rounded-full animate-float hidden lg:block red-glow"></div>
      <div
        className="absolute bottom-32 right-32 w-12 h-12 bg-primary/20 rounded-full animate-float red-glow"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 right-10 w-8 h-8 bg-primary/40 rounded-full animate-float red-glow"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-up">
            <div className="inline-flex items-center bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary/30">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              24/7 Emergency Service
            </div>

            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Premium Auto
              <span className="block text-primary">Repair Services</span>
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-lg">
              Professional car battery replacement, AC repair, and comprehensive auto maintenance. Your trusted partner
              for all automotive needs with cutting-edge technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="tel:+1234567890"
                className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-primary/25 text-center flex items-center justify-center animate-glow"
              >
                <svg
                  className="w-5 h-5 mr-2 group-hover:animate-pulse"
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
                Get Free Quote
              </a>
              <a
                href="#services"
                className="glass-effect text-white hover:bg-white/20 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 text-center border border-primary/30 hover:border-primary/50"
              >
                View Services
              </a>
            </div>

          
          </div>

          <div className="relative lg:block hidden">
            <div className="relative">
              <div className="glass-effect rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 border border-primary/20">
                <div className="bg-card rounded-xl p-6 shadow-2xl border border-primary/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif font-bold text-lg text-card-foreground">Express Service</h3>
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center animate-glow">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">Battery replacement in under 30 minutes</p>
                  <div className="flex items-center text-primary font-semibold">
                    <span>Starting at $89</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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
