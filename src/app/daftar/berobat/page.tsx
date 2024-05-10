"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState, useEffect, useRef } from "react";
// const [error, setError] = useState<string | null>(null);
import axios from "axios";
import API_URL from "@/app/config";
const DaftarBerobat = () => {
    const [dokter, setDokter] = useState([]);
    const urlGambar = sessionStorage.getItem("urlGambar");
    const [user, setUser] = useState({});
    // insert
    const [formData, setFormData] = useState({
        pasien_id: "",
        dokter_id: "",
        keluhan: "",
        gambar: null,
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

            // Pastikan 'gambar' adalah File, bukan string 'null' atau path file.
            if (formData.gambar !== "null" && formData.gambar) {
                formDataToSend.append("gambar", formData.gambar);
            }

            const response = await axios.post(
                // "https://api.lisnasehat.online/api/pasien",
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
                });
                // fetchData();
                window.location.href = "/qrcode";
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
    useEffect(() => {
        fetchDataDokter();
        fetchDataUser();
    }, []);

    const fetchDataUser = async () => {
        const url = urlGambar ? "/dokter/" : "/pasien/";


        try {
            const response = await axios.get(API_URL + url + sessionStorage.getItem("id"));
            // const response = await axios.get('https://lisnasehat.online/api' + url + sessionStorage.getItem("id"));

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
                                    <input type="hidden"
                                        onChange={handleChange} name="pasien_id" id="pasien_id" value={formData.pasien_id = sessionStorage.getItem("id")} />
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
