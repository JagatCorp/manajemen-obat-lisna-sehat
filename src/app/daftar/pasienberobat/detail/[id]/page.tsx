// app/daftar/pasienberobat/detail/[id]/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import API_URL from '@/app/config';
import { format } from "date-fns";
import { id } from "date-fns/locale";
const Detail = () => {
    const params = useParams();
    const { id } = params;
    console.log(id);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const goBack = () => {
        window.history.back();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/transaksi_medis/${id}`);
                setData(response.data);
                // console.log(response.data);
            } catch (error) {
                setError('Terjadi kesalahan saat mengambil data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <DefaultLayout>
            <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
                <button
                    onClick={goBack}
                    className="mt-3 inline-flex justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                >
                    Kembali
                </button>
                <div className="flex justify-start item-start space-y-2 flex-col">
                    {/* <h1 className="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">Order #13432</h1> */}
                    <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">Berobat Pada Tanggal: {format(
                        new Date(data?.createdAt),
                        "dd MMMM yyyy",
                        // { locale: id },
                    )}</p>
                </div>
                <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                    <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                        <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                            <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">Detail Berobat</p>
                            <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                                <div className="pb-4 md:pb-8 w-full md:w-40">
                                    <img className="w-full hidden md:block" src={data?.url_qrcode} alt="qrcode" />
                                    <img className="w-full md:hidden" src={data?.url_qrcode} alt="qrcode" />
                                </div>
                                <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                                    <div className="w-full flex flex-col justify-start items-start space-y-8 me-5">
                                        {/* <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">Pasien:</h3> */}
                                        {/* <div className="flex justify-start items-start flex-col space-y-2">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Keluhan: </span> {data?.keluhan}</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Size: </span> Small</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Color: </span> Light Blue</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Color: </span> Light Blue</p>
                                        </div> */}

                                        <div className="flex justify-between w-full">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Pasien: </span> {data?.pasien.nama}</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Dokter: </span> {data?.dokter.nama_dokter}</p>
                                        </div>
                                        <div className="flex justify-between w-full">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Keluhan: </span> {data?.keluhan}</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Spesialis: </span> {data?.dokter.spesialisdokter.nama_spesialis}</p>
                                        </div>

                                        <div className="flex justify-between w-full">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Jenis Kelamin: </span>{data?.pasien.jk == "L" ? "Laki-laki" : "Perempuan"}</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Jenis Kelamin: </span>{data?.dokter.jk == "L" ? "Laki-laki" : "Perempuan"}</p>
                                        </div>
                                        {/* <div className="flex justify-between w-full">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Spesialis: </span> {data?.dokter.spesialisdokter.nama_spesialis}</p>
                                        </div> */}
                                        <div className="flex justify-between w-full">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">No Telpon: </span>{data?.pasien.no_telp}</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Selesai Praktik: </span>{data?.dokter.selesai_praktik}</p>
                                        </div>
                                        <div className="flex justify-between w-full">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Alergi: </span>{data?.pasien.alergi}</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Mulai Praktik: </span> {data?.dokter.mulai_praktik}</p>
                                        </div>
                                        <div className="flex justify-between w-full">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Gol Darah: </span>{data?.pasien.gol_darah}</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Hari Praktik: </span>{data?.dokter.hari_praktik}</p>
                                            {/* <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300"><img src={data?.dokter.urlGambar} alt="foto dokter" className='w-10 h-10' /></span></p> */}
                                        </div>
                                    </div>
                                    <div>
                                        <img src={data?.dokter.urlGambar} alt="foto dokter" />
                                    </div>
                                    {/* <div className="flex justify-between space-x-8 items-start w-full">
                                        <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">Harga: {data?.harga}</p>
                                    </div> */}
                                </div>
                            </div>

                        </div>
                        {/* <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Summary</h3>
                                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                                    <div className="flex justify-between w-full">
                                        <p className="text-base dark:text-white leading-4 text-gray-800">Subtotal</p>
                                        <p className="text-base dark:text-gray-300 leading-4 text-gray-600">$56.00</p>
                                    </div>
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-base dark:text-white leading-4 text-gray-800">Discount <span className="bg-gray-200 p-1 text-xs font-medium dark:bg-white dark:text-gray-800 leading-3 text-gray-800">STUDENT</span></p>
                                        <p className="text-base dark:text-gray-300 leading-4 text-gray-600">-$28.00 (50%)</p>
                                    </div>
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-base dark:text-white leading-4 text-gray-800">Shipping</p>
                                        <p className="text-base dark:text-gray-300 leading-4 text-gray-600">$8.00</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">Total</p>
                                    <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">$36.00</p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Shipping</h3>
                                <div className="flex justify-between items-start w-full">
                                    <div className="flex justify-center items-center space-x-4">
                                        <div className="w-8 h-8">
                                            <img className="w-full h-full" alt="logo" src="https://i.ibb.co/L8KSdNQ/image-3.png" />
                                        </div>
                                        <div className="flex flex-col justify-start items-center">
                                            <p className="text-lg leading-6 dark:text-white font-semibold text-gray-800">DPD Delivery<br /><span className="font-normal">Delivery with 24 Hours</span></p>
                                        </div>
                                    </div>
                                    <p className="text-lg font-semibold leading-6 dark:text-white text-gray-800">$8.00</p>
                                </div>
                                <div className="w-full flex justify-center items-center">
                                    <button className="hover:bg-black dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-base font-medium leading-4 text-white">View Carrier Details</button>
                                </div>
                            </div>
                        </div> */}
                    </div>

                </div>
            </div>
        </DefaultLayout>
    );
};

export default Detail;
