import MainLayout from "./main-layout";
import { GoogleAnalytics } from '@next/third-parties/google';

const layout = async ({ children }) => {
  return (
    <>
      <MainLayout>{children}</MainLayout>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_ANALYTICS_ID} />
    </>
  );
};

export default layout;
