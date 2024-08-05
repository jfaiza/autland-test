import React, { useEffect } from "react";
import LayoutLoader from "@/components/layout-loader";

const Modal = ({
  isOpen,
  onClose,
  error = false,
  loading = false,
  success = false,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="">
        {loading ? (
          <LayoutLoader />
        ) : (
          <div>
            {error ? (
              <div className="bg-slate-600 p-4 w-[600px] h-[200px] rounded shadow-lg">
                <div className="text-success font-bold mt-4  text-[15px] leading-normal ">
                  {children}
                </div>
                <div className="flex w-full ml-56">
                  <button
                    onClick={onClose}
                    className=" cursor-pointer items-center h-[35px] mt-4 w-[100px]  bg-warning border-spacing-1 font-bold text-red-900 text-mauve11 hover:bg-mauve5  rounded-[4px]"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-600 p-2 w-[235px] h-[120px] rounded shadow-lg">
                <div className="text-info font-bold mt-4 ml-2 text-[15px] leading-normal ">
                  {children}
                </div>
                <div className="flex w-full ml-16">
                  <button
                    onClick={onClose}
                    className="items-center h-[35px] mt-4 w-[100px]   cursor-pointer bg-blue-400 border-spacing-1 font-bold text-white  rounded-[4px]"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose}
        ></div>
      </div>
    </div>
  );
};

export default Modal;
