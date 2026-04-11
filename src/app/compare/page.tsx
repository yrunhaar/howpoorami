import { Suspense } from "react";
import CompareClient from "@/components/CompareClient";

export default function ComparePage() {
  return (
    <Suspense>
      <CompareClient />
    </Suspense>
  );
}
