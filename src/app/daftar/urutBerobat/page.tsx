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
        fetchDataDokter();
    }, [])

    if (error) {
        return <div className="text-red-500 text-center">Error: {error}</div>;
    }

    const firstPage = Math.max(1, currentPage - 4); // Menghitung halaman pertama yang akan ditampilkan

    return (
        <>
            <DefaultLayout>
                <Breadcrumb pageName="Berobat" />
                <div className="flex flex-col gap-10">
                    <ToastContainer />

                    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

                        <div className="mb-4 flex items-center justify-end">
                            {/* search */}
                            <input
                                type="text"
                                placeholder="Cari Transaksi Obat..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-48 rounded-l-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md dark:bg-slate-500 dark:text-white md:w-56"
                            />
                        </div>
                        <div className="max-w-full overflow-x-auto overflow-y-hidden grid grid-cols-3 gap-8">
                            {dokter && dokter.length > 0 ? (
                                dokter.map((data, index) => (
                                    <div className="max-w-xs rounded overflow-hidden shadow-lg bg-white w-60 h-fit m-2 border border-4 border-blue-500 text-center" key={index}>
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
                                                            <div key={index} className={transaksi.no_urut === data.transaksi_medis_berobat.no_urut + 1 ? 'flex flex-col' : 'hidden'}>
                                                                <span>{transaksi.pasien.nama}</span>
                                                                <span>{transaksi.status === 3 ? "Sudah Selesai" : (transaksi.status === 2 ? "Sedang Berobat" : (transaksi.status === 1 ? "Sudah Datang" : "Belum Datang"))}</span>
                                                                <span>
                                                                    exit | masuk
                                                                </span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div key={index} className="flex flex-col">
                                                            <span>Tidak Ada Yang Mendaftar</span>
                                                            <span>----</span>
                                                            <span onClick={handleKeDaftar} className="cursor-pointer">
                                                                Daftar
                                                            </span>
                                                        </div>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="px-2 font-bold text-white text-md bg-blue-500 py-2 text-center h-full">
                                            {data.transaksi_medis_berobat?.pasien?.nama ? 'Terisi' : 'Kosong'}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                'Tidak Ada Data Guru'
                            )}


                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </>
    );
};

export default TransaksiObatMasuk;
