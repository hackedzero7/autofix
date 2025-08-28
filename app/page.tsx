import Header from "../components/header"
import Hero from "../components/hero"
import About from "../components/about"
import Services from "../components/services"
import Testimonials from "../components/testimonials"
import CallToAction from "../components/call-to-action"
import Contact from "../components/contact"
import Footer from "../components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <CallToAction />
      <Contact />
      <Footer />
    </div>
  )
}
