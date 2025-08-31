import Link from "next/link";
import { Fragment_Mono } from "next/font/google";
const fragmentMono = Fragment_Mono({ subsets: ["latin"], weight: "400" });

export default function StartBtn() {
  return (
    <Link
      className="bg-[#203b14] text-white inline-flex items-center justify-center whitespace-nowrap rounded-[20px] cursor-pointer transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 atlas-web-mono shrink-0 h-10 px-6 gap-3  hover:bg-[#344B27] disabled:bg-[#EFF2E8] disabled:text-[#97A186] ring-offset-[#203B14] focus-visible:ring-[#203B14] plausible-event-name--signup"
      href="https://app.adaline.ai/sign-up?utm_source=adaline.ai"
      rel="noopener noreferrer"
    >
      <p
        className={`${fragmentMono.className} text-sm leading-tight tracking-wide hover:cursor-pointer`}
      >
        START FOR FREE
      </p>
    </Link>
  );
}
