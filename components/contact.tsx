import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle, Zap } from "lucide-react"

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">Get In Touch</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Contact <span className="text-primary">AutoFix Pro</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to get your vehicle back on the road? Contact our expert team for fast, reliable automotive services.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="glass-effect p-8 rounded-2xl border border-border/20">
              <h3 className="text-2xl font-serif font-bold text-foreground mb-6">Get Emergency Service</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">24/7 Emergency Hotline</h4>
                    <p className="text-muted-foreground mb-2">Call us anytime for immediate assistance</p>
                    <a
                      href="tel:+1234567890"
                      className="text-primary font-semibold hover:text-primary/80 transition-colors"
                    >
                      +1 (234) 567-8900
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Email Support</h4>
                    <p className="text-muted-foreground mb-2">Get detailed quotes and information</p>
                    <a
                      href="mailto:info@autofixpro.com"
                      className="text-primary font-semibold hover:text-primary/80 transition-colors"
                    >
                      info@autofixpro.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Service Location</h4>
                    <p className="text-muted-foreground mb-2">We come to you anywhere in the city</p>
                    <p className="text-foreground">Dubai, UAE - Mobile Service</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Service Hours</h4>
                    <p className="text-muted-foreground mb-2">Available 24/7 for emergencies</p>
                    <div className="text-foreground">
                      <p>Mon-Fri: 7:00 AM - 10:00 PM</p>
                      <p>Sat-Sun: 8:00 AM - 8:00 PM</p>
                      <p className="text-primary font-semibold">Emergency: 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-effect p-6 rounded-xl border border-border/20 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">15 Min</h4>
                <p className="text-sm text-muted-foreground">Average Response Time</p>
              </div>
              <div className="glass-effect p-6 rounded-xl border border-border/20 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">100%</h4>
                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-effect p-8 rounded-2xl border border-border/20">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-6">Request Service</h3>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-background/50 border border-border/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 bg-background/50 border border-border/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-background/50 border border-border/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Service Needed</label>
                <select className="w-full px-4 py-3 bg-background/50 border border-border/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300">
                  <option>Select a service</option>
                  <option>Car Battery Replacement</option>
                  <option>AC Repair</option>
                  <option>Oil Change Service</option>
                  <option>Tyre Change</option>
                  <option>Jumpstart Service</option>
                  <option>Car Recovery</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-background/50 border border-border/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  placeholder="Your current location"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-background/50 border border-border/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none"
                  placeholder="Describe your issue or requirements..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-primary/25 animate-glow"
              >
                Request Service Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
