import Header from "../components/header"
import Hero from "../components/hero"
import About from "../components/about"
import Services from "../components/services"
import BatteryBrands from "../components/battery-brands"
import Testimonials from "../components/testimonials"
import CallToAction from "../components/call-to-action"
import Contact from "../components/contact"
import Footer from "../components/footer"
import FloatingContact from "../components/floating-contact"

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Pro Auto Care",
  image: "/black-sports-car-red-lighting.png",
  description:
    "Pro Auto Care provides car battery replacement, AC repair, maintenance, and emergency roadside assistance in Abu Dhabi.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.proautocare.co",
  telephone: "+971567304650",
  email: "proautocarep@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abu Dhabi",
    addressCountry: "AE",
  },
  areaServed: "Abu Dhabi",
  priceRange: "$$",
  openingHours: "Mo-Su 00:00-23:59",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Automotive Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Car Battery Replacement" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Car AC Repair" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Emergency Roadside Assistance" } },
    ],
  },
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Pro Auto Care",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.proautocare.co",
  description:
    "Pro Auto Care offers car battery replacement, AC repair, and automotive maintenance services in Abu Dhabi.",
  inLanguage: "en-AE",
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <main className="min-h-screen bg-black relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-red-500/5 to-transparent rounded-full animate-spin-slow"></div>
        </div>

        <div className="relative z-10">
          <Header />
          <Hero />
          <Services />
          <BatteryBrands />
          <About />
          <Testimonials />
          <CallToAction />
          <Contact />
          <Footer />
        </div>

        <FloatingContact />
      </main>
    </>
  )
}
