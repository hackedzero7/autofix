import { Zap, Snowflake, Droplets, Disc, Square, Battery, Search, Sparkles, Truck, Wrench } from "lucide-react"

export default function Services() {
  const services = [
    {
      title: "Car Battery Replacement",
      description: "Professional battery replacement with premium brands and instant installation service.",
      icon: Zap,
      features: ["Free battery testing", "Premium battery brands", "Same-day service", "24-month warranty"],
      price: "From $89",
      popular: true,
    },
    {
      title: "Car AC Repair",
      description: "Complete air conditioning repair and maintenance to keep you comfortable year-round.",
      icon: Snowflake,
      features: ["AC system diagnosis", "Refrigerant recharge", "Compressor repair", "Leak detection"],
      price: "From $120",
      popular: false,
    },
    {
      title: "Oil Change Service",
      description: "Quick and efficient oil change service with high-quality motor oils and filters.",
      icon: Droplets,
      features: ["Synthetic oil options", "Filter replacement", "Fluid top-up", "Multi-point inspection"],
      price: "From $45",
      popular: false,
    },
    {
      title: "Tyre Change",
      description: "Professional tire installation and balancing service for optimal performance and safety.",
      icon: Disc,
      features: ["Tire mounting", "Wheel balancing", "Pressure check", "Alignment service"],
      price: "From $25",
      popular: false,
    },
    {
      title: "Brake Pads Replacement",
      description: "Safety-first brake service with premium brake pads and comprehensive brake system inspection.",
      icon: Square,
      features: ["Brake inspection", "Premium brake pads", "Rotor resurfacing", "Brake fluid check"],
      price: "From $150",
      popular: false,
    },
    {
      title: "Jumpstart Service",
      description: "Emergency jumpstart service available 24/7 to get you back on the road quickly.",
      icon: Battery,
      features: ["24/7 availability", "Mobile service", "Battery testing", "Emergency assistance"],
      price: "From $35",
      popular: false,
    },
    {
      title: "Car Inspection",
      description: "Comprehensive vehicle inspection service to ensure your car meets safety standards.",
      icon: Search,
      features: ["Safety inspection", "Emissions testing", "Digital report", "Compliance certificate"],
      price: "From $75",
      popular: false,
    },
    {
      title: "Car Wash & Detailing",
      description: "Premium car wash and detailing services to keep your vehicle looking pristine.",
      icon: Sparkles,
      features: ["Interior cleaning", "Exterior wash", "Wax protection", "Paint correction"],
      price: "From $60",
      popular: false,
    },
    {
      title: "Car Recovery",
      description: "Professional towing and recovery service available 24/7 for emergency situations.",
      icon: Truck,
      features: ["24/7 towing", "Roadside assistance", "Accident recovery", "Safe transport"],
      price: "From $95",
      popular: false,
    },
  ]

  return (
    <section id="services" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
            <Wrench className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
            Our Expert <span className="text-primary">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Professional automotive services with experienced technicians, premium parts, and guaranteed satisfaction
            for all your vehicle needs.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-8 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div
                key={index}
                className={`group relative bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-primary/50 transform hover:-translate-y-2 ${
                  service.popular ? "ring-2 ring-primary/50 bg-gradient-to-br from-card to-primary/5" : ""
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-serif font-bold text-card-foreground group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <span className="text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {service.price}
                  </span>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>

                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105">
                  Book Service
                </button>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
            <h3 className="text-3xl font-serif font-bold text-foreground mb-4">Need a Custom Service Package?</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact our experts for personalized automotive solutions tailored to your specific needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105">
                Get Custom Quote
              </button>
              <button className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                Call Now: (555) 123-4567
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
