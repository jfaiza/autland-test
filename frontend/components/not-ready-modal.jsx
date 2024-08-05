"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogOverlay,
  AlertDialogPortal,
} from "@radix-ui/react-alert-dialog";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export default function StakingModal() {
  const [isOpen, setIsOpen] = useState(true); // Initially open the modal

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="modal" style={{ display: isOpen ? "block" : "none" }}>
      <AlertDialog open={isOpen}>
        <AlertDialogPortal>
          <AlertDialogOverlay className="data-[state=open]:animate-overlayShow fixed inset-0" />
          <AlertDialogContent className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[300px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[9px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <AlertDialogDescription className="text-success font-bold mt-4 mb-5 text-[15px] leading-normal flex justify-center">
              Upcoming feature!
            </AlertDialogDescription>
            <div className="flex justify-center gap-[25px]">
              <AlertDialogCancel asChild>
                <a className="bg-warning border-spacing-1 font-bold text-primary-200 hover:text-primary-700 text-mauve11 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px]  leading-none outline-none focus:shadow-[0_0_0_2px]"
                href="/"
                >
                  Ok
                </a>
              </AlertDialogCancel>
            </div>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
}