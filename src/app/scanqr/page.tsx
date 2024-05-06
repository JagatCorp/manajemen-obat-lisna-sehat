"use client";
import Link from "next/link";
import React, { useState } from "react";
import QrReader from "modern-react-qr-reader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
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
      setScanResult(data); // Update the state with the scanned data
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
      <div className=" inset-0 left-0 top-0 z-50 flex  items-center justify-center overflow-y-scroll bg-green-100 bg-cover">
        {/* Container for the QR code scanner */}
        {/* <div className="absolute inset-0 bg-gradient-to-tl from-indigo-600 to-green-600 opacity-80 "></div> */}
        <div className="border-gray-900 bg-gray-900 relative flex h-4/6 w-64 flex-col items-center justify-center overflow-hidden rounded-3xl border-8  bg-cover bg-no-repeat shadow-2xl sm:h-3/5 lg:w-1/2">
          <div className="absolute inset-0 bg-black opacity-60 "></div>
          <div className="camera absolute top-4">{/* Camera container */}</div>
          <div className="text-gray-50 absolute top-7 z-10 mb-2 flex w-full flex-row items-center justify-between px-2">
            {/* Back button */}
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
              </svg>
            </Link>
            <span className="text-sm">QR Code</span>
          </div>
          <div className="z-10 mt-10 w-45 rounded-3xl text-center lg:w-90">
            <div style={{ width: "100%", height: "100%" }}>
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
            <p className="text-gray-300 mt-3 text-xs">{scanResult}</p> {/* Display the scanned result */}
            <p className="text-gray-300 mt-3 text-xs">Scan a QR Code</p> {/* Prompt message */}
            <div className="absolute bottom-0 left-0 my-3 mt-5 flex w-full items-center justify-between space-x-3 px-2">
              {/* Icons for navigating back and forth */}
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

      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">Matches Schedule</h2>
          </div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      nama
                    </th>
                    <th
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Res.
                    </th>
                    <th
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Res.
                    </th>
                    <th
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Away
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm w-2/5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 hidden sm:table-cell">
                          <img className="w-full h-full rounded-full"
                            src="https://images.unsplash.com/photo-1601046668428-94ea13437736?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2167&q=80"
                            alt="" />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">
                            Team 1
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap text-center">0</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap text-center">
                        3
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm w-2/5">
                      <div className="flex items-center float-right">
                        <div className="mr-3">
                          <p className="text-gray-900 whitespace-no-wrap text-right">
                            Team 2
                          </p>
                        </div>
                        <div className="flex-shrink-0 w-10 h-10 hidden sm:table-cell">
                          <img className="w-full h-full rounded-full"
                            src="https://images.unsplash.com/photo-1601046668428-94ea13437736?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2167&q=80"
                            alt="" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm w-2/5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 hidden sm:table-cell">
                          <img className="w-full h-full rounded-full"
                            src="https://images.unsplash.com/photo-1601046668428-94ea13437736?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2167&q=80"
                            alt="" />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">
                            Team 3
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap text-center">0</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap text-center">
                        3
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm w-2/5">
                      <div className="flex items-center float-right">
                        <div className="mr-3">
                          <p className="text-gray-900 whitespace-no-wrap text-right">
                            Team 4
                          </p>
                        </div>
                        <div className="flex-shrink-0 w-10 h-10 hidden sm:table-cell">
                          <img className="w-full h-full rounded-full"
                            src="https://images.unsplash.com/photo-1601046668428-94ea13437736?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2167&q=80"
                            alt="" />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};
export default ScanQR;
