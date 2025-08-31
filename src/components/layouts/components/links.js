import { Fragment_Mono } from "next/font/google";
const fragmentMono = Fragment_Mono({ subsets: ["latin"], weight: "400" });

export default function Links() {
  const navigation = [
    { name: "PRODUCTS", href: "https://www.adaline.ai/" },
    { name: "PRICING", href: "https://www.adaline.ai/pricing" },
    { name: "BLOG", href: "#https://www.adaline.ai/blog" },
  ];

  return (
    <>
      {navigation.map((item) => (
        <div key={item.name}>
          <p
            className={`${fragmentMono.className} text-sm leading-tight tracking-widest hover:cursor-pointer`}
          >
            {item.name}
          </p>
        </div>
      ))}
    </>
  );
}
