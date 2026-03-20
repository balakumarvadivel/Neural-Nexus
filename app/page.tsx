import { SiteHeader } from "@/components/layout/site-header";
import { PageShell } from "@/components/layout/page-shell";
import { HeroSection } from "@/components/sections/hero";
import { LandingSections } from "@/components/sections/landing-sections";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <PageShell>
        <HeroSection />
        <LandingSections />
      </PageShell>
    </>
  );
}
