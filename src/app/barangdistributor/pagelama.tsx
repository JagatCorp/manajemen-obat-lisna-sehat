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

const Barangdistributor = () => {
  const [barangdistributor, setBarangdistributor] = useState([]);
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
  const [satuanbarang, setSatuanbarang] = useState([]);

  const fetchDataSatuan = async () => {
    try {
      const response = await axios.get(
        API_URL + `/satuan?page=${currentPage}`,
      );
      setSatuanbarang(response.data.data.data);
      // console.log('data', response.data.data);
      setTotalPages(response.data.totalPages);
      setPageSize(response.data.pageSize);
      setTotalCount(response.data.totalCount);
    } catch (error: any) {
      // Menggunakan `any` untuk sementara agar bisa mengakses `message`
      console.error("Error fetching data satuanbarang:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data",
      );
    } finally {
      setLoading(false);
    }
  };
  // add data
  const [formData, setFormData] = useState({
    nama_barang: "",
    satuan_barangId: "",
    harga_satuan_barang: "",
    satuan_stok_barang: "",
    gambar: null,
  });

  // update data
  const [updateData, setUpdateData] = useState<{
    nama_barang: string;
    satuan_barangId: string;
    harga_satuan_barang: string;
    satuan_stok_barang: string;
    gambar: any;
    id: string; // tambahkan properti 'id' ke tipe
  }>({
    nama_barang: "",
    satuan_barangId: "",
    harga_satuan_barang: "",
    satuan_stok_barang: "",
    gambar: null,
    id: "", // tambahkan nilai awal untuk properti 'id'
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        API_URL + `/barangdistributor?page=${currentPage}`,
      );
      setBarangdistributor(response.data.data);
      setTotalPages(response.data.totalPages);
      setPageSize(response.data.pageSize);
      setTotalCount(response.data.totalCount);
    } catch (error: any) {
      // Menggunakan `any` untuk sementara agar bisa mengakses `message`
      console.error("Error fetching data barangdistributor:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDataByKeyword = async (keyword: string) => {
    try {
      const response = await axios.get(
        API_URL + `/barangdistributor?keyword=${keyword}`,
      );
      setBarangdistributor(response.data.data);
      setTotalPages(response.data.totalPages);
      setPageSize(response.data.pageSize);
      setTotalCount(response.data.totalCount);
    } catch (error: any) {
      // Menggunakan `any` untuk sementara agar bisa mengakses `message`
      console.error("Error fetching data barangdistributor:", error);
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
    if (searchTerm !== "") {
      fetchDataByKeyword(searchTerm);
    } else {
      fetchData();
      fetchDataSatuan();
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

  //   delete
  const handleDelete = async () => {
    const id = itemIdToDelete;
    try {
      const response = await axios.delete(
        API_URL + `/barangdistributor/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 201) {
        throw new Error("Gagal menghapus data");
      }

      setBarangdistributor(
        barangdistributor.filter((item: { id: number }) => item.id !== id),
      );
      showToastMessage("Data berhasil dihapus!");
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };
  const toggleModalDelete = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  //   add data
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const handleChange = (e) => {
    const { name, type } = e.target;
    const value = type === "file" ? e.target.files[0] : e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama_barang", formData.nama_barang);
      formDataToSend.append("satuan_barangId", formData.satuan_barangId);
      formDataToSend.append(
        "harga_satuan_barang",
        formData.harga_satuan_barang,
      );
      formDataToSend.append("satuan_stok_barang", formData.satuan_stok_barang);
      // Pastikan 'gambar' adalah File, bukan string 'null' atau path file.
      if (formData.gambar !== "null" && formData.gambar) {
        formDataToSend.append("gambar", formData.gambar);
      }

      const response = await axios.post(
        API_URL + "/barangdistributor",
        formDataToSend, // Kirim FormData
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Tidak perlu menentukan 'Content-Type', axios akan menanganinya
            // karena Anda mengirimkan FormData.
          },
        },
      );

      if (response.status === 200) {
        showToastMessage("Data berhasil ditambahkan!");
        setShowModal(false);
        setFormData({
          nama_barang: "",
          satuan_barangId: "",
          harga_satuan_barang: "",
          satuan_stok_barang: "",
          gambar: null,
        });
        fetchData();
      } else {
        console.error("Gagal mengirim data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // update data
  const handleEdit = (Item) => {
    setUpdateData((prevState) => ({
      ...prevState,
      id: Item.id,
      nama_barang: Item.nama_barang,
      satuan_barangId: Item.satuan_barangId,
      nama_satuan_barang: Item.satuan.nama_satuan,
      harga_satuan_barang: Item.harga_satuan_barang,
      satuan_stok_barang: Item.satuan_stok_barang,
      gambar: Item.gambar,
    }));
    setShowUpdateModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formDataToUpdate = new FormData();
      formDataToUpdate.append("nama_barang", updateData.nama_barang);
      formDataToUpdate.append("satuan_barangId", updateData.satuan_barangId);
      formDataToUpdate.append(
        "harga_satuan_barang",
        updateData.harga_satuan_barang,
      );
      formDataToUpdate.append(
        "satuan_stok_barang",
        updateData.satuan_stok_barang,
      );

      // Cek jika ada file gambar yang baru atau tidak
      if (updateData.gambar && updateData.gambar instanceof File) {
        formDataToUpdate.append("gambar", updateData.gambar);
      } else {
        // Jika tidak ada gambar baru, tidak perlu menambahkan field 'gambar' ke FormData
        // Atau bisa menambahkan logika lain sesuai kebutuhan backend Anda
      }

      const response = await axios.put(
        API_URL + `/barangdistributor/${updateData.id}`,
        formDataToUpdate, // Kirim FormData
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

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
        <Breadcrumb pageName="Barang Distributor" />
        <div className="flex flex-col gap-10">
          <ToastContainer />

          <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <button
              onClick={toggleModal}
              className="flex items-center gap-1 rounded-md bg-white px-4  py-2 text-end text-black shadow-xl hover:bg-slate-100 focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-offset-2 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-400"
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
              Barang Distributor
            </button>

            <div className="mb-4 flex items-center justify-end">
              {/* search */}
              <input
                type="text"
                placeholder="Cari Barang Distributor..."
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
                      Barang
                    </th>
                    <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                      Satuan Barang
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                      Harga Satuan Barang
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                      Satuan Stok Barang
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {barangdistributor.map((Item, key) => (
                    <tr key={key}>
                      <td>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                          <div className="mb-3 mt-3 h-12.5 w-15 rounded-md">
                            <img
                              src={Item.urlGambar}
                              width={60}
                              height={50}
                              alt="Item.attributes"
                            />
                          </div>
                          <p className="text-sm text-black dark:text-white">
                            {Item.nama_barang}
                          </p>
                        </div>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {Item.satuan.nama_satuan}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {Item.harga_satuan_barang}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {Item.satuan_stok_barang}
                        </p>
                      </td>

                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button
                            className="hover:text-primary"
                            onClick={() => handleEdit(Item)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              className="h-5 w-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                          </button>
                          <button
                            className="hover:text-primary"
                            onClick={() => {
                              toggleModalDelete();
                              setItemIdToDelete(Item.id);
                              // Simpan ID item yang akan dihapus
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
                        </div>
                      </td>
                    </tr>
                  ))}
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

          {/* Modal delete */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-slate-500 opacity-75"></div>
              </div>
              <div className="relative w-full max-w-md transform rounded-3xl bg-white shadow-xl  transition dark:bg-slate-700">
                <div className="px-4 py-5 sm:px-6">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">
                      Delete Barangdistributor
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-white">
                      Apakah Anda yakin ingin menghapus data ini?
                    </p>
                  </div>
                </div>
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-rose-800 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* modal add */}
          {showModal && (
            <div className="absolute w-full">
              {/* <div className="fixed inset-0 bg-slate-500 opacity-75"></div> */}
              <div
                role="alert"
                className="container mx-auto w-11/12 max-w-lg md:w-2/3"
              >
                <div className="relative rounded-3xl border border-slate-400 bg-white px-5 py-8 shadow-md dark:bg-slate-700 md:px-10">
                  <h1 className="font-lg mb-4 font-bold leading-tight tracking-normal text-slate-800 dark:text-white">
                    Add Barangdistributor
                  </h1>
                  <form onSubmit={handleSubmit}>
                    <label
                      htmlFor="namabarang"
                      className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                    >
                      Nama Barang
                    </label>
                    <input
                      type="text"
                      id="namabarang"
                      name="nama_barang"
                      value={formData.nama_barang}
                      onChange={handleChange}
                      className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                      placeholder="Nama Barang"
                      required
                    />

                    <div>
                      <label
                        htmlFor="satuan_barangId"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Satuan Barang
                      </label>
                      <select
                        name="satuan_barangId"
                        id="satuan_barangId" // Menambahkan id untuk label 'for'
                        value={formData.satuan_barangId}
                        onChange={handleChange}
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                      >
                        <option>-- pilih --</option>{" "}
                        {satuanbarang.map((ItemSatuan) => (
                          <option key={ItemSatuan.id} value={ItemSatuan.id}>
                            {ItemSatuan.attributes.nama_satuan}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="hargaSatuanBarang"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Harga Satuan Barang
                      </label>
                      <input
                        type="number"
                        id="hargaSatuanBarang"
                        name="harga_satuan_barang"
                        value={formData.harga_satuan_barang}
                        onChange={handleChange}
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="HargaSatuanBarang"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="satuanStokBarang"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Satuan Stok Barang
                      </label>
                      <input
                        type="number"
                        id="satuanStokBarang"
                        name="satuan_stok_barang"
                        value={formData.satuan_stok_barang}
                        onChange={handleChange}
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="SatuanStokBarang"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="gambar"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800"
                      >
                        Gambar
                      </label>

                      <input
                        type="file"
                        id="gambar"
                        name="gambar"
                        ref={fileInputRef}
                        onChange={handleChange}
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 py-[6px]  pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none"
                        placeholder="gambar"
                        required
                      />
                    </div>

                    <div className="flex w-full items-center justify-start">
                      <button
                        type="button"
                        className=" rounded border bg-slate-100 px-8 py-2 text-sm text-slate-600 transition duration-150 ease-in-out hover:border-slate-400 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-3 rounded bg-blue-700 px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                  <button
                    type="button"
                    className="absolute right-0 top-0 mr-5 mt-4 cursor-pointer rounded text-slate-400 transition duration-150 ease-in-out hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600"
                    onClick={() => setShowModal(false)}
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

          {/* modal update */}
          {showUpdateModal && (
            <div className="absolute w-full">
              {/* <div className="fixed inset-0 bg-slate-500 opacity-75"></div> */}
              <div
                role="alert"
                className="container mx-auto mb-5 mt-5 w-11/12 max-w-lg md:w-2/3"
              >
                <div className="relative rounded-3xl border border-slate-400 bg-white px-5 py-8 shadow-md dark:bg-slate-700 md:px-10">
                  <h1 className="font-lg mb-4 font-bold leading-tight tracking-normal text-slate-800 dark:text-white">
                    Update Barangdistributor
                  </h1>
                  <form onSubmit={handleUpdate}>
                    <label
                      htmlFor="nama barang"
                      className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                    >
                      Nama Barang
                    </label>
                    <input
                      type="text"
                      id="nama_barang"
                      name="nama_barang"
                      value={updateData.nama_barang}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          nama_barang: e.target.value,
                        })
                      }
                      className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                      placeholder="Nama Barang"
                    />

                    <div>
                      <label
                        htmlFor="satuan_barangId"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Satuan Barang
                      </label>
                      <select
                        name="satuan_barangId"
                        id="satuan_barangId" // Menambahkan id untuk label 'for'
                        value={updateData.satuan_barangId}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            satuan_barangId: e.target.value,
                          })
                        }
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                      >
                        {satuanbarang.map((Itemspesialis) => (
                          <option
                            key={Itemspesialis.id}
                            value={Itemspesialis.id}
                          >
                            {Itemspesialis.attributes.nama_satuan}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="hargaSatuanBarang"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        HargaSatuanBarang
                      </label>
                      <input
                        type="number"
                        id="hargaSatuanBarang"
                        name="harga_satuan_barang"
                        value={updateData.harga_satuan_barang}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            harga_satuan_barang: e.target.value,
                          })
                        }
                        className="mb-3 mt-2 flex h-10 w-full  items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="satuanBarang"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="satuanStokBarang"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        SatuanStokBarang
                      </label>
                      <input
                        type="number"
                        id="satuanStokBarang"
                        name="satuan_stok_barang"
                        value={updateData.satuan_stok_barang}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            satuan_stok_barang: e.target.value,
                          })
                        }
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="satuanStokBarang"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="Gambar"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Gambar
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
                    </div>

                    <div className="flex w-full items-center justify-start">
                      <button
                        type="button"
                        className="rounded border bg-slate-100 px-8 py-2 text-sm text-slate-600 transition duration-150 ease-in-out hover:border-slate-400 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
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

export default Barangdistributor;
