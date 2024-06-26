
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Dashboard from "./dashboard/page";

export const metadata: Metadata = {
  title:
    "Lisna Sehat",
  description: "Klinik Lisna Sehat",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <>
          <Dashboard />
        </>
      </DefaultLayout>
    </>
  );
}
