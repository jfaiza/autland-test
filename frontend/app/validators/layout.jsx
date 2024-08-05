import MainLayout from "./main-layout";
// import { Toaster } from "@/components/ui/toaster";

const layout = async ({ children }) => {
  return (
    <div className="">
      <MainLayout>{children}</MainLayout>
      {/* <Toaster /> */}
    </div>
  );
};

export default layout;
