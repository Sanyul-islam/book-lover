"use client";

import Link from "next/link";
import { Button, Separator, Input } from "@heroui/react";

import { FaBookOpen, FaFacebook, FaGithub, FaInstagram, FaXTwitter } from "react-icons/fa6";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-default-200 bg-default-50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                className="text-primary"
                width={150}
                height={50}
                src="/navbar-logo.png"
                alt="Book Lover Logo"
              />
              {/* <span className="text-2xl font-bold">Book Lover</span> */}
            </Link>

            <p className="text-default-500 leading-7">
              Discover, borrow, and enjoy thousands of books. Connect with
              readers and librarians from around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>

            <ul className="space-y-3 text-default-500">
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  About
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-primary transition">
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-primary transition"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>

            <p className="text-default-500 mb-4">
              Subscribe to receive book recommendations and reading updates.
            </p>

            <div className="space-y-3">
              <Input type="email" placeholder="Enter your email" radius="lg" />

              <Button color="primary" radius="lg" fullWidth>
                Subscribe
              </Button>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>

            <div className="flex gap-3">
              <Button
                isIconOnly
                variant="flat"
                radius="full"
                className="transition-all duration-300 hover:bg-primary hover:text-black hover:-translate-y-1"
              >
                <FaFacebook size={20} />
              </Button>

              <Button
                isIconOnly
                variant="flat"
                radius="full"
                className="transition-all duration-300 hover:bg-primary hover:text-black hover:-translate-y-1"
              >
                <FaInstagram size={20} />
              </Button>

              <Button
                isIconOnly
                variant="flat"
                radius="full"
                className="transition-all duration-300 hover:bg-primary hover:text-black hover:-translate-y-1"
              >
                <FaXTwitter size={18} />
              </Button>

              <Button
                isIconOnly
                variant="flat"
                radius="full"
                className="transition-all duration-300 hover:bg-primary hover:text-black hover:-translate-y-1"
              >
                <FaGithub size={40} />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-default-500">
          <p>© {new Date().getFullYear()} Book Lover. All rights reserved.</p>

          <div className="flex gap-5">
            <Link href="/about" className="hover:text-primary">
              About
            </Link>

            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>

            <Link href="/privacy-policy" className="hover:text-primary">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
