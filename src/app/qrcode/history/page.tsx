"use client";
import React from 'react'
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import API_URL from '../../config';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { format } from "date-fns";
import { id } from "date-fns/locale";
export default function History() {
    const urlGambar = sessionStorage.getItem("urlGambar");

    const [user, setUser] = useState({});
    const [qr, setQR] = useState([]);
    const fetchDataUser = async () => {
        const url = urlGambar ? "/dokter/" : "/pasien/";


        try {
            const response = await axios.get(API_URL + url + sessionStorage.getItem("id"));

            if (response.status === 200) {
                // console.log(response.data);
                console.log(urlGambar ? response.data : response.data.data.attributes);
                setUser(urlGambar ? response.data : response.data.data.attributes);
            } else {
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchDataUser();
        fetchDataQR();
    }, []);

    const fetchDataQR = async () => {
        try {
            const response = await axios.get(
                API_URL + `/transaksi_medis/all/` + sessionStorage.getItem("id"),
                // API_URL + `/transaksi_medis`,
                //    'https://lisnasehat.online/api' + `/transaksi_medis`,
            );
            setQR(response.data);
            console.log(response.data);
        } catch (error: any) {
            // Menggunakan `any` untuk sementara agar bisa mengakses `message`
            console.error("Error fetching data qr:", error);

        } finally {
            // setLoading(false);
        }
    };
    return (
        <>
            <DefaultLayout>
                {/* <Breadcrumb pageName="QRCode" /> */}


                <>
                    <section className="bg-white dark:bg-zinc-900">
                        <div className="container px-6 py-10 mx-auto">
                            <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl dark:text-white">History QR Code Anda! </h1>

                            <div className="grid grid-cols-1 gap-8 mt-8 md:mt-16 md:grid-cols-2">
                                {qr.map((qr, index) => (
                                    <div className="lg:flex" key={index}>
                                        <img className="object-cover w-full h-56 lg:w-64" src={qr.url_qrcode} alt="" />

                                        <div className="flex flex-col justify-between py-6 lg:mx-6">
                                            <p className="text-sm font-semibold text-gray-800  dark:text-white ">
                                                Pada Dokter:  {qr.dokter.nama_dokter}
                                            </p>
                                            <p className="text-sm font-semibold text-gray-800  dark:text-white ">
                                                Keluhan:  {qr.keluhan}
                                            </p>

                                            <span className="text-sm text-gray-500 dark:text-gray-300">Pada tanggal:   {format(
                                                new Date(qr.createdAt),
                                                "dd MMMM yyyy",
                                                { locale: id },
                                            )}</span>
                                        </div>
                                    </div>

                                ))}

                            </div>
                        </div>
                    </section>
                </>


            </DefaultLayout>
        </>
    )
}
