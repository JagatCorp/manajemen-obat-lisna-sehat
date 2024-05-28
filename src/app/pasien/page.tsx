"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import API_URL from "../config";

// const dataArray = [
//   { id: 1, name: 'John Doe', age: 30 },
//   { id: 2, name: 'Jane Doe', age: 25 },
//   { id: 3, name: 'Bob Smith', age: 40 },
//   { id: 4, name: 'Alice Johnson', age: 35 },
// ];

// const dataArray = [];


const Pasien = () => {
  const [pasien, setPasien] = useState([]);
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

  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api.kop-dayalisna.online/api/anggota');
      const data = await response.json();
      // setSearchResults(data);
    };

    fetchData();
  }, []);

  const handleInputChange = async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setInputValue(searchTerm);

    if (searchTerm === '') {
      setSearchResults([]);
      return;
    }

    const response = await fetch('https://api.kop-dayalisna.online/api/anggota');
    const data = await response.json();
    const results = data.filter((item) => {
      return (
        item.nama_anggota.toLowerCase().includes(searchTerm) ||
        item.nip.toString().includes(searchTerm)
      );
    });
    setSearchResults(results);
  };

  const handleSelect = (data) => {
    setSelectedData(data);
    setInputValue(data.nama_anggota);
    setSearchResults([]);
  };

  // add data
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    jk: "",
    no_telp: "",
    alergi: "",
    tgl_lahir: "",
    gol_darah: "",
    username: "",
    password: "",
    id_relasi: "",
    gambar: null,
  });

  // update data
  const [updateData, setUpdateData] = useState<{
    nama: string;
    alamat: string;
    password: string;
    username: string;
    jk: string;
    no_telp: string;
    alergi: string;
    tgl_lahir: string;
    gol_darah: string;
    id_relasi: string,
    gambar: any;
    id: string; // tambahkan properti 'id' ke tipe
  }>({
    nama: "",
    alamat: "",
    password: "",
    username: "",
    id_relasi: "",
    jk: "",
    no_telp: "",
    alergi: "",
    tgl_lahir: "",
    gol_darah: "",
    gambar: null,
    id: "",
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        API_URL + `/pasien?page=${currentPage}`,
      );
      setPasien(response.data.data.data);
      setTotalPages(response.data.totalPages);
      setPageSize(response.data.pageSize);
      setTotalCount(response.data.totalCount);
    } catch (error: any) {
      // Menggunakan `any` untuk sementara agar bisa mengakses `message`
      console.error("Error fetching data pasien:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDataAnggota = async () => {
    // console.log('masuk');
    try {
      const response = await axios.get(
        `https://api.kop-dayalisna.online/api/anggota`,
      );

      if (response.status == 200) {
        console.log('anggota', response.data);
      } else {
        console.error('anggota', response);
      }

    } catch (error: any) {
      console.log(error);
    }
  }

  const fetchDataByKeyword = async (keyword: string) => {
    try {
      const response = await axios.get(
        API_URL + `/pasien?keyword=${keyword}`,
      );
      setPasien(response.data.data.data);
      setTotalPages(response.data.totalPages);
      setPageSize(response.data.pageSize);
      setTotalCount(response.data.totalCount);
    } catch (error: any) {
      // Menggunakan `any` untuk sementara agar bisa mengakses `message`
      console.error("Error fetching data pasien:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAnggota();
  }, []);

  // kondisi search
  useEffect(() => {
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

  //   delete
  const handleDelete = async () => {
    const id = itemIdToDelete;
    try {
      const response = await axios.delete(
        API_URL + `/pasien/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 201) {
        throw new Error("Gagal menghapus data");
      }

      setPasien(pasien.filter((item) => item.id !== id));
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
      formDataToSend.append("nama", formData.nama);
      formDataToSend.append("alamat", formData.alamat);
      formDataToSend.append("jk", formData.jk);

      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("id_relasi", formData.id_relasi);

      formDataToSend.append("no_telp", formData.no_telp);
      formDataToSend.append("alergi", formData.alergi);
      formDataToSend.append("tgl_lahir", formData.tgl_lahir);
      formDataToSend.append("gol_darah", formData.gol_darah);

      // Pastikan 'gambar' adalah File, bukan string 'null' atau path file.
      if (formData.gambar !== "null" && formData.gambar) {
        formDataToSend.append("gambar", formData.gambar);
      }

      const response = await axios.post(
        API_URL + "/pasien",
        formDataToSend, // Kirim FormData
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        console.log(response);
        showToastMessage("Data berhasil ditambahkan!");
        setShowModal(false);
        setFormData({
          nama: "",
          alamat: "",
          jk: "",
          no_telp: "",
          alergi: "",
          tgl_lahir: "",
          gol_darah: "",
          username: "",
          password: "",
          id_relasi: "",
          gambar: null,
        });
        fetchData();
      } else {
        console.error(response);
        console.error("Gagal mengirim data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // update data
  const handleEdit = (Item) => {
    console.log('Item', Item);
    setUpdateData({
      id: Item.id,
      nama: Item.attributes.nama,
      alamat: Item.attributes.alamat,
      jk: Item.attributes.jk,
      no_telp: Item.attributes.no_telp,
      alergi: Item.attributes.alergi,
      tgl_lahir: Item.attributes.tgl_lahir,
      gol_darah: Item.attributes.gol_darah,
      gambar: Item.attributes.null,
      password: Item.attributes.password,
      id_relasi: Item.attributes.id_relasi,
      username: Item.attributes.username,
    });
    setShowUpdateModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formDataToUpdate = new FormData();
      formDataToUpdate.append("nama", updateData.nama);
      formDataToUpdate.append("alamat", updateData.alamat);
      formDataToUpdate.append("jk", updateData.jk);
      formDataToUpdate.append("no_telp", updateData.no_telp);
      formDataToUpdate.append("alergi", updateData.alergi);

      formDataToUpdate.append("username", updateData.username);
      formDataToUpdate.append("password", updateData.password);
      formDataToUpdate.append("id_relasi", updateData.id_relasi);

      formDataToUpdate.append("tgl_lahir", updateData.tgl_lahir);
      formDataToUpdate.append("gol_darah", updateData.gol_darah);
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
        <Breadcrumb pageName="Pasien" />
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
              Pasien
            </button>

            <div className="mb-4 flex items-center justify-end">
              {/* search */}
              <input
                type="text"
                placeholder="Cari Pasien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 rounded-l-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md dark:bg-slate-500 dark:text-white md:w-56"
              />
            </div>
            <div className="max-w-full overflow-x-auto overflow-y-hidden">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-slate-2 text-left dark:bg-meta-4">
                    <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white">
                      Nama
                    </th>
                    <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                      Jenis Kelamin
                    </th>
                    <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                      No Telpon
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                      Alergi
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                      Tanggal Lahir
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                      Gol Darah
                    </th>
                    <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                      Alamat
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pasien.map((Item, key) => (
                    <tr key={key}>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {Item.attributes.nama}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {Item.attributes.jk == "L" ? "Laki-laki" : "Perempuan"}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {Item.attributes.no_telp}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {Item.attributes.alergi}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {format(
                            new Date(Item.attributes.tgl_lahir),
                            "dd MMMM yyyy",
                            { locale: id },
                          )}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {Item.attributes.gol_darah}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {Item.attributes.alamat}
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
                      Delete Pasien
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
              <div className="//"></div>
              <div
                role="alert"
                className="container mx-auto w-11/12 max-w-lg md:w-2/3"
              >
                <div className="relative  rounded-3xl border border-slate-400 bg-white px-5 py-8 shadow-md dark:bg-slate-700 md:px-10">
                  <h1 className="font-lg mb-4 font-bold leading-tight tracking-normal text-slate-800 dark:text-white">
                    Add Pasien
                  </h1>
                  <form onSubmit={handleSubmit}>
                    <div>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={inputValue}
                        onChange={handleInputChange}
                        className="border rounded-md p-2 w-full"
                      />
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <ul>
                          {searchResults.length > 0 && searchResults.map((data) => (
                            <li
                              key={data.id}
                              onClick={() => handleSelect(data)}
                              className="cursor-pointer"
                            >
                              {data.nama_anggota} - {data.nip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {selectedData && (
                        <div>
                          <h2>Selected Data</h2>
                          <p>Name: {selectedData.nama_anggota}</p>
                          <p>Nip: {selectedData.nip}</p>
                        </div>
                      )}
                    </div>

                    <label
                      htmlFor="nama"
                      className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                    >
                      Nama
                    </label>
                    <input
                      type="text"
                      id="nama"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                      placeholder="Nama"
                      required
                    />

                    <div>
                      <label
                        htmlFor="jk"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Jenis Kelamin
                      </label>
                      <select
                        name="jk"
                        id="jk" // Menambahkan id untuk label 'for'
                        value={formData.jk}
                        onChange={handleChange}
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                      >
                        <option>-- pilih --</option>
                        <option value="L">Laki-Laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>

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
                        value={formData.no_telp}
                        onChange={handleChange}
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="No Telpon"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="Alergi"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Alergi
                      </label>
                      <input
                        type="text"
                        id="Alergi"
                        name="alergi"
                        value={formData.alergi}
                        onChange={handleChange}
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="Alergi"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="Tgl Lahir"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Tgl Lahir
                      </label>
                      <input
                        type="date"
                        id="Tgl Lahir"
                        name="tgl_lahir"
                        value={formData.tgl_lahir}
                        onChange={handleChange}
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="Tgl Lahir"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="Gol Darah"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Gol Darah
                      </label>
                      <input
                        type="text"
                        id="Gol Darah"
                        name="gol_darah"
                        value={formData.gol_darah}
                        onChange={handleChange}
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="Gol Darah"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="Alamat"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Alamat
                      </label>
                      <textarea
                        name="alamat"
                        id="alamat"
                        cols={30}
                        rows={10}
                        value={formData.alamat}
                        onChange={handleChange}
                        className="mb-3 mt-2 flex h-auto w-full items-center rounded border border-slate-300 p-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                      ></textarea>
                    </div>

                    <hr />
                    <div className="text-center mt-3">
                      Bila dikosongkan akan terisi nilai default
                    </div>
                    <div className="mb-3 ">
                      <label
                        htmlFor="username"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="Username"
                      />
                      <small>Default: Diambil dari nomor telepon pasien</small>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="password"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Password
                      </label>
                      <input
                        type="text"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="Password"
                      />
                      <small>Default: Diambil dari tanggal lahir pasien {'(MMDDYYY)'}</small>
                    </div>

                    <div>
                      <input
                        type="hidden"
                        id="id_relasi"
                        name="id_relasi"
                        value={formData.id_relasi}
                        onChange={handleChange}
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                      />
                    </div>

                    {/* <div>
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
                    </div> */}

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
                      value={updateData.nama}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          nama: e.target.value,
                        })
                      }
                      className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                      placeholder="Nama"
                    />

                    <div>
                      <label
                        htmlFor="jk"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Jenis Kelamin
                      </label>
                      <select
                        name="jk"
                        id="jk" // Menambahkan id untuk label 'for'
                        value={updateData.jk}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            jk: e.target.value,
                          })
                        }
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                      >
                        <option value="L">Laki-Laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>

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
                        value={updateData.no_telp}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            no_telp: e.target.value,
                          })
                        }
                        className="mb-3 mt-2 flex h-10 w-full  items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="Alergi"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Alergi
                      </label>
                      <input
                        type="text"
                        id="Alergi"
                        name="alergi"
                        value={updateData.alergi}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            alergi: e.target.value,
                          })
                        }
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="Alergi"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="Tgl Lahir"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Tgl Lahir
                      </label>
                      <input
                        type="date"
                        id="Tgl Lahir"
                        name="tgl_lahir"
                        value={updateData.tgl_lahir}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            tgl_lahir: e.target.value,
                          })
                        }
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="Tgl Lahir"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="Gol Darah"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Gol Darah
                      </label>
                      <input
                        type="text"
                        id="Gol Darah"
                        name="gol_darah"
                        value={updateData.gol_darah}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            gol_darah: e.target.value,
                          })
                        }
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="Gol Darah"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="Alamat"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Alamat
                      </label>
                      <textarea
                        name="alamat"
                        id="alamat"
                        cols={30}
                        rows={10}
                        value={updateData.alamat}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            alamat: e.target.value,
                          })
                        }
                        className="mb-3 mt-2 flex h-auto w-full items-center rounded border border-slate-300 p-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                      ></textarea>
                    </div>
                    <div>
                      <label
                        htmlFor="Username"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="Username"
                        name="username"
                        value={updateData.username}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            username: e.target.value,
                          })
                        }
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="Username"
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="Password"
                        className="text-sm font-bold leading-tight tracking-normal text-slate-800 dark:text-white"
                      >
                        Password
                      </label>
                      <input
                        type="text"
                        id="Password"
                        name="password"
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            password: e.target.value,
                          })
                        }
                        className="mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
                        placeholder="Password"
                      />
                      <small>Kosongkan bila tidak ingin mengubah password</small>
                    </div>

                    <div>
                      <input
                        type="hidden"
                        id="id_relasi"
                        name="id_relasi"
                        value={updateData.username}
                        onChange={(e) =>
                          setUpdateData({
                            ...updateData,
                            id_relasi: e.target.value,
                          })
                        }
                        className="mb-3 mt-2 flex h-10 w-full items-center rounded border border-slate-300 pl-3 text-sm font-normal text-slate-600 focus:border focus:border-indigo-700 focus:outline-none dark:border-slate-100 dark:bg-slate-600 dark:text-white"
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
        </div >
      </DefaultLayout >
    </>
  );
};

export default Pasien;
