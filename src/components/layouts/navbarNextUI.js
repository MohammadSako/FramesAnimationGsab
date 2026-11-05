"use client";

import { memo, useEffect, useRef, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@heroui/react";
import Logo from "./components/logo";
import WatchBtn from "./components/watchBtn";
import StartBtn from "./components/startBtn";
import Links from "./components/links";

function NavbarNextUI() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);

  const navigation = [
    { name: "Products", href: "https://www.adaline.ai/" },
    { name: "Pricing", href: "https://www.adaline.ai/pricing" },
    { name: "Blog", href: "#https://www.adaline.ai/blog" },
  ];

  // Fade out on scroll. Writes the style directly (rAF-throttled) instead of
  // re-rendering the whole navbar on every scroll event.
  useEffect(() => {
    let raf = 0;
    const maxScroll = 500; // how many px until fully hidden
    const update = () => {
      raf = 0;
      if (navRef.current) {
        const opacity = Math.max(0, 1 - window.scrollY / maxScroll);
        navRef.current.style.opacity = String(opacity);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Navbar
      ref={navRef}
      maxWidth="full"
      isBlurred={false} // remove default frosted glass
      className={`fixed transition-opacity duration-300 md:pe-[48px] md:ps-[48px] pe-[16px] ps-[16px]`}
      classNames={{
        base: "bg-transparent shadow-none lg:h-16 h-12", // root container
        wrapper: "bg-transparent px-0", // inner wrapper
        content: "bg-transparent", // content slot
        menu: "bg-transparent shadow-none", // mobile menu panel
        menuItem: "bg-transparent", // mobile menu item
      }}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="hidden lg:flex gap-10">
        <Links />
      </NavbarContent>

      <NavbarContent justify="center">
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        <NavbarItem className="hidden xs:flex">
          <WatchBtn />
        </NavbarItem>
        <NavbarItem>
          <StartBtn />
        </NavbarItem>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden"
        />
      </NavbarContent>

      <NavbarMenu className="max-h-[450px] bg-[#F5F2EB]">
        {navigation.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "primary"
                  : index === navigation.length - 1
                  ? "danger"
                  : "foreground"
              }
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default memo(NavbarNextUI);
