import {
  LandingHeader,
  HeroSection,
  CapabilitiesMarqueeSection,
  DemosSection,
  FeaturesSection,
  WidgetsSection,
  CtaSection,
  LandingFooter,
} from './sections'

export function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <HeroSection />
      <CapabilitiesMarqueeSection />
      <DemosSection />
      <FeaturesSection />
      <WidgetsSection />
      <CtaSection />
      <LandingFooter />
    </div>
  )
}
