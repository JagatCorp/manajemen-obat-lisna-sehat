"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import API_URL from "@/app/config";
// import RestoteObatMasuk from "./RestoteObatMasuk";
// import HapusPermanenObatMasuk from "./HapusPermanenObatMasuk";
import FormattedDate from "@/components/FormattedDate";
// import TambahTransaksi from "./TambahTransaksi";
// import HapusTransaksi from "./HapusTransaksi";

const TransaksiObatMasuk = () => {
    const [transaksiObatMasuk, setTransaksiObatMasuk] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [dokter, setDokter] = useState([]);
    const [pasienberobat, setPasienberobat] = useState([]);

    const fetchDataDokter = async () => {
        try {
            const response = await axios.get(
                API_URL + `/dokter/transaksimedis?page=${currentPage}`,
            );
            console.log('dokter', response.data.data);
            setDokter(response.data.data);
            setTotalPages(response.data.totalPages);
            setPageSize(response.data.pageSize);
            setTotalCount(response.data.totalCount);
        } catch (error: any) {
            // Menggunakan `any` untuk sementara agar bisa mengakses `message`
            console.error("Error fetching data dokter:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan saat mengambil data",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleKeDaftar = () => {
        window.location.href = '/daftar/berobat'
    }

    useEffect(() => {
        fetchDataDokter(); // Fetch data immediately on mount

        const intervalId = setInterval(() => {
            fetchDataDokter(); // Fetch data every 1 second
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);

    if (error) {
        return <div className="text-red-500 text-center">Error: {error}</div>;
    }

    const handleMasukDokter = async (transaksiId) => {
        try {
            const formDataToSend = new FormData;
            formDataToSend.append('status', '2');

            const response = await axios.post(`${API_URL}/transaksi_medis/selesai/${transaksiId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status == 200) {
                console.log(response);
            } else {
                console.log(response);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleSkipPasien = async (transaksiId) => {
        try {
            const response = await axios.delete(`${API_URL}/transaksi_medis/skip/pasien/${transaksiId}`,);

            if (response.status == 200) {
                console.log(response);
            } else {
                console.log(response);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const firstPage = Math.max(1, currentPage - 4); // Menghitung halaman pertama yang akan ditampilkan

    return (
        <>
            <DefaultLayout>
                <Breadcrumb pageName="Berobat" />
                <div className="flex flex-col gap-10">
                    <ToastContainer />

                    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                        <div className="max-w-full overflow-x-auto overflow-y-hidden grid grid-cols-3 gap-8">
                            {dokter && dokter.length > 0 ? (
                                dokter.map((data, index) => (
                                    <div className={`max-w-xs rounded overflow-hidden shadow-lg bg-white w-60 h-fit m-2 border border-4 ${data.transaksi_medis_berobat ? 'border-blue-500' : 'border-green-500'} text-center`} key={index}>
                                        <img className="w-full h-60 object-cover" src={data.urlGambar} alt="Card Image" />
                                        <div className="pt-2 flex flex-col justify-between">
                                            <div>
                                                <p className="px-2 text-black text-sm font-bold border-b border-black pb-1 flex flex-col">
                                                    <span>{data.nama_dokter}</span>
                                                    <span>- {data.spesialisdokter.nama_spesialis} -</span>
                                                </p>
                                                <p className="px-2 text-black text-sm border-b border-black pb-1 text-center">
                                                    {data.transaksi_medis_berobat?.pasien?.nama ? (
                                                        <div className="flex flex-col">
                                                            <span>{'Sedang Mengobati '}</span>
                                                            <span>{data.transaksi_medis_berobat?.pasien?.nama}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col">
                                                            <span>{'Tidak Ada Yang Berobat'}</span>
                                                            <span>----</span>
                                                        </div>
                                                    )}
                                                </p>
                                                <p className="px-2 text-black text-sm border-b border-black pb-1">
                                                    {data.transaksi_medis && data.transaksi_medis.length > 0 ? (
                                                        data.transaksi_medis.map((transaksi, index) => (
                                                            <div key={index} className="flex flex-col">
                                                                <span>{transaksi.pasien.nama}</span>
                                                                <span>{transaksi.status === '3' ? "Sudah Selesai" : (transaksi.status === '2' ? "Sedang Berobat" : (transaksi.status === '1' ? "Sudah Datang" : "Belum Datang"))} {`( ${transaksi.no_urut} )`} </span>
                                                                {!data.transaksi_medis_berobat?.pasien ? (
                                                                    <span>
                                                                        <button onClick={() => handleSkipPasien(transaksi.id)}>
                                                                            <svg
                                                                              
                                                                                className="fill-current w-4 h-4 text-orange-700"
                                                                                viewBox="0 0 18 18"
                                                                                fill="none"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                            >
                                                                                <path
                                                                                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                                                    fill=""
                                                                                />
                                                                                <path
                                                                                    d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                                                                    fill=""
                                                                                />
                                                                                <path
                                                                                    d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                                                                    fill=""
                                                                                />
                                                                                <path
                                                                                    d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                                                                    fill=""
                                                                                />
                                                                            </svg>
                                                                        </button>
                                                                        |
                                                                        <button onClick={() => handleMasukDokter(transaksi.id)}>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 text-green-500">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                                                            </svg>

                                                                        </button>
                                                                    </span>
                                                                ) : (
                                                                    'Tunggu Pasien Berobat'
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div key={index} className="flex flex-col">
                                                            <span>Tidak Ada Yang Mendaftar</span>
                                                            <span>----</span>
                                                            <span onClick={handleKeDaftar} className="cursor-pointer text-blue-400 hover:text-blue-600 font-bold underline underline-offset-2">
                                                                Daftar
                                                            </span>
                                                        </div>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-2 font-bold text-white text-md ${data.transaksi_medis_berobat ? 'bg-blue-500' : 'bg-green-500'} py-2 text-center h-full`}>
                                            {data.transaksi_medis_berobat?.pasien?.nama ? 'Terisi' : 'Kosong'}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                'Tidak Ada Data'
                            )}


                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </>
    );
};

export default TransaksiObatMasuk;
