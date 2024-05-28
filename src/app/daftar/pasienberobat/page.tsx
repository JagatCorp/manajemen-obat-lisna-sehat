"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import API_URL from "@/app/config";
import FormattedDate from "@/components/FormattedDate";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import flatpickr from "flatpickr";
const Pasienberobat = () => {
  const [pasienberobat, setPasienberobat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef(null);
  const [data, setData] = useState([]);
  const [jumlahHargaTotal, setJumlahHargaTotal] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // update data
  const [updateData, setUpdateData] = useState<{
    keluhan: string;
    harga: string;
    status: string;
    gambar: any;
    id: string; // tambahkan properti 'id' ke tipe
  }>({
    keluhan: "",
    harga: "",
    status: "",
    gambar: null,
    id: "",
  });
  const fetchData = async () => {
    try {
      const response = await axios.get(
        API_URL + `/transaksi_medis?page=${currentPage}`,
      );
      console.log('coba', response.data.data);
      setPasienberobat(response.data.data);
      setTotalPages(response.data.totalPages);
      setPageSize(response.data.pageSize);
      setTotalCount(response.data.totalCount);
    } catch (error: any) {
      // Menggunakan `any` untuk sementara agar bisa mengakses `message`
      console.error("Error fetching data pasien berobat:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDataAndExportToExcel = async () => {
    try {
      const url = API_URL + '/transaksi_medis/export';
      console.log(`Fetching data from ${url} with params: startDate=${startDate}&endDate=${endDate}`);

      const response = await axios.get(url, {
        params: {
          startDate: startDate,
          endDate: endDate
        }
      });

      const data = response.data.data;
      const jumlahHargaTotal = response.data.jumlahhargaTotal;
      console.log('excel', response.data);

      // Convert JSON data to worksheet
      const ws = XLSX.utils.json_to_sheet(data);

      // Add custom text at the bottom
      const lastRowIndex = data.length + 1;
      XLSX.utils.sheet_add_aoa(ws, [['Jumlah Harga Total: ' + jumlahHargaTotal]], { origin: `A${lastRowIndex + 1}` });

      // Apply some basic styles with borders
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_address = { c: C, r: R };
          const cell_ref = XLSX.utils.encode_cell(cell_address);
          if (!ws[cell_ref]) continue;
          ws[cell_ref].s = {
            font: {
              name: 'Arial',
              sz: 12,
              color: { rgb: "#FF000000" },
            },
            fill: {
              fgColor: { rgb: "#FFFFAAAA" }
            },
            border: {
              top: { style: "thin", color: { rgb: "#3D5EE1" } },
              bottom: { style: "thin", color: { rgb: "#3D5EE1" } },
              left: { style: "thin", color: { rgb: "#3D5EE1" } },
              right: { style: "thin", color: { rgb: "#3D5EE1" } }
            }
          };
        }
      }

      // Create a new workbook and append the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');

      // Generate buffer
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      // Generate filename
      const filename = `transaksi_medis_${startDate}_sampai_${endDate}.xlsx`;

      // Save to file
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename);
    } catch (error) {
      console.error('Error fetching data and exporting to Excel:', error);
    }
  };

  const fetchDataByKeyword = async (keyword: string) => {
    try {
      const response = await axios.get(
        API_URL + `/transaksi_medis?keyword=${keyword}`,
      );
      setPasienberobat(response.data.data.data);
      setTotalPages(response.data.totalPages);
      setPageSize(response.data.pageSize);
      setTotalCount(response.data.totalCount);
    } catch (error: any) {
      // Menggunakan `any` untuk sementara agar bisa mengakses `message`
      console.error("Error fetching data pasien berobat:", error);
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
    // Init flatpickr
    flatpickr(".form-datepicker-start", {
      dateFormat: "Y-m-d",
      onChange: (selectedDates, dateStr) => {
        setStartDate(dateStr);
      }
    });

    flatpickr(".form-datepicker-end", {
      dateFormat: "Y-m-d",
      onChange: (selectedDates, dateStr) => {
        setEndDate(dateStr);
      }
    });
    // fetchDataAndExportToExcel();
    if (searchTerm !== "") {
      fetchDataByKeyword(searchTerm);
    } else {
      fetchData();
    }
  }, [currentPage, searchTerm]);

  //   toast
  const showToastMessage = (message: string) => {
    toast.success(message, {
      position: "top-right",
    });
  };

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  const firstPage = Math.max(1, currentPage - 4); // Menghitung halaman pertama yang akan ditampilkan

  // update data
  const handleEdit = (Item) => {
    console.log('Item', Item);
    setUpdateData({
      id: Item.id,
      keluhan: Item.keluhan,
      harga: Item.harga,
      status: Item.status,
      gambar: Item.null,
    });
    setShowUpdateModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formDataToUpdate = new FormData();
      formDataToUpdate.append("keluhan", updateData.keluhan);
      formDataToUpdate.append("harga", updateData.harga);
      formDataToUpdate.append("status", updateData.status);
      // Cek jika ada file gambar yang baru atau tidak
      if (updateData.gambar && updateData.gambar instanceof File) {
        formDataToUpdate.append("gambar", updateData.gambar);
      } else {
        // Jika tidak ada gambar baru, tidak perlu menambahkan field 'gambar' ke FormData
        // Atau bisa menambahkan logika lain sesuai kebutuhan backend Anda
      }
      const response = await axios.put(
        API_URL + `/pasien/${updateData.id}`,
        formDataToUpdate, // Kirim FormData
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log(response);
      if (response.status === 200) {
        showToastMessage("Data berhasil diupdate!");
        setShowUpdateModal(false);
        fetchData();
      } else {
        console.error("Gagal mengupdate data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Pasien Berobat" />
        <div className="flex flex-col gap-10">
          <ToastContainer />

          <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

            <div>

              {/* <!-- export by tanggal --> */}
              <div className="rounded-sm mb-3  bg-white dark:border-strokedark dark:bg-boxdark">

                <div className="flex flex-col gap-5.5 p-1">
                  <div className="flex gap-44">
                    <label className="block text-sm font-medium text-black dark:text-white">
                      Start Date
                    </label>
                    <label className="block text-sm font-medium text-black dark:text-white">
                      End Date
                    </label>

                  </div>

                  <div className="flex gap-5">
                    <div className="relative">
                      <input
                        className="form-datepicker-start w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        placeholder="mm/dd/yyyy"
                        data-class="flatpickr-right"
                      />

                      <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.7504 2.9812H14.2879V2.36245C14.2879 2.02495 14.0066 1.71558 13.641 1.71558C13.2754 1.71558 12.9941 1.99683 12.9941 2.36245V2.9812H4.97852V2.36245C4.97852 2.02495 4.69727 1.71558 4.33164 1.71558C3.96602 1.71558 3.68477 1.99683 3.68477 2.36245V2.9812H2.25039C1.29414 2.9812 0.478516 3.7687 0.478516 4.75308V14.5406C0.478516 15.4968 1.26602 16.3125 2.25039 16.3125H15.7504C16.7066 16.3125 17.5223 15.525 17.5223 14.5406V4.72495C17.5223 3.7687 16.7066 2.9812 15.7504 2.9812ZM1.77227 8.21245H4.16289V10.9968H1.77227V8.21245ZM5.42852 8.21245H8.38164V10.9968H5.42852V8.21245ZM8.38164 12.2625V15.0187H5.42852V12.2625H8.38164V12.2625ZM9.64727 12.2625H12.6004V15.0187H9.64727V12.2625ZM9.64727 10.9968V8.21245H12.6004V10.9968H9.64727ZM13.8379 8.21245H16.2285V10.9968H13.8379V8.21245ZM2.25039 4.24683H3.71289V4.83745C3.71289 5.17495 3.99414 5.48433 4.35977 5.48433C4.72539 5.48433 5.00664 5.20308 5.00664 4.83745V4.24683H13.0504V4.83745C13.0504 5.17495 13.3316 5.48433 13.6973 5.48433C14.0629 5.48433 14.3441 5.20308 14.3441 4.83745V4.24683H15.7504C16.0316 4.24683 16.2566 4.47183 16.2566 4.75308V6.94683H1.77227V4.75308C1.77227 4.47183 1.96914 4.24683 2.25039 4.24683ZM1.77227 14.5125V12.2343H4.16289V14.9906H2.25039C1.96914 15.0187 1.77227 14.7937 1.77227 14.5125ZM15.7504 15.0187H13.8379V12.2625H16.2285V14.5406C16.2566 14.7937 16.0316 15.0187 15.7504 15.0187Z"
                            fill="#64748B"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        className="form-datepicker-end w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        placeholder="mm/dd/yyyy"
                        data-class="flatpickr-right"
                      />

                      <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.7504 2.9812H14.2879V2.36245C14.2879 2.02495 14.0066 1.71558 13.641 1.71558C13.2754 1.71558 12.9941 1.99683 12.9941 2.36245V2.9812H4.97852V2.36245C4.97852 2.02495 4.69727 1.71558 4.33164 1.71558C3.96602 1.71558 3.68477 1.99683 3.68477 2.36245V2.9812H2.25039C1.29414 2.9812 0.478516 3.7687 0.478516 4.75308V14.5406C0.478516 15.4968 1.26602 16.3125 2.25039 16.3125H15.7504C16.7066 16.3125 17.5223 15.525 17.5223 14.5406V4.72495C17.5223 3.7687 16.7066 2.9812 15.7504 2.9812ZM1.77227 8.21245H4.16289V10.9968H1.77227V8.21245ZM5.42852 8.21245H8.38164V10.9968H5.42852V8.21245ZM8.38164 12.2625V15.0187H5.42852V12.2625H8.38164V12.2625ZM9.64727 12.2625H12.6004V15.0187H9.64727V12.2625ZM9.64727 10.9968V8.21245H12.6004V10.9968H9.64727ZM13.8379 8.21245H16.2285V10.9968H13.8379V8.21245ZM2.25039 4.24683H3.71289V4.83745C3.71289 5.17495 3.99414 5.48433 4.35977 5.48433C4.72539 5.48433 5.00664 5.20308 5.00664 4.83745V4.24683H13.0504V4.83745C13.0504 5.17495 13.3316 5.48433 13.6973 5.48433C14.0629 5.48433 14.3441 5.20308 14.3441 4.83745V4.24683H15.7504C16.0316 4.24683 16.2566 4.47183 16.2566 4.75308V6.94683H1.77227V4.75308C1.77227 4.47183 1.96914 4.24683 2.25039 4.24683ZM1.77227 14.5125V12.2343H4.16289V14.9906H2.25039C1.96914 15.0187 1.77227 14.7937 1.77227 14.5125ZM15.7504 15.0187H13.8379V12.2625H16.2285V14.5406C16.2566 14.7937 16.0316 15.0187 15.7504 15.0187Z"
                            fill="#64748B"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="">
                      <button onClick={fetchDataAndExportToExcel} className="rounded bg-blue-700 px-4 py-3  text-md text-white transition duration-150 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 flex gap-2">Export Excel
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                      </button>


                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="mb-4 flex items-center justify-end">
              {/* search */}
              {/* <input
                type="text"
                placeholder="Cari Pasien Berobat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 rounded-l-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md dark:bg-slate-500 dark:text-white md:w-56"
              /> */}
            </div>
            <div className="max-w-full overflow-x-auto overflow-y-hidden">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-slate-2 text-left dark:bg-meta-4">
                    <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                      Nomor Urut
                    </th>
                    <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                      Nama Pasien
                    </th>

                    <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                      Nama Dokter
                    </th>


                    <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                      Tanggal Daftar
                    </th>
                    <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                      Status
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pasienberobat && pasienberobat.length > 0 ? (
                    <>
                      {pasienberobat.map((Item, key) => (
                        <tr key={key}>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {Item.no_urut}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {Item.pasien.nama}
                            </p>
                          </td>

                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {Item.dokter.nama_dokter}
                            </p>
                          </td>


                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {format(
                                new Date(Item.createdAt),
                                "dd MMMM yyyy",
                                { locale: id },
                              )}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {Item.status == '3' ? "Sudah Selesai" : (Item.status == '2' ? "Sedang Berobat" : (Item.status == '1' ? "Sudah Datang" : "Belum Datang"))}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <div className="flex items-center space-x-3.5">

                              <a href={`/daftar/pasienberobat/detail/${Item.id}`} className="hover:text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                      }
                    </>
                  ) : (
                    <tr>
                      <td>tidak ada</td>
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
                        className={`mx-1 rounded-md px-3 py-1 ${currentPage === firstPage + index
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

          {/* modal update */}
          {showUpdateModal && (
            <div className="inset-0 z-50 -mt-[760px] flex max-h-full items-center justify-center overflow-y-auto">
              <div className="//"></div>
              <div
                role="alert"
                className="container mx-auto mb-5 mt-5 w-11/12 max-w-lg md:w-2/3"
              >
                <div className="relative rounded-3xl border border-slate-400 bg-white px-5 py-8 shadow-md dark:bg-slate-700 md:px-10">
                  <h1 className="font-lg mb-4 font-bold leading-tight tracking-normal text-slate-800 dark:text-white">
                    Update Pasien
                  </h1>
                  <form onSubmit={handleUpdate}>
                    <label
                      htmlFor="nama"
                      className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                    >
                      Nama Barang
                    </label>
                    <input
                      type="text"
                      id="nama"
                      name="nama"
                      value={updateData.keluhan}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          keluhan: e.target.value,
                        })
                      }
                      className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                      placeholder="Nama"
                    />

                    <div>
                      <label
                        htmlFor="No Telpon"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        No Telpon
                      </label>
                      <input
                        type="number"
                        id="No Telpon"
                        name="no_telp"
                        value={updateData.harga}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            harga: e.target.value,
                          })
                        }
                        className="mb-3 mt-2 flex h-10 w-full  items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                      />
                    </div>






                    {/* <div>
                      <label
                        htmlFor="Gambar"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Gambar--
                      </label>
                      <input
                        type="file"
                        id="gambar"
                        name="gambar"
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            gambar: e.target.files ? e.target.files[0] : null, // Memeriksa apakah e.target.files tidak null sebelum mengakses [0]
                          })
                        }
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 py-[6px] pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="gambar"
                      />
                    </div> */}

                    <div className="flex w-full items-center justify-start">
                      <button
                        type="button"
                        className=" rounded border bg-slate-100 px-8 py-2 text-sm text-slate-600 transition duration-150 ease-in-out hover:border-slate-400 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                        onClick={() => setShowUpdateModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-3 rounded bg-blue-700 px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                  <button
                    type="button"
                    className="absolute right-0 top-0 mr-5 mt-4 cursor-pointer rounded text-slate-400 transition duration-150 ease-in-out hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600"
                    onClick={() => setShowUpdateModal(false)}
                    aria-label="close modal"
                    role="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-x"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      stroke-width="2.5"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}


        </div>
      </DefaultLayout>
    </>
  );
};

export default Pasienberobat;
