import Link from "next/link";
import React from "react";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FaRegCopyright, FaWhatsapp } from "react-icons/fa6";

function Footer() {
  return (
    <>
      <div className="w-full  sm:p p-4 z-10 bg-white">
        <div
          style={{
            backgroundColor: "#c1c1c1",
            height: 1,
            width: "100%",
          }}
        />
        <footer className="flex sm:flex-row flex-col font-sans text-lg font-thin tracking-tight text-gray-400 justify-between my-10 gap-y-10 lg:mx-10">
          <div className="flex lg:flex-row flex-col xl:basis-3/5 sm:basis-4/5 lg:space-x-8">
            <div className="flex flex-row gap-1">
              <div className="flex mt-2">
                <FaRegCopyright size={14} />
              </div>
              <div>
                <p>Mohammad Murad 2025</p>
              </div>
            </div>
            <div>
              <p>SAKOAI Agency</p>
            </div>
            <div>
              <p>
                <span className="text-gray-400 mt-2 font-semibold">Tel:</span>{" "}
                (+962) 777 277 673
              </p>
            </div>
          </div>
          <div className="flex flex-row space-x-10 justify-end sm:basis-1/5">
            <FooterLink
              icon={<FaLinkedinIn size={25} />}
              href="https://linkedin.com/in/mohammad-murad-850b9970"
            />
            <FooterLink
              icon={<FaGithub size={25} />}
              href="https://github.com/mohammadsako"
            />
            <FooterLink
              icon={<FaWhatsapp size={25} />}
              href="https://wa.me/962777277673"
            />
          </div>
        </footer>
      </div>
    </>
  );
}
export default Footer;

const FooterLink = ({ icon, href }) => {
  return (
    <Link href={href ?? "/"} target="_blank" rel="noopener noreferrer">
      <div className="text-gray-400 hover:text-gray-600">{icon}</div>
    </Link>
  );
};
