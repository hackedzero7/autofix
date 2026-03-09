import { Award, Users, Clock, Shield, CheckCircle, Star, Target, TrendingUp, Wrench, Zap, Gauge, Lightbulb, Heart } from "lucide-react"

export default function About() {
  return (
    <section id="about" className="py-32 bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-red-500/30 to-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-l from-red-600/25 to-red-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="mb-24">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-500/30 rounded-full px-6 py-2 mb-8 backdrop-blur-sm">
            <Wrench className="w-4 h-4 text-red-500 animate-spin" />
            <span className="text-red-400 font-semibold text-sm tracking-wide">Who We Are</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Premium Auto Care<br />
            <span className="text-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text">
              Redefined
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl font-light leading-relaxed">
            With over 15 years of expertise and 5000+ satisfied customers, AutoCare Pro has established itself as the leader in premium automotive maintenance and emergency services.
          </p>
        </div>

        {/* Stats Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {[
            { value: "15+", label: "Years Experience", icon: Award },
            { value: "5000+", label: "Happy Customers", icon: Users },
            { value: "24/7", label: "Emergency Service", icon: Clock },
            { value: "100%", label: "Satisfaction Rate", icon: TrendingUp },
          ].map((stat, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 text-center hover:scale-105 hover:border-red-500/40 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mx-auto flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-red-500 to-red-600 bg-clip-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-xs font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission, Vision, Values Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          {/* Mission Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/50 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-red-500/40 transition-all duration-500 h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Mission</h3>
              </div>
              <p className="text-gray-300 leading-relaxed font-light">
                To revolutionize automotive care by combining cutting-edge technology with decades of expertise, ensuring every vehicle receives exceptional service.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/50 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-red-600/40 transition-all duration-500 h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Vision</h3>
              </div>
              <p className="text-gray-300 leading-relaxed font-light">
                To be the trusted partner for automotive excellence, setting industry standards through innovation, reliability, and customer-centric solutions.
              </p>
            </div>
          </div>

          {/* Values Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/50 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-red-500/40 transition-all duration-500 h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Values</h3>
              </div>
              <p className="text-gray-300 leading-relaxed font-light">
                Integrity, excellence, and customer satisfaction drive every decision we make. We believe in transparent communication and quality workmanship.
              </p>
            </div>
          </div>
        </div>

        {/* Core Competencies Section */}
        <div className="mb-24">
          <h3 className="text-4xl font-bold text-white mb-12">Our Core Competencies</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Gauge,
                title: "Battery Replacement",
                description: "Professional car battery installation with premium OEM parts and lifetime warranty"
              },
              {
                icon: Zap,
                title: "AC System Repair",
                description: "Expert air conditioning maintenance ensuring optimal cooling performance year-round"
              },
              {
                icon: Wrench,
                title: "General Maintenance",
                description: "Comprehensive vehicle maintenance using certified technicians and quality parts"
              },
              {
                icon: Shield,
                title: "Diagnostic Services",
                description: "State-of-the-art diagnostic equipment to identify and resolve vehicle issues quickly"
              },
              {
                icon: Clock,
                title: "Emergency Roadside",
                description: "24/7 emergency assistance for breakdowns, jump starts, and roadside repairs"
              },
              {
                icon: Award,
                title: "Fleet Services",
                description: "Dedicated fleet maintenance programs for businesses and commercial vehicles"
              },
            ].map((service, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/5 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-lg border border-gray-700/40 rounded-2xl p-6 hover:border-red-500/40 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{service.title}</h4>
                  <p className="text-gray-400 text-sm font-light">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </section>
  )
}
