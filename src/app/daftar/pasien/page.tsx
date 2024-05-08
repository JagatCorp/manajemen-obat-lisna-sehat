
"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
const DaftarPasien = () => {
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
            formDataToSend.append("nama", formData.nama);
            formDataToSend.append("alamat", formData.alamat);
            formDataToSend.append("jk", formData.jk);
            formDataToSend.append("no_telp", formData.no_telp);
            formDataToSend.append("alergi", formData.alergi);
            formDataToSend.append("tgl_lahir", formData.tgl_lahir);
            formDataToSend.append("gol_darah", formData.gol_darah);
            formDataToSend.append("username", formData.username);
            formDataToSend.append("password", formData.password);

            // Pastikan 'gambar' adalah File, bukan string 'null' atau path file.
            if (formData.gambar !== "null" && formData.gambar) {
                formDataToSend.append("gambar", formData.gambar);
            }

            const response = await axios.post(
                "https://api.lisnasehat.online/api/pasien",
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
                    nama: "",
                    alamat: "",
                    jk: "",
                    no_telp: "",
                    alergi: "",
                    tgl_lahir: "",
                    gol_darah: "",
                    username: "",
                    password: "",
                    gambar: null,
                });
                // fetchData();
            } else {
                console.error("Gagal mengirim data.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    return (
        <div className="flex">
            <div className="hidden lg:flex w-full lg:w-1/2 login_img_section
              justify-around items-center bg-white">
                <div
                    className=" 
                      bg-black 
                      opacity-20 
                      inset-0 
                      z-0"
                >
                </div>
                <img src="/images/icon/Frame 18.png" alt="" />
                {/* <div className="w-full mx-auto px-20 flex-col items-center space-y-6">
                    <h1 className="text-white font-bold text-4xl font-sans">Lisna Sehat App</h1>
                    <p className="text-white mt-1">Selamat Datang</p>
                    <div className="flex justify-center lg:justify-start mt-6">
                        <a href="#" className="hover:bg-indigo-700 hover:text-white hover:-translate-y-1 transition-all duration-500 bg-white text-indigo-800 mt-4 px-4 py-2 rounded-2xl font-bold mb-2">Get Started</a>
                    </div>
                </div> */}
            </div>
            <div className="flex w-full lg:w-1/2 justify-center items-center bg-white space-y-8">
                <div className="w-full px-8 md:px-32 lg:px-24">
                    <form onSubmit={handleSubmit} className="bg-white rounded-md shadow-2xl p-5">
                        <h1 className="text-gray-800 font-bold text-2xl mb-1">Hallo!</h1>
                        <p className="text-sm font-normal text-gray-600 mb-8">Selamat Datang Di Pendaftaran Pasien Lisna Sehat</p>
                        <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg> */}
                            <input type="text" id="nama" className="pl-2 w-full outline-none border-none"
                                value={formData.nama}
                                onChange={handleChange}
                                name="nama" placeholder="Nama" />
                        </div>
                        <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                            <select name="jk" id="jk" className='pl-2 w-full outline-none border-none' value={formData.jk}
                                onChange={handleChange}>
                                <option value="">Jenis Kelamin</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>
                        <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                            <input type="number" id="no_telp" className="pl-2 w-full outline-none border-none"
                                name="no_telp" value={formData.no_telp}
                                onChange={handleChange} placeholder="No. Telp" />
                        </div>
                        <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                            <input type="text" id="alergi" className="pl-2 w-full outline-none border-none"
                                name="alergi" value={formData.alergi}
                                onChange={handleChange} placeholder="Alergi" />
                        </div>
                        <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                            <input type="date" id="tgl_lahir" className="pl-2 w-full outline-none border-none"
                                name="tgl_lahir" value={formData.tgl_lahir}
                                onChange={handleChange} placeholder="" />
                        </div>
                        <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                            <input type="text" id="gol_darah" className="pl-2 w-full outline-none border-none"
                                name="gol_darah" value={formData.gol_darah}
                                onChange={handleChange} placeholder="Gol. Darah" />
                        </div>

                        <div className="flex items-center border-2 mb-12 py-2 px-3 rounded-2xl ">
                            <textarea name="alamat" id="alamat" className="pl-2 w-full outline-none border-none" value={formData.alamat}
                                onChange={handleChange} placeholder='Alamat'></textarea>

                        </div>
                        <div className="flex items-center border-2 mb-12 py-2 px-3 rounded-2xl ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>

                            <input type="username" id="username" value={formData.username}
                                onChange={handleChange} className="pl-2 w-full outline-none border-none" name="username" placeholder="Username" />

                        </div>
                        <div className="flex items-center border-2 mb-12 py-2 px-3 rounded-2xl ">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <input type="password" className="pl-2 w-full outline-none border-none" name="password" value={formData.password}
                                onChange={handleChange} id="password" placeholder="Password" />

                        </div>
                        <button type="submit" className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Daftar Sekarang</button>


                    </form>
                </div>

            </div>
        </div>
    )
};

export default DaftarPasien;
