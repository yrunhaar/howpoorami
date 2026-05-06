import HomeClient from "@/components/HomeClient";
import HowToJsonLd from "@/components/HowToJsonLd";

export default function Home() {
  return (
    <>
      <HowToJsonLd
        name="Calculate your wealth percentile"
        description="A free calculator that takes your country and net worth (or income with refinement factors) and returns the exact percentile of where you stand in your country's wealth distribution, with comparison to the top 1%, top 10%, and bottom 50%."
        url="/"
        steps={[
          { name: "Pick your country", text: "Select your country so the calculator can pull the right WID.world wealth distribution and currency conventions for your market." },
          { name: "Enter your net worth", text: "Enter total assets minus total liabilities in local currency. Use the refinement panel for an income-based estimate if you do not know your net worth precisely." },
          { name: "See your percentile", text: "The calculator computes the exact percentile against your country's distribution, then contextualizes it against population shares, top 1% / 10% thresholds, and the global wealth gap." },
        ]}
      />
      <HomeClient />
    </>
  );
}
