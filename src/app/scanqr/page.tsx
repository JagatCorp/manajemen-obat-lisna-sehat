"use client";
import Link from "next/link";
import React, { useState } from "react";
import QrReader from "modern-react-qr-reader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DetailQr from "./DetailQr";
// declare module "modern-react-qr-re ader" {
//   export interface QrReaderProps {
//     delay?: number;
//     onError?: (error: any) => void;
//     onScan?: (data: string | null) => void;
//     facingMode?: "user" | "environment";
//     constraints?: any;
//   }
// }


const ScanQR: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null); // State to store the scanned result

  /**
   * Handles the scanned QR code data.
   * @param data The scanned data or null if no data is scanned.
   */
  const handleScan = (data: string | null) => {
    if (data) {
      console.log(data); // Log the scanned data
      setScanResult(JSON.parse(data)); // Update the state with the scanned data
      const modalQr = document.getElementById("modalQr");
      if (modalQr instanceof HTMLDialogElement) {
        modalQr.show();
      }
    }
  };

  /**
   * Handles the QR code scanning error.
   * @param error The error object.
   */
  const handleError = (error: any) => {
    console.error(error); // Log the error
  };

  return (

    <DefaultLayout>
      <div className="inset-0 left-0 top-0 z-50 flex items-center justify-center  bg-cover">
        {/* Container for the QR code scanner */}
        <div className="border-gray-900 bg-gray-900 relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border-8 bg-cover bg-no-repeat shadow-2xl sm:h-3/5 lg:w-1/2" style={{ width: "400px", height: "400px" }}>
          <div className="z-0 mt-10 rounded-3xl w-68">
            <div style={{ width: "380px", height: "420px" }}>
              {/* QR code scanner component */}
              <QrReader
                delay={300} // Delay between scanning attempts
                onError={handleError} // Handler for scanning errors
                onScan={handleScan} // Handler for scanned data
                // kamera depan
                facingMode="user" // Use back camera by default
              // kamera belakang
              //  facingMode="environment" // Use front camera by default
              />
            </div>
            <div className="absolute bottom-0 left-0 my-3 mt-5 flex w-full items-center justify-between space-x-3 px-2">
              <div>LISNA SEHAT SCAN QR</div>
            </div>
          </div>
        </div>
        {scanResult && (
          <div className="h-screen">
            <DetailQr idModal={"modalQr"} data={scanResult} />
          </div>
        )}
      </div>

    </DefaultLayout>
  );
};
export default ScanQR;
