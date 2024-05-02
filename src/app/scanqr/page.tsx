"use client";
import Link from "next/link";
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
declare module "react-qr-reader" {
  export interface QrReaderProps {
    delay?: number;
    onError?: (error: any) => void;
    onScan?: (data: string | null) => void;
    facingMode?: "environment";
  }
}

const ScanQR: React.FC = () => {
  const delay: number = 300;
  const [scanResult, setScanResult] = useState<string>("");

  const handleScan = (data: string | null) => {
    if (data) {
      console.log(data);
      setScanResult(data);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  return (
    <div className="min-w-screen fixed inset-0 left-0 top-0 z-50 flex h-screen items-center justify-center overflow-y-scroll bg-green-100 bg-cover">
      <div className="absolute inset-0 bg-gradient-to-tl from-indigo-600 to-green-600 opacity-80 "></div>
      <div className="border-gray-900 bg-gray-900 relative flex h-4/6 w-64 flex-col items-center justify-center overflow-hidden rounded-3xl border-8  bg-cover bg-no-repeat shadow-2xl sm:h-3/5 lg:w-1/2">
        <div className="absolute inset-0 bg-black opacity-60 "></div>
        <div className="camera absolute top-4"></div>
        <div className="text-gray-50 absolute top-7 z-10 mb-2 flex w-full flex-row items-center justify-between px-2">
          <div className="flex flex-row items-center ">
            <Link href="/scanqr">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="hover:bg-gray-500 text-gray-50 mr-3 h-8 w-8 cursor-pointer rounded-full p-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>{" "}
            </Link>
            <span className="text-sm">QR Code</span>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="hover:bg-gray-500 text-gray-50 h-8 w-8 cursor-pointer rounded-full p-2 "
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
        <div className="z-10 mt-10 w-45 rounded-3xl text-center lg:w-90">
          <div style={{ width: "100%", height: "100%" }}>
            <QrReader
              delay={delay as any}
              onError={handleError}
              onScan={handleScan}
              // untuk kamera depan di ponsel
              // facingMode="user"
              // camera belakang
              facingMode="environment"
            />
          </div>
          <p className="text-gray-300 mt-3 text-xs">Scan a QR Code</p>
          <div className="absolute bottom-0 left-0 my-3 mt-5 flex w-full items-center justify-between space-x-3 px-2">
            <div className="flex ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="hover:bg-gray-600 text-gray-50 h-8 w-8 cursor-pointer rounded-full p-2 "
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div className="ml-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="hover:bg-gray-600 text-gray-50 h-8 w-8 cursor-pointer rounded-full p-2 "
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
