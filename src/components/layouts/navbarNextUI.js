"use client";

import { useState } from "react";
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

export default function NavbarNextUI() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Products", href: "https://www.adaline.ai/" },
    { name: "Pricing", href: "https://www.adaline.ai/pricing" },
    { name: "Blog", href: "#https://www.adaline.ai/blog" },
  ];

  return (
    <Navbar
      maxWidth=""
      isBlurred={false} // remove default frosted glass
      className="px-4 bg-transparent fixed"
      classNames={{
        base: "bg-transparent shadow-none", // root container
        wrapper: "bg-transparent", // inner wrapper
        content: "bg-transparent", // content slot
        menu: "bg-transparent shadow-none", // mobile menu panel
        menuItem: "bg-transparent", // mobile menu item
      }}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="hidden sm:flex gap-10">
        <Links />
      </NavbarContent>

      <NavbarContent justify="center">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <WatchBtn />
        </NavbarItem>
        <NavbarItem>
          <StartBtn />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
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
