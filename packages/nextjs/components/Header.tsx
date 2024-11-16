"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowTrendingUpIcon,
  Bars3Icon,
  BugAntIcon,
  ChartBarIcon,
  ChartBarSquareIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },

  // {
  //   label: "Debug Contracts",
  //   href: "/debug",
  //   icon: <BugAntIcon className="h-4 w-4" />,
  // },

  {
    label: "Oracle",
    href: "/oracle",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const pathname = usePathname();
  const [totalValue, setTotalValue] = useState<string>("0");

  const { data: contract } = useScaffoldContract({
    contractName: "OracleDataReader",
  });

  // Fetch BTC price for header display
  useEffect(() => {
    const fetchBTCPrice = async () => {
      if (!contract) return;
      try {
        const prices = await contract.read.getBtcUsdPrice();
        const btcPrice = Number(prices.toString()) / Math.pow(10, 18);
        setTotalValue(
          btcPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        );
      } catch (error) {
        console.error("Error fetching BTC price:", error);
      }
    };

    fetchBTCPrice();
    const interval = setInterval(fetchBTCPrice, 30000);
    return () => clearInterval(interval);
  }, [contract]);

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">BlockSense</span>
            <span className="text-xs">Oracle Network</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <NavLinks pathname={pathname} />
        </ul>
      </div>
      <div className="navbar-end  flex-grow mr-4">
        <div className="flex items-center gap-4">
          <div className="bg-base-200 hidden md:block rounded-lg px-3 py-1">
            <span className="text-sm mr-2">BTC/USD:</span>
            <span className="font-bold">${totalValue}</span>
          </div>
          <RainbowKitCustomConnectButton />
          <FaucetButton />
        </div>
      </div>
    </div>
  );
};

const NavLinks = ({ pathname }: { pathname: string }) => {
  return (
    <>
      <li>
        <Link href="/" className={`${pathname === "/" ? "bg-secondary" : ""} flex items-center gap-2`}>
          <HomeIcon className="h-4 w-4" />
          <span>Home</span>
        </Link>
      </li>
      <li>
        <Link
          href="/trading-simulator"
          className={`${pathname === "/trading-simulator" ? "bg-secondary" : ""} flex items-center gap-2`}
        >
          <ArrowTrendingUpIcon className="h-4 w-4" />
          <span>Trading Simulator</span>
        </Link>
      </li>
      <li>
        <Link href="/oracle" className={`${pathname === "/oracle" ? "bg-secondary" : ""} flex items-center gap-2`}>
          <ChartBarIcon className="h-4 w-4" />
          <span>Price Feeds</span>
        </Link>
      </li>
      <li>
        <Link
          href="/advanced-features"
          className={`${pathname === "/advanced-features" ? "bg-secondary" : ""} flex items-center gap-2`}
        >
          <ChartBarSquareIcon className="h-4 w-4" />
          <span>Advanced Features</span>
        </Link>
      </li>
      {/* <li>
        <Link href="/debug" className={`${pathname === "/debug" ? "bg-secondary" : ""} flex items-center gap-2`}>
          <span>Debug</span>
        </Link>
      </li> */}
    </>
  );
};
