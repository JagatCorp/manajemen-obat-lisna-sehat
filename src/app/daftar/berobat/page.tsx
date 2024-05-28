"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState, useEffect, useRef } from "react";
// const [error, setError] = useState<string | null>(null);
import axios from "axios";
import API_URL from "@/app/config";
import { usePathname } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DaftarBerobat = () => {
    const [dokter, setDokter] = useState([]);
    const [pasien, setPasien] = useState([]);
    const urlGambar = localStorage.getItem("urlGambar");
    const [user, setUser] = useState({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [fecthHariIni, setFecthHariIni] = useState([]);
    // validasi admin
    const pathname = usePathname();
    const role = localStorage.getItem("role"); // Mendapatkan peran dari localStorage

    const cekDokter = !!urlGambar && role === 'lisDo'; // Cek apakah pengguna adalah dokter
    const cekPasien = role === 'lisPa'; // Cek apakah pengguna adalah pasien
    const cekAdmin = role === 'lisAd'; // Cek apakah pengguna adalah administrator

    // Buat array yang berisi rute-rute yang tidak diizinkan untuk dokter, pasien, dan admin
    const forbiddenPathsDoctor = ['/satuan', '/daftar/berobat', '/history/transaksiobatmasuk'];
    const forbiddenPathsPatient = ['/scanqr', '/riwayat', '/history/transaksiobatmasuk'];
    const forbiddenPathsAdmin = ['/admin-punyabebas'];

    // Pembatasan akses berdasarkan peran pengguna
    useEffect(() => {
        if (cekDokter && forbiddenPathsDoctor.includes(pathname)) {
            window.location.href = '/'; // Alihkan ke halaman lain jika dokter mengakses rute terlarang
        } else if (cekPasien && forbiddenPathsPatient.includes(pathname)) {
            window.location.href = '/'; // Alihkan ke halaman lain jika pasien mengakses rute terlarang
        } else if (!cekAdmin && forbiddenPathsAdmin.includes(pathname)) {
            window.location.href = '/'; // Alihkan ke halaman lain jika bukan admin mengakses rute admin
        }
    }, [pathname, cekDokter, cekPasien, cekAdmin]);

    // Inisialisasi state untuk mengetahui peran pengguna
    const [isDoctor, setIsDoctor] = useState(false);
    const [isPasien, setIsPasien] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsDoctor(cekDokter);
        setIsPasien(cekPasien);
        setIsAdmin(cekAdmin);
    }, [cekDokter, cekPasien, cekAdmin]);
    // insert
    const [formData, setFormData] = useState({
        pasien_id: "",
        dokter_id: "",
        keluhan: "",
        gambar: null,
        status: null,
    });
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
            formDataToSend.append("pasien_id", formData.pasien_id);
            formDataToSend.append("dokter_id", formData.dokter_id);
            formDataToSend.append("keluhan", formData.keluhan);

            // kasih validasi
            if (isAdmin == true) {
                formDataToSend.append("status", "1");
            }
            else {
                formDataToSend.append("status", "0");
            }
            // Pastikan 'gambar' adalah File, bukan string 'null' atau path file.
            if (formData.gambar !== "null" && formData.gambar) {
                formDataToSend.append("gambar", formData.gambar);
            }

            const response = await axios.post(
                API_URL + `/transaksi_medis`,
                formDataToSend, // Kirim FormData
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (response.status === 200) {
                // showToastMessage("Data berhasil ditambahkan!");
                // setShowModal(false);
                setFormData({
                    pasien_id: "",
                    dokter_id: "",
                    keluhan: "",
                    gambar: null,
                    status: null,
                });
                // fetchData();
                window.location.href = "/daftar/pasienberobat/pasien";
            } else {
                console.error("Gagal mengirim data.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const fetchDataDokter = async () => {
        try {
            const response = await axios.get(
                API_URL + `/dokter`,
                //    'https://lisnasehat.online/api' + `/dokter`,
            );
            setDokter(response.data.data);
            // console.log([response.data]);
        } catch (error: any) {
            // Menggunakan `any` untuk sementara agar bisa mengakses `message`
            console.error("Error fetching data spesialisdokter:", error);
        } finally {
            // setLoading(false);
        }
    };

    const fetchDataPasien = async () => {
        try {
            const response = await axios.get(
                API_URL + `/pasien`,
            );
            console.log('pasien', response.data.data.data);
            setPasien(response.data.data.data);
        } catch (error: any) {
            // Menggunakan `any` untuk sementara agar bisa mengakses `message`
            console.error("Error fetching data spesialisdokter:", error);
        } finally {
            // setLoading(false);
        }
    };
    const fetchHariIni = async () => {
        try {
            const response = await axios.get(
                API_URL + `/transaksi_medis/pasien/${localStorage.getItem('id')}`,
            );
            const data = response.data.data;

            // Mendapatkan tanggal hari ini
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            // Filter data untuk mengambil data yang dibuat pada hari ini
            const filteredData = data.filter(item => {
                const itemDate = new Date(item.createdAt);
                return itemDate.toISOString().split('T')[0] === todayString;
            });

            // console.log('pasienberobat hari ini', filteredData.length != 0);

            if (filteredData.length != 0) {
                window.alert('Kamu Sudah Daftar Berobat Hari Ini');
                // showToastMessage("Kamu Sudah Daftar Berobat Hari Ini");
                window.location.href = `/daftar/pasienberobat/detail/${filteredData[0].id}`;
            }

            setFecthHariIni(filteredData);
        } catch (error) {
            console.error("Error fetching data pasienberobat:", error);
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
        if (role == 'lisPa') {
            fetchHariIni();
        }
        fetchDataPasien();
        fetchDataDokter();
        fetchDataUser();
    }, []);

    //   toast
    const showToastMessage = (message: string) => {
        toast.success(message, {
            position: "top-right",
        });
    };

    const fetchDataUser = async () => {
        const url = urlGambar ? "/dokter/" : "/pasien/";

        try {
            const response = await axios.get(API_URL + url + localStorage.getItem("id"));
            // const response = await axios.get('https://lisnasehat.online/api' + url + localStorage.getItem("id"));

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
    return (
        <>
            <DefaultLayout>
                <Breadcrumb pageName="Form Daftar Berobat" />
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                        <div className="flex flex-col gap-9">
                            {/* <!-- Input Fields --> */}
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">
                                        Form
                                    </h3>
                                </div>
                                <div className="flex flex-col gap-5.5 p-6.5">
                                    {/* cek adminnya disini */}
                                    {!isAdmin && isPasien && (
                                        <input type="hidden"
                                            onChange={handleChange} name="pasien_id" id="pasien_id" value={formData.pasien_id = localStorage.getItem("id")} />
                                    )}
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Pilih Dokter
                                        </label>
                                        <select value={formData.dokter_id}
                                            onChange={handleChange} name="dokter_id" id="dokter_id" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                                            <option>-- pilih --</option>{" "}
                                            {dokter && dokter.length > 0 && (
                                                <>
                                                    {dokter.map((ItemsDokter) => (
                                                        <option
                                                            key={ItemsDokter.id}
                                                            value={ItemsDokter.id}
                                                        >
                                                            {ItemsDokter.nama_dokter} | spesialis: {ItemsDokter.spesialisdokter.nama_spesialis}
                                                        </option>

                                                    ))}
                                                </>
                                            )}
                                        </select>
                                    </div>
                                    {isAdmin &&
                                        <div>
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Pilih Pasien
                                            </label>
                                            <select value={formData.pasien_id}
                                                onChange={handleChange} name="pasien_id" id="pasien_id" className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                                                <option>-- pilih --</option>
                                                {pasien && pasien.length > 0 && (
                                                    <>
                                                        {pasien.map((ItemsPasien) => (
                                                            <option
                                                                key={ItemsPasien.attributes.id}
                                                                value={ItemsPasien.id}
                                                            >
                                                                {ItemsPasien.attributes.nama}
                                                            </option>

                                                        ))}
                                                    </>
                                                )}
                                            </select>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-9">
                            {/* <!-- Textarea Fields --> */}
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">
                                        Form
                                    </h3>
                                </div>
                                <div className="flex flex-col gap-5.5 p-6.5">
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Keluhan Anda
                                        </label>
                                        <textarea
                                            rows={6}
                                            placeholder="Keluhan Anda"
                                            name="keluhan"
                                            id="keluhan"
                                            value={formData.keluhan}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Daftar Sekarang</button>

                </form>
            </DefaultLayout>
        </>
    );
};

export default DaftarBerobat;
