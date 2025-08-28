"use client"

import { useState, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight, MapPin, Calendar, Play, Pause, Zap, Shield, Clock } from "lucide-react"

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const googleReviews = [
    {
      name: "Sarah Johnson",
      location: "Downtown Dubai",
      rating: 5,
      text: "Excellent service! My car battery died on a Sunday morning and they came out within an hour. Professional and reasonably priced. Highly recommend AutoFix Pro!",
      service: "Battery Replacement",
      date: "2 weeks ago",
      avatar: "SJ",
      verified: true,
      responseTime: "45 mins",
      googleReviewId: "ChZDSUhNMG9nS0VJQ0FnSURqaGZQcUJREAE",
      helpful: 12,
    },
    {
      name: "Mike Rodriguez",
      location: "Business Bay",
      rating: 5,
      text: "Fixed my AC in no time. The technician was knowledgeable and explained everything clearly. Great customer service and fair pricing.",
      service: "AC Repair",
      date: "1 month ago",
      avatar: "MR",
      verified: true,
      responseTime: "30 mins",
      googleReviewId: "ChZDSUhNMG9nS0VJQ0FnSURqaGZQcUJREAE",
      helpful: 8,
    },
    {
      name: "Emily Chen",
      location: "Jumeirah",
      rating: 5,
      text: "Been using AutoFix Pro for all my car maintenance. Always reliable, honest pricing, and quality work. Trust them completely with my BMW.",
      service: "Full Service",
      date: "3 weeks ago",
      avatar: "EC",
      verified: true,
      responseTime: "Same day",
      googleReviewId: "ChZDSUhNMG9nS0VJQ0FnSURqaGZQcUJREAE",
      helpful: 15,
    },
    {
      name: "Ahmed Al-Rashid",
      location: "Marina",
      rating: 5,
      text: "Outstanding jumpstart service at 2 AM! They arrived quickly and got me back on the road. Truly 24/7 service as advertised.",
      service: "Jumpstart Service",
      date: "1 week ago",
      avatar: "AR",
      verified: true,
      responseTime: "20 mins",
      googleReviewId: "ChZDSUhNMG9nS0VJQ0FnSURqaGZQcUJREAE",
      helpful: 22,
    },
    {
      name: "Lisa Thompson",
      location: "JLT",
      rating: 5,
      text: "Professional oil change service with premium quality oil. They even checked other fluids for free. Great value for money!",
      service: "Oil Change",
      date: "2 months ago",
      avatar: "LT",
      verified: true,
      responseTime: "1 hour",
      googleReviewId: "ChZDSUhNMG9nS0VJQ0FnSURqaGZQcUJREAE",
      helpful: 6,
    },
    {
      name: "David Wilson",
      location: "DIFC",
      rating: 5,
      text: "Quick brake pad replacement with high-quality parts. Professional service and competitive pricing. Highly recommended!",
      service: "Brake Repair",
      date: "1 week ago",
      avatar: "DW",
      verified: true,
      responseTime: "25 mins",
      googleReviewId: "ChZDSUhNMG9nS0VJQ0FnSURqaGZQcUJREAE",
      helpful: 9,
    },
    {
      name: "Fatima Al-Zahra",
      location: "Al Barsha",
      rating: 5,
      text: "Excellent car wash and detailing service. My car looks brand new! Attention to detail is outstanding.",
      service: "Car Detailing",
      date: "3 days ago",
      avatar: "FA",
      verified: true,
      responseTime: "Same day",
      googleReviewId: "ChZDSUhNMG9nS0VJQ0FnSURqaGZQcUJREAE",
      helpful: 18,
    },
    {
      name: "John Smith",
      location: "Dubai Hills",
      rating: 5,
      text: "Professional car inspection service before buying my used car. Thorough check and detailed report. Worth every dirham!",
      service: "Car Inspection",
      date: "2 weeks ago",
      avatar: "JS",
      verified: true,
      responseTime: "1 hour",
      googleReviewId: "ChZDSUhNMG9nS0VJQ0FnSURqaGZQcUJREAE",
      helpful: 14,
    },
  ]

  const cardsPerSlide = 4
  const totalSlides = Math.ceil(googleReviews.length / cardsPerSlide)

  useEffect(() => {
    if (!isAutoPlaying || hoveredCard !== null) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, hoveredCard, totalSlides])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-br from-black via-gray-950 to-black relative overflow-hidden"
    >
      {/* ... existing background elements ... */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-52 h-52 bg-red-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-10 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-10 left-1/4 w-36 h-36 bg-red-400/10 rounded-full blur-2xl animate-pulse delay-3000"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rotate-45 animate-bounce delay-1000"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-white/30 rotate-45 animate-bounce delay-2000"></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-8 bg-red-400/50 animate-pulse delay-1500"></div>
        <div className="absolute bottom-1/4 right-1/6 w-8 h-1 bg-white/20 animate-pulse delay-2500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600/20 to-red-500/20 border border-blue-500/30 rounded-full px-8 py-4 mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
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
              <span className="text-sm font-semibold text-blue-400 tracking-wide">Google</span>
            </div>
            <div className="w-px h-6 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold text-yellow-400 tracking-wide">Reviews</span>
            </div>
          </div>

          <h2 className="text-5xl lg:text-7xl font-serif font-bold text-white mb-8 leading-tight">
            What Our{" "}
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">
              Customers
            </span>{" "}
            Say
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Real reviews from real customers on <span className="text-blue-400 font-semibold">Google</span> with{" "}
            <span className="text-red-400 font-semibold">verified purchases</span>
          </p>

          {/* ... existing statistics cards ... */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="group bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl px-6 py-6 hover:border-red-500/50 transition-all duration-500 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Google Reviews</div>
              <div className="w-full h-1 bg-gray-800 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000"></div>
              </div>
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
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-3 h-3 text-red-400 animate-pulse" />
                <span className="text-xs text-red-400">Always Available</span>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl px-6 py-6 hover:border-red-500/50 transition-all duration-500 hover:scale-105">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent mb-2">
                15min
              </div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Avg Response</div>
              <div className="flex items-center gap-1 mt-2">
                <Zap className="w-3 h-3 text-red-400 animate-pulse" />
                <span className="text-xs text-red-400">Lightning Fast</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative perspective-1000">
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-all duration-700 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
                    {googleReviews
                      .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                      .map((review, cardIndex) => {
                        const globalIndex = slideIndex * cardsPerSlide + cardIndex
                        return (
                          <div
                            key={globalIndex}
                            className="h-full"
                            onMouseEnter={() => setHoveredCard(globalIndex)}
                            onMouseLeave={() => setHoveredCard(null)}
                          >
                            <div
                              className={`relative bg-gradient-to-br from-gray-900/90 via-gray-900/95 to-black/90 backdrop-blur-xl border rounded-2xl p-6 shadow-2xl overflow-hidden group transition-all duration-500 h-full flex flex-col ${
                                hoveredCard === globalIndex
                                  ? "border-red-500/50 shadow-red-500/20 transform scale-105"
                                  : "border-gray-800/50 hover:border-gray-700/50"
                              }`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                              <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-60 transition-all duration-500">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
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
                              </div>

                              <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-1">
                                    {[...Array(review.rating)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 text-yellow-400 fill-current transform transition-transform duration-300 hover:scale-125"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                      />
                                    ))}
                                  </div>

                                  {review.verified && (
                                    <div className="flex items-center gap-1 bg-blue-500/20 border border-blue-500/30 rounded-full px-2 py-1">
                                      <Shield className="w-3 h-3 text-blue-400" />
                                      <span className="text-xs font-medium text-blue-400">Verified</span>
                                    </div>
                                  )}
                                </div>

                                <blockquote className="text-sm text-gray-100 mb-4 leading-relaxed font-medium relative flex-grow">
                                  <span className="text-red-400 text-lg absolute -top-1 -left-1">"</span>
                                  <span className="pl-4">{review.text}</span>
                                  <span className="text-red-400 text-lg">"</span>
                                </blockquote>

                                <div className="mt-auto pt-4 border-t border-gray-800/50">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="relative">
                                      <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                        {review.avatar}
                                      </div>
                                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-white text-sm truncate">{review.name}</p>
                                      <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{review.location}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 text-red-400 px-2 py-1 rounded-full text-xs font-semibold">
                                      {review.service}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                      <Calendar className="w-3 h-3" />
                                      {review.date}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <span>👍</span>
                                      <span>{review.helpful}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-blue-400">
                                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                      </svg>
                                      <span>Google</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ... existing navigation buttons ... */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-full p-4 shadow-2xl hover:border-red-500/50 hover:shadow-red-500/20 transition-all duration-300 group"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-full p-4 shadow-2xl hover:border-red-500/50 hover:shadow-red-500/20 transition-all duration-300 group"
          >
            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors" />
          </button>
        </div>

        {/* ... existing slide indicators and controls ... */}
        <div className="flex justify-center gap-3 mt-12">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative overflow-hidden rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? "bg-gradient-to-r from-red-600 to-red-500 w-12 h-4"
                  : "bg-gray-700 hover:bg-gray-600 w-4 h-4"
              }`}
            >
              {index === currentSlide && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-300 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800/50 rounded-full px-6 py-3 text-sm text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all duration-300"
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause Auto-play
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Resume Auto-play
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
