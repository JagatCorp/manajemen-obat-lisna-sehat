"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import API_URL from "../config";
import TambahTransaksi from "./TambahTransaksi";
import HapusTransaksi from "./HapusTransaksi";
import FormattedDate from "@/components/FormattedDate";

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
  const fileInputRef = useRef(null);
  const [obat, setObat] = useState([]);
  const [principle, setPrinciple] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        API_URL + `/transaksi_obat_masuk?page=${currentPage}`,
      );
      console.log(response);
      setTransaksiObatMasuk(response.data.data);
      setTotalPages(response.data.totalPages);
      setPageSize(response.data.pageSize);
      setTotalCount(response.data.totalCount);
    } catch (error: any) {
      // Menggunakan `any` untuk sementara agar bisa mengakses `message`
      console.error("Error fetching data transaksi obat masuk:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDataObat = async () => {
    try {
      const response = await axios.get(API_URL + "/obat");

      if (response.status == 200) {
        // console.log('obat',response.data.data);
        setObat(response.data.data);
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDataPrinciple = async () => {
    try {
      const response = await axios.get(API_URL + "/principle");

      if (response.status == 200) {
        console.log("obat", response.data.data.data);
        setPrinciple(response.data.data.data);
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDataByKeyword = async (keyword: string) => {
    try {
      const response = await axios.get(
        API_URL + `/transaksi_obat_masuk?keyword=${keyword}`,
      );
      setTransaksiObatMasuk(response.data.data.data);
      setTotalPages(response.data.totalPages);
      setPageSize(response.data.pageSize);
      setTotalCount(response.data.totalCount);
    } catch (error: any) {
      // Menggunakan `any` untuk sementara agar bisa mengakses `message`
      console.error("Error fetching data transaksi obat masuk:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data",
      );
    } finally {
      setLoading(false);
    }
  };

  // kondisi search
  useEffect(() => {
    fetchDataObat();
    fetchDataPrinciple();
    if (searchTerm !== "") {
      fetchDataByKeyword(searchTerm);
    } else {
      fetchData();
    }
  }, [currentPage, searchTerm]);

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  const firstPage = Math.max(1, currentPage - 4); // Menghitung halaman pertama yang akan ditampilkan

  const formatNumberWithCurrency = (number) => {
    // Memformat angka dengan dua angka desimal dan tambahkan simbol mata uang
    return `Rp ${number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Transaksi Obat Masuk" />
        <div className="flex flex-col gap-10">
          <ToastContainer />

          <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <button
              className="flex items-center gap-1 rounded-md bg-white px-4  py-2 text-end text-black shadow-xl hover:bg-slate-100 focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-offset-2 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-400"
              onClick={() => {
                const modal = document.getElementById(
                  "modalTambahTransaksiObatMasuk",
                );
                if (modal instanceof HTMLDialogElement) {
                  modal.showModal();
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-6 w-6 text-black dark:text-white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Tambah Transaksi Obat Masuk
            </button>

            {/* modal tambah */}
            <TambahTransaksi
              idModal={"modalTambahTransaksiObatMasuk"}
              fetchData={fetchData}
              fetchDataObat={fetchDataObat}
              dataObat={obat}
              dataPrinciple={principle}
            />

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
            <div className="max-w-full overflow-x-auto overflow-y-hidden">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-slate-2 text-left dark:bg-meta-4">
                    <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                      Nama Obat
                    </th>
                    <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                      Jumlah Obat
                    </th>
                    <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                      Harga DPP / Box
                    </th>
                    <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                      Principle
                    </th>
                    <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                      Tanggal
                    </th>
                    <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                      Jatuh Tempo
                    </th>
                    <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                      Expired
                    </th>
                    <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                      Gambar Nota
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transaksiObatMasuk && transaksiObatMasuk.length > 0 ? (
                    <>
                      {transaksiObatMasuk.map((Item, key) => (
                        <tr key={key}>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {Item["obat"]["nama_obat"]}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {Item["jml_obat"]}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {formatNumberWithCurrency(Item["harga"])}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            {Item["principle"]["nama_instansi"]}
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <FormattedDate date={Item["createdAt"]} />
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <FormattedDate date={Item["jatuh_tempo"]} />
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <FormattedDate date={Item["expired"]} />
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <img
                              width={56}
                              height={56}
                              src={Item["urlGambar"]}
                              alt=""
                            />
                          </td>

                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <div className="flex items-center space-x-3.5">
                              <button
                                className="hover:text-primary"
                                onClick={() => {
                                  const modalHapus = document.getElementById(
                                    "modalHapusTransaksi" + key,
                                  );
                                  if (modalHapus instanceof HTMLDialogElement) {
                                    modalHapus.showModal();
                                  }
                                }}
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="18"
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
                              <HapusTransaksi
                                idModal={"modalHapusTransaksi" + key}
                                data={Item}
                                fetchData={fetchData}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        Tidak Ada Data Obat
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* pagination */}
              <div className="my-4 flex justify-center gap-5">
                <button
                  onClick={() =>
                    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-md bg-slate-200 px-3 py-1 hover:bg-slate-400"
                >
                  Prev
                </button>
                <div className="flex">
                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, index) => (
                      <button
                        key={index}
                        onClick={
                          () => setCurrentPage(firstPage + index) // Memperbarui halaman berdasarkan indeks dan halaman pertama yang ditampilkan
                        }
                        className={`mx-1 rounded-md px-3 py-1 ${
                          currentPage === firstPage + index
                            ? "bg-blue-400 to-slate-600 text-white"
                            : "bg-slate-200 hover:bg-slate-400"
                        }`}
                      >
                        {firstPage + index}{" "}
                        {/* Menggunakan halaman pertama yang ditampilkan */}
                      </button>
                    ),
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prevPage) =>
                      Math.min(prevPage + 1, totalPages),
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-md bg-slate-200 px-3 py-1 hover:bg-slate-400"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default TransaksiObatMasuk;
