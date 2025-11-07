import Breadcrumb from "@/components/Common/Breadcrumb";
import NotFound from "@/components/NotFound/NotFound"
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "404 Page",
};
export default function ErrorPage() {
    return(
        <main className="w-full min-h-screen flex flex-col items-center  bg-background dark:bg-foreground">
        <Breadcrumb pageName="404 — Page Not Found" />
        <NotFound />
        </main>
    )
};
