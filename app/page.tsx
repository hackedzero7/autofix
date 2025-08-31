import Header from "../components/header"
import Hero from "../components/hero"
import About from "../components/about"
import Services from "../components/services"
import Testimonials from "../components/testimonials"
import CallToAction from "../components/call-to-action"
import Contact from "../components/contact"
import Footer from "../components/footer"
import FloatingContact from "../components/floating-contact"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-red-500/5 to-transparent rounded-full animate-spin-slow"></div>
      </div>

      <div className="relative z-10">
        <Header />
        <Hero />
        <About />
        <Services />
        <Testimonials />
        <CallToAction />
        <Contact />
        <Footer />
      </div>

      <FloatingContact />
    </div>
  )
}
