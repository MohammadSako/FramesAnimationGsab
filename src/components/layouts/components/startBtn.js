import Link from "next/link";
import { Fragment_Mono } from "next/font/google";
const fragmentMono = Fragment_Mono({ subsets: ["latin"], weight: "400" });

export default function StartBtn() {
  return (
    <Link
    className="inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-[20px] cursor-pointer transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 atlas-web-mono shrink-0 lg:h-10 h-8 lg:px-8 px-6 lg:mr-0 mr-3 bg-[#203b14] text-[#fbfdf6] hover:bg-meadow-[#203b14]/90 disabled:bg-[#eff2e8] disabled:text-[#97a186] ring-offset-[#fbfdf6] focus-visible:ring-[#203b14] plausible-event-name--signup"
      href="#"
      rel="noopener noreferrer"
    >
      <p
        className={`${fragmentMono.className} text-xs leading-tight tracking-wide hover:cursor-pointer`}
      >
        START FOR FREE
      </p>
    </Link>
  );
}
