"use client";
import React from 'react'
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import API_URL from '../config';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
export default function QRCode() {
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
                API_URL + `/transaksi_medis/` + sessionStorage.getItem("id"),
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
                <Breadcrumb pageName="QRCode" />
                {/* {qr.map((qr) => (
                    <div key={qr.id}> */}
                <img src={qr.url_qrcode} alt="QR Code" className='mx-auto ' />
                {/* </div>
                ))} */}

            </DefaultLayout>
        </>
    )
}
