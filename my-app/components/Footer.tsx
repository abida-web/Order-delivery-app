import Link from "next/link";
import React from "react";
import Image from "next/image";

const Footer = () => {
  const navItems = [
    { name: "about", path: "/about" },
    { name: "services", path: "/services" },
    { name: "faq", path: "/faq" },
    { name: "support", path: "/support" },
  ];

  return (
    <footer className="flex flex-wrap items-center justify-between gap-5 px-8  backdrop-blur-2xl mt-10 bg-black/40 rounded-t-2xl shadow-2xl shadow-yellow-500">
      <div className="relative h-20 w-16 md:h-20 md:w-20">
        <Image
          src="/logo.png"
          alt="Logo"
          fill
          className="object-contain"
          priority={false}
        />
      </div>

      <nav className="flex flex-wrap gap-4 md:gap-6">
        {navItems.map((item, i) => (
          <Link
            key={i}
            href={item.path}
            className="text-sm font-medium text-white/80 transition-colors hover:text-yellow-500 hover:scale-105 md:text-base"
          >
            {item.name.toUpperCase()}
          </Link>
        ))}
      </nav>

      <div className="text-xs text-white/60">
        © {new Date().getFullYear()} X.Co
      </div>
    </footer>
  );
};

export default Footer;
