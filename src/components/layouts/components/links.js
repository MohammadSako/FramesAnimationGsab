import { Fragment_Mono } from "next/font/google";
const fragmentMono = Fragment_Mono({ subsets: ["latin"], weight: "400" });

export default function Links() {
  const navigation = [
    { name: "PRODUCTS", href: "https://www.adaline.ai/" },
    { name: "PRICING", href: "https://www.adaline.ai/pricing" },
    { name: "BLOG", href: "#https://www.adaline.ai/blog" },
  ];

  return (
    <div className="flex flex-1 items-center gap-10 lg:gap-12">
      {navigation.map((item) => (
        <a
          href={item.href}
          key={item.name}
          className={`${fragmentMono.className} text-[14px] tracking-[.02em] leading-[14px] flex items-center gap-1 cursor-default text-[#0a1d08]`}
        >
          {item.name}
          {item.name === "PRODUCTS" && (
            <div className="-mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-chevron-down"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </div>
          )}
        </a>
      ))}
    </div>
  );
}
