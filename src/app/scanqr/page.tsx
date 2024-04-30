"use client";
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const ScanQR: React.FC = () => {
    const [scanResult, setScanResult] = useState<string>('');

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
        <div className="min-w-screen h-screen fixed left-0 top-0 flex justify-center items-center inset-0 z-50 bg-green-100 overflow-y-scroll bg-cover">
            <div className="absolute bg-gradient-to-tl from-indigo-600 to-green-600 opacity-80 inset-0 "></div>
            <div className="relative border-8 overflow-hidden border-gray-900 bg-gray-900 h-4/6 sm:h-3/5 rounded-3xl flex flex-col w-64 lg:w-1/2  justify-center items-center bg-no-repeat bg-cover shadow-2xl">
                <div className="absolute bg-black opacity-60 inset-0 "></div>
                <div className="camera absolute top-4"></div>
                <div className="flex w-full flex-row justify-between items-center mb-2 px-2 text-gray-50 z-10 absolute top-7">
                    <div className="flex flex-row items-center ">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 p-2 cursor-pointer hover:bg-gray-500 text-gray-50 rounded-full mr-3" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg> <span className="text-sm">QR Code</span>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 p-2 cursor-pointer hover:bg-gray-500 text-gray-50 rounded-full " viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"></path>
                        </svg>
                    </div>
                </div>
                <div className="lg:w-90 mt-10 text-center z-10 w-45 rounded-3xl">
                    <div style={{ width: '100%', height: '100%' }}>
                        <QrReader
                            delay={300}
                            onError={handleError}
                            onScan={handleScan}
                            // untuk camera depan di mobile
                            // facingMode="user"
                            className="w-full h-full"
                        />
                    </div>
                    <p className="text-gray-300 text-xs mt-3">Scan a QR Code</p>
                    <div className="mt-5 w-full flex items-center justify-between space-x-3 my-3 absolute bottom-0 left-0 px-2">
                        <div className="flex ">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 p-2 cursor-pointer hover:bg-gray-600 text-gray-50 rounded-full "
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd"
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                    clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <div className="ml-0">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 p-2 cursor-pointer hover:bg-gray-600 text-gray-50 rounded-full "
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd"
                                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                    clipRule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScanQR;
