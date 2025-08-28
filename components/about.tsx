import { Award, Users, Clock, Shield, CheckCircle, Star } from "lucide-react"

export default function About() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-black via-gray-900/50 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-600/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-red-500/30 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-red-400/25 rounded-full blur-md animate-ping delay-500"></div>
        <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-red-500/15 rounded-full blur-lg animate-pulse delay-2000"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 right-20 w-4 h-4 border-2 border-red-500/30 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-40 left-16 w-6 h-6 border-2 border-red-400/30 animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-red-500/40 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-6 py-2 mb-6">
            <Award className="w-5 h-5 text-red-500" />
            <span className="text-red-500 font-medium">15+ Years of Excellence</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            About{" "}
            <span className="text-transparent bg-gradient-to-r from-red-500 to-red-600 bg-clip-text">AutoCare Pro</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Your trusted automotive service partner delivering premium car battery replacement, AC repair, and
            comprehensive auto maintenance with cutting-edge technology and unmatched expertise.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center mb-20">
          <div className="space-y-8">
            <div className="group bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-8 hover:border-red-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-white">Our Mission</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                To revolutionize automotive care by combining state-of-the-art technology with decades of expertise,
                ensuring every vehicle receives premium service that exceeds expectations and keeps you confidently on
                the road.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-lg border border-gray-700/50 rounded-3xl p-8 hover:border-red-600/30 transition-all duration-500 hover:shadow-2xl hover:shadow-red-600/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-white">Why Choose Us</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: CheckCircle, text: "Master-certified technicians with 15+ years expertise" },
                  { icon: Clock, text: "24/7 emergency roadside assistance nationwide" },
                  { icon: Award, text: "Premium OEM parts with extended warranties" },
                  { icon: Shield, text: "Transparent pricing with lifetime guarantees" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-red-500/5 transition-colors duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-gray-300 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "15+", label: "Years Experience", icon: Award, color: "red-500" },
              { value: "5000+", label: "Happy Customers", icon: Users, color: "red-600" },
              { value: "24/7", label: "Emergency Service", icon: Clock, color: "red-500" },
              { value: "100%", label: "Satisfaction Rate", icon: Star, color: "red-600" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`group bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-transparent border border-${stat.color}/20 rounded-3xl p-8 text-center hover:scale-105 hover:border-${stat.color}/40 transition-all duration-500 hover:shadow-xl hover:shadow-${stat.color}/20`}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br from-${stat.color} to-${stat.color} rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div
                  className={`text-4xl font-bold text-${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}
                >
                  {stat.value}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
