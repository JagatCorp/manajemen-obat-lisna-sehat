"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import API_URL from "../config";

export default function Login() {
    const [username, setusername] = useState("");
    const [password, setPassword] = useState("");
    const [cookies, setCookie] = useCookies(["token"]);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false); // State untuk melacak apakah formulir sudah dikirimkan
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true); // Menandai bahwa formulir sudah dikirimkan

        if (!username) return; // Jika username tidak diisi, jangan melanjutkan pengiriman formulir
        if (!password) return; // Jika password tidak diisi, jangan melanjutkan pengiriman formulir

        try {
            const response = await axios.post(
                // "https://api.lisnasehat.online/api/auth/login",
                API_URL + "/auth/login",
                {
                    username,
                    password,
                }
            );

            // Simpan username di dalam sessionStorage
            // sessionStorage.setItem("username", username);
            console.log(response.data);
            if (response.data.urlGambar) {
                sessionStorage.setItem("urlGambar", response.data.urlGambar);
            }
            sessionStorage.setItem("id", response.data.id);

            // Simpan token JWT di dalam cookie dengan nama 'token'
            setCookie("token", response.data.token, { path: "/" });

            // Redirect ke halaman admin/dashboard
            window.location.href = "/";
        } catch (error) {
            console.error("Login error:", error);
            // setError("username atau password salah.");
            showToastMessage();
        }
    };
    const showToastMessage = () => {
        toast.error("username atau password salah !", {
            position: "top-right",
        });
    };
    return (
        <div className=" h-screen flex bg-white">
            <div className=" hidden lg:flex w-full lg:w-1/2 login_img_section
          justify-around items-center bg-white">
                <div
                    className=" 
                    bg-white
                  opacity-20 
                  inset-0 
                  z-0"
                >
                </div>
                <img src="/images/icon/Frame 18.png" alt="" className="mt-45" />
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
                        <ToastContainer />
                        <div className="flex items-center border-2 mb-12 py-2 px-3 rounded-2xl ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>

                            <input type="username" id="username"
                                value={username}
                                onChange={(e) => setusername(e.target.value)}
                                className="pl-2 w-full outline-none border-none" name="username" placeholder="Username" />

                        </div>
                        {submitted && !username && (
                            <p className="-mt-10  mb-2 text-sm font-semibold text-red">
                                username wajib diisi !
                            </p>
                        )}
                        <div className="flex items-center border-2 mb-12 py-2 px-3 rounded-2xl ">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <input type="password" className="pl-2 w-full outline-none border-none" name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password" placeholder="Password" />

                        </div>
                        {submitted && !password && (
                            <p className="-mt-10 text-sm font-semibold text-red">
                                Passoword wajib diisi !
                            </p>
                        )}
                        <button type="submit" className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2">Daftar Sekarang</button>


                    </form>
                </div>

            </div>
        </div>
    );
}
