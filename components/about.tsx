import { Award, Users, Clock, Shield, CheckCircle, Star, Target, TrendingUp, Wrench, Zap } from "lucide-react"

export default function About() {
  return (
    <section id="about" className="py-32 bg-gradient-to-b from-black via-gray-900/30 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-red-500/30 to-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-l from-red-600/25 to-red-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-red-500/20 rounded-full blur-2xl animate-bounce"></div>

        <div className="absolute top-40 right-32 w-16 h-16 border-2 border-red-500/40 rotate-45 animate-spin"></div>
        <div className="absolute bottom-60 left-20 w-12 h-12 bg-red-500/30 transform rotate-12 animate-bounce delay-700"></div>
        <div className="absolute top-3/4 right-1/4 w-8 h-8 bg-red-400/40 rounded-full animate-ping delay-1500"></div>
        <div className="absolute top-1/3 left-1/5 w-20 h-2 bg-red-500/30 animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-20 bg-red-600/30 animate-pulse delay-800"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="text-left">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-500/30 rounded-full px-6 py-2 mb-6 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <Wrench className="w-4 h-4 text-red-500 animate-spin" />
              <span className="text-red-400 font-semibold text-sm tracking-wide">Premium Auto Care</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              About{" "}
              <span className="relative">
                <span className="text-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text">
                  AutoCare Pro
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
              </span>
            </h2>

            <p className="text-lg text-gray-300 leading-relaxed font-light mb-8">
              Your trusted automotive service partner delivering premium car battery replacement, AC repair, and
              comprehensive auto maintenance with cutting-edge technology.
            </p>

            <div className="space-y-4">
              {[
                { icon: CheckCircle, text: "15+ Years of Excellence" },
                { icon: Zap, text: "24/7 Emergency Service" },
                { icon: Shield, text: "100% Satisfaction Guarantee" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-300 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "15+", label: "Years Experience", icon: Award, color: "red-500" },
              { value: "5000+", label: "Happy Customers", icon: Users, color: "red-600" },
              { value: "24/7", label: "Emergency Service", icon: Clock, color: "red-500" },
              { value: "100%", label: "Satisfaction Rate", icon: TrendingUp, color: "red-600" },
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
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/50 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-red-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white">Our Mission</h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed font-light">
                To revolutionize automotive care by combining state-of-the-art technology with decades of expertise,
                ensuring every vehicle receives premium service that exceeds expectations and keeps you confidently on
                the road.
              </p>
            </div>
          </div>

          {/* Values Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/50 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-red-600/40 transition-all duration-500 hover:shadow-2xl hover:shadow-red-600/20 h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white">Our Values</h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: CheckCircle, text: "Master-certified technicians" },
                  { icon: Clock, text: "24/7 emergency assistance" },
                  { icon: Award, text: "Premium OEM parts only" },
                  { icon: Shield, text: "Lifetime service guarantees" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-all duration-300 group/item"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500/30 to-red-600/20 rounded-lg flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                      <item.icon className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-gray-300 font-medium text-sm group-hover/item:text-white transition-colors duration-300">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
