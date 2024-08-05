"use client";
import React from "react";
import { cn } from "@/lib/utils";
import ThemeButton from "./theme-button";
import { useSidebar, useThemeStore } from "@/store";
import ProfileInfo from "./profile-info";
import VerticalHeader from "./vertical-header";
import HorizontalHeader from "./horizontal-header";
import Inbox from "./inbox";
import HorizontalMenu from "./horizontal-menu";
import NotificationMessage from "./notification-message";
import { MetamaskIcon } from "@/components/svg";
import Language from "./language";
import { useMediaQuery } from "@/hooks/use-media-query";
import MobileMenuHandler from "./mobile-menu-handler";
import ClassicHeader from "./layout/classic-header";
import FullScreen from "./full-screen";
import { Button } from "@/components/ui/button";
import ChainSelector  from "@/components/chain-selector";
// import WalletConnect from '@/components/WalletConnect';
import { useAccount } from 'wagmi'
import { Account } from '@/components/account'
import { WalletOptions } from '@/components/wallet-options'

// TODO
const NavTools = ({ isDesktop, isMobile, sidebarType }) => {
  function ConnectWallet() {
    const { isConnected } = useAccount()
    if (isConnected) return <Account />
    return <WalletOptions />
  }
  return (
    <div className="nav-tools flex items-center  gap-2">
      {/* {isDesktop && <Language />} */}
      {/* {isDesktop && <FullScreen />} */}

      <ThemeButton />
      {/* <Inbox /> */}
      {/* <NotificationMessage /> */}
        <ChainSelector /> 

      <div className=" pl-2">
      {/* <WalletConnect /> */}
      <ConnectWallet />

        {/* TODO: add profile info */}
        {/* <ProfileInfo /> */}
      </div>
      {!isDesktop && sidebarType !== "module" && <MobileMenuHandler />}
    </div>
  );
};
const Header = ({ handleOpenSearch }) => {
  const { collapsed, sidebarType, setCollapsed, subMenu, setSidebarType } =
    useSidebar();
  const { layout, navbarType, setLayout } = useThemeStore();

  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const isMobile = useMediaQuery("(min-width: 768px)");

  // set header style to classic if isDesktop
  React.useEffect(() => {
    if (!isDesktop && layout === "horizontal") {
      setSidebarType("classic");
    }
  }, [isDesktop]);

  // if horizontal layout
  if (layout === "horizontal" && navbarType !== "hidden") {
    return (
      <ClassicHeader
        className={cn(" ", {
          "sticky top-0 z-50": navbarType === "sticky",
        })}
      >
        <div className="w-full bg-card/90 backdrop-blur-lg md:px-6 px-[15px] py-3 border-b">
          <div className="flex justify-between items-center h-full">
            <HorizontalHeader handleOpenSearch={handleOpenSearch} />
            <NavTools
              isDesktop={isDesktop}
              isMobile={isMobile}
              sidebarType={sidebarType}
            />
          </div>
        </div>
        {isDesktop && (
          <div className=" bg-card bg-card/90 backdrop-blur-lg  w-full px-6  shadow-md">
            <HorizontalMenu />
          </div>
        )}
      </ClassicHeader>
    );
  }
  if (layout === "semibox" && navbarType !== "hidden") {
    return (
      <ClassicHeader
        className={cn("  has-sticky-header rounded-md   ", {
          "xl:ml-[72px]": collapsed,
          "xl:ml-[272px]": !collapsed,
          "sticky top-6": navbarType === "sticky",
        })}
      >
        <div className={cn("xl:mx-20 mx-4")}>
          <div className="w-full bg-card/90 backdrop-blur-lg md:px-6 px-[15px] py-3 rounded-md my-6 shadow-md border-b">
            <div className="flex justify-between items-center h-full">
              <VerticalHeader
                sidebarType={sidebarType}
                handleOpenSearch={handleOpenSearch}
              />
              <NavTools
                isDesktop={isDesktop}
                isMobile={isMobile}
                sidebarType={sidebarType}
              />
            </div>
          </div>
        </div>
      </ClassicHeader>
    );
  }
  // TODO nav bar header
  if (
    sidebarType !== "module" &&
    navbarType !== "floating" &&
    navbarType !== "hidden"
  ) {
    return (
      // <Web3Provider>
        <ClassicHeader
          className={cn("", {
            "xl:ml-[210px]": !collapsed,
            "xl:ml-[72px]": collapsed,
            "sticky top-0": navbarType === "sticky",
          })}
        >
          <div className="w-full bg-card/90 backdrop-blur-lg md:px-6 px-[15px] py-3 border-b">
            <div className="flex justify-between items-center h-full">
              <VerticalHeader
                sidebarType={sidebarType}
                handleOpenSearch={handleOpenSearch}
              />
              <NavTools
                isDesktop={isDesktop}
                isMobile={isMobile}
                sidebarType={sidebarType}
              />
            </div>
          </div>
        </ClassicHeader>
      // </Web3Provider>

    );
  }
  if (navbarType === "hidden") {
    return null;
  }
  if (navbarType === "floating") {
    return (
      <ClassicHeader
        className={cn("  has-sticky-header rounded-md sticky top-6  px-6  ", {
          "ml-[72px]": collapsed,
          "xl:ml-[300px] ": !collapsed && sidebarType === "module",
          "xl:ml-[248px] ": !collapsed && sidebarType !== "module",
        })}
      >
        <div className="w-full bg-card/90 backdrop-blur-lg md:px-6 px-[15px] py-3 rounded-md my-6 shadow-md border-b">
          <div className="flex justify-between items-center h-full">
            <VerticalHeader
              sidebarType={sidebarType}
              handleOpenSearch={handleOpenSearch}
            />
            <NavTools
              isDesktop={isDesktop}
              isMobile={isMobile}
              sidebarType={sidebarType}
            />
          </div>
        </div>
      </ClassicHeader>
    );
  }

  return (
    <ClassicHeader
      className={cn("", {
        "xl:ml-[300px]": !collapsed,
        "xl:ml-[72px]": collapsed,
        "sticky top-0": navbarType === "sticky",
      })}
    >
      <div className="w-full bg-card/90 backdrop-blur-lg md:px-6 px-[15px] py-3 border-b">
        <div className="flex justify-between items-center h-full">
          <VerticalHeader
            sidebarType={sidebarType}
            handleOpenSearch={handleOpenSearch}
          />
          <NavTools
            isDesktop={isDesktop}
            isMobile={isMobile}
            sidebarType={sidebarType}
          />
        </div>
      </div>
    </ClassicHeader>
  );
};

export default Header;
