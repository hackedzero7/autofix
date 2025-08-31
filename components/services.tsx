import { Zap, Snowflake, Droplets, Disc, Square, Battery, Wrench, CheckCircle } from "lucide-react"

export default function Services() {
  const services = [
    {
      title: "Car Battery Replacement",
      description:
        "Professional battery replacement with premium brands and instant installation service. Our certified technicians ensure your vehicle gets back on the road quickly with reliable, long-lasting batteries.",
      icon: Zap,
      features: ["Free battery testing", "Premium battery brands", "Same-day service", "24-month warranty"],
      popular: true,
      image: "/car-battery-replacement-service-mechanic-installin.png",
    },
    {
      title: "Car AC Repair",
      description:
        "Complete air conditioning repair and maintenance to keep you comfortable year-round. We diagnose and fix all AC issues with precision and use only genuine parts.",
      icon: Snowflake,
      features: ["AC system diagnosis", "Refrigerant recharge", "Compressor repair", "Leak detection"],
      popular: false,
      image: "/car-air-conditioning-repair-mechanic-working-on-ac.png",
    },
    {
      title: "Oil Change Service",
      description:
        "Quick and efficient oil change service with high-quality motor oils and filters. Keep your engine running smoothly with our comprehensive maintenance service.",
      icon: Droplets,
      features: ["Synthetic oil options", "Filter replacement", "Fluid top-up", "Multi-point inspection"],
      popular: false,
      image: "/car-oil-change-service-mechanic-changing-motor-oil.png",
    },
    {
      title: "Tyre Change",
      description:
        "Professional tire installation and balancing service for optimal performance and safety. We ensure proper alignment and pressure for maximum tire life.",
      icon: Disc,
      features: ["Tire mounting", "Wheel balancing", "Pressure check", "Alignment service"],
      popular: false,
      image: "/tire-change-service-mechanic-installing-new-tires.png",
    },
    {
      title: "Brake Pads Replacement",
      description:
        "Safety-first brake service with premium brake pads and comprehensive brake system inspection. Your safety is our top priority with every brake service.",
      icon: Square,
      features: ["Brake inspection", "Premium brake pads", "Rotor resurfacing", "Brake fluid check"],
      popular: false,
      image: "/brake-pads-replacement-mechanic-working-on-car-bra.png",
    },
    {
      title: "Jumpstart Service",
      description:
        "Emergency jumpstart service available 24/7 to get you back on the road quickly. Our mobile technicians reach you wherever you are, anytime.",
      icon: Battery,
      features: ["24/7 availability", "Mobile service", "Battery testing", "Emergency assistance"],
      popular: false,
      image: "/car-jumpstart-service-emergency-roadside-assistanc.png",
    },
  ]

  return (
    <section id="services" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/10 to-background"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-8 shadow-lg">
            <Wrench className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-5xl lg:text-7xl font-serif font-bold text-foreground mb-8 leading-tight">
            Our Expert{" "}
            <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Professional automotive services with experienced technicians, premium parts, and guaranteed satisfaction
            for all your vehicle needs.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-primary via-accent to-primary mx-auto mt-10 rounded-full"></div>
        </div>

        <div className="space-y-24">
          {services.map((service, index) => {
            const IconComponent = service.icon
            const isEven = index % 2 === 0

            return (
              <div
                key={index}
                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 lg:gap-16`}
              >
                {/* Text Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center shadow-lg">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    {service.popular && (
                      <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold">
                        Most Popular
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Content */}
                <div className="flex-1">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative bg-card rounded-3xl overflow-hidden shadow-2xl border border-border/50 group-hover:shadow-3xl transition-all duration-500">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        className="w-full h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-24">
          <div className="bg-gradient-to-br from-card to-muted/20 rounded-3xl p-12 border border-border/50 shadow-2xl backdrop-blur-sm">
            <h3 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6">
              Need a Custom Service Package?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Contact our experts for personalized automotive solutions tailored to your specific needs and budget.
              We're here to keep your vehicle running at its best.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Get Custom Quote
              </button>
              <button className="border-2 border-primary text-primary px-10 py-4 rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                Call Now: (555) 123-4567
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
