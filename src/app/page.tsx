import { Hero } from "@/components/Hero";
import { Mechanic } from "@/components/Mechanic";
import { Marks } from "@/components/Marks";
import { Ledger } from "@/components/Ledger";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";

/*
 * One page. The box is the product; everything below it exists to explain
 * what the object at the top is doing and to prove that none of it has been
 * filled in ahead of time.
 */
export default function Home() {
  return (
    <div id="top">
      <Hero />
      <Mechanic />
      <Marks />
      <Ledger />
      <Faq />
      <Footer />
    </div>
  );
}
