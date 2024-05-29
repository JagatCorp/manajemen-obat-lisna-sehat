// app/daftar/pasienberobat/detail/[id]/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import API_URL from '@/app/config';
import { format } from "date-fns";
import { id } from "date-fns/locale";
import formatNumberWithCurrency from '@/components/formatNumberWithCurrency';
import TambahObat from './TambahObat';
import { toast } from 'react-toastify';
const Detail = () => {
    const params = useParams();
    const { id } = params;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dataObat, setDataObat] = useState([]);

    const [dataObatKeluar, setDataObatKeluar] = useState([]);

    const [hargaDokter, setHargaDokter] = useState(null);

    const [formData, setFormData] = useState({
        diagnosa_dokter: "",
    });

    const goBack = () => {
        window.history.back();
    };

    const fetchDataObatKeluar = async () => {
        try {
            const response = await axios.get(`${API_URL}/transaksi_obat_keluar/all/${id}`);
            if (response.status == 200) {
                console.log('obatKeluar', response.data.data);
                setDataObatKeluar(response.data.data);
            } else {
                console.error(response);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchDataObat = async () => {
        try {
            const response = await axios.get(API_URL + '/obat/');

            if (response.status == 200) {
                setDataObat(response.data.data);
                console.log('obat tambah', response);
            } else {
                console.error(response);
            }
        } catch (error) {
            console.error("Error:", error.response.data.message);
            showErrorMessage(error.response.data.message);
        }
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_URL}/transaksi_medis/${id}`);
            setData(response.data);

            console.log('coba', response.data.harga_dokter == null);

            if (response.data.harga_dokter == null) {
                setHargaDokter(response.data.dokter.spesialisdokter.harga);
                // console.log('coba', response.data.dokter.spesialisdokter.harga);
            } else {
                setHargaDokter(response.data.harga_dokter);
            }

            setFormData((prevData) => ({
                ...prevData,
                diagnosa_dokter: response.data.diagnosa_dokter,
            }));

            console.log('tran', response.data);
        } catch (error) {
            setError('Terjadi kesalahan saat mengambil data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const cekDiagnosa = async () => {
        const idLogin = localStorage.getItem('id');
        // const idDokterTran = dataObatKeluar;
        // console.log('masuk', data);
    }

    useEffect(() => {
        fetchDataObatKeluar();
        cekDiagnosa();
        fetchDataObat();
    }, []);

    const handleSelesai = async (hargaTotal) => {
        const confirm = window.confirm('Yakin sudah selesai?');

        if (confirm) {
            try {
                const formDataToSend = new FormData();
                formDataToSend.append('diagnosa_dokter', formData.diagnosa_dokter);
                formDataToSend.append('harga_total', hargaTotal);
                formDataToSend.append('harga_dokter', hargaDokter);
                formDataToSend.append('status', '3');

                const response = await axios.put(`${API_URL}/transaksi_medis/selesai/${id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                fetchData();

                if (response.status === 200) {
                    console.log(response);
                } else {
                    console.error(response);
                }

            } catch (error) {
                console.error(error);
            }
        }

    };


    const handleDeleteObat = async (dataId) => {
        try {

            const confirm = window.confirm("Apakah anda yakin ingin menghapus data obat ini?");

            if (confirm) {
                const response = await axios.delete(API_URL + '/transaksi_obat_keluar/hard/dokter/' + dataId);

                if (response.status == 200) {
                    console.log(response);
                    fetchDataObatKeluar();
                    fetchDataObat();
                } else {
                    console.log(response);
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const showToastMessage = (message: string) => {
        toast.success(message, {
            position: "top-right",
        });
    };
    const showErrorMessage = (message: string) => {
        toast.error(message, {
            position: "top-right",
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    let totalHarga = hargaDokter ?? 0;

    return (
        <DefaultLayout>
            <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
                <button
                    onClick={goBack}
                    className='bg-slate-500 px-3 py-1 rounded text-black hover:bg-slate-600 hover:text-white'
                >
                    Kembali
                </button>
                <div className="flex justify-start item-start space-y-2 flex-col">
                    {/* <h1 className="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">Order #13432</h1> */}
                    <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">Berobat Pada Tanggal: {format(
                        new Date(data?.createdAt),
                        "dd MMMM yyyy",
                        // { locale: id },
                    )}</p>
                </div>
                <div className='text-6xl text-center mt-10'>
                    {data.status == '3' ? "Sudah Selesai" : (data.status == '2' ? "Sedang Berobat" : (data.status == '1' ? "Sudah Datang" : "Belum Datang"))}
                </div>
                <div className="flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                    <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                        <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                            <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">Detail Berobat</p>
                            <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                                <div className="pb-4 md:pb-8 w-full md:w-40">
                                    <img className="w-full hidden md:block" src={data?.url_qrcode} alt="qrcode" />
                                    <img className="w-full md:hidden" src={data?.url_qrcode} alt="qrcode" />
                                </div>
                                <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                                    <div className="w-full flex flex-col justify-start items-start space-y-8 me-5">
                                        {/* <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">Pasien:</h3> */}
                                        {/* <div className="flex justify-start items-start flex-col space-y-2">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Keluhan: </span> {data?.keluhan}</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Size: </span> Small</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Color: </span> Light Blue</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Color: </span> Light Blue</p>
                                        </div> */}

                                        <div className="flex justify-between w-full">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Pasien: </span> {data?.pasien.nama}</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Dokter: </span> {data?.dokter.nama_dokter}</p>
                                        </div>
                                        <div className="flex justify-between w-full">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Keluhan: </span> {data?.keluhan}</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Spesialis: </span> {data?.dokter.spesialisdokter.nama_spesialis}</p>
                                        </div>

                                        <div className="flex justify-between w-full">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Jenis Kelamin: </span>{data?.pasien.jk == "L" ? "Laki-laki" : "Perempuan"}</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Jenis Kelamin: </span>{data?.dokter.jk == "L" ? "Laki-laki" : "Perempuan"}</p>
                                        </div>
                                        {/* <div className="flex justify-between w-full">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Spesialis: </span> {data?.dokter.spesialisdokter.nama_spesialis}</p>
                                        </div> */}
                                        <div className="flex justify-between w-full">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">No Telpon: </span>{data?.pasien.no_telp}</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Selesai Praktik: </span>{data?.dokter.selesai_praktik}</p>
                                        </div>
                                        <div className="flex justify-between w-full">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Alergi: </span>{data?.pasien.alergi}</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Mulai Praktik: </span> {data?.dokter.mulai_praktik}</p>
                                        </div>
                                        <div className="flex justify-between w-full">
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Gol Darah: </span>{data?.pasien.gol_darah}</p>
                                            <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Hari Praktik: </span>{data?.dokter.hari_praktik}</p>
                                        </div>
                                    </div>
                                    <div className='h-full'>
                                        <img src={data?.dokter.urlGambar} alt="foto dokter" />
                                        <div>
                                            <p className="dark:text-white leading-none text-gray-800 text-4xl flex justify-center">No</p>
                                        </div>
                                        <div>
                                            <p className="dark:text-white leading-none text-gray-800 text-4xl flex justify-center">{data.no_urut}</p>
                                        </div>
                                    </div>
                                    {/* <div className="flex justify-between space-x-8 items-start w-full">
                                        <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">Harga: {data?.harga}</p>
                                    </div> */}
                                </div>
                            </div>

                        </div>

                        <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                            <div>
                                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Diagnosa Dokter</h3>
                            </div>
                            <div className="flex justify-between items-start w-full">
                                <div className="flex justify-center items-center space-x-4">
                                    <div className="flex flex-col justify-start items-center">
                                        {data.status == '2' ? (
                                            <textarea name="diagnosa_dokter" id="diagnosa_dokter" onChange={handleChange} cols={60} rows={5} value={formData.diagnosa_dokter}
                                                className="border text-black w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                            ></textarea>
                                        ) : (
                                            <p className="leading-6 dark:text-white text-sm text-gray-800">{data.diagnosa_dokter ?? "Diagnosa Belom Diberikan"}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">

                            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800 flex gap-2">
                                    Obat Yang Diambil
                                    {data.status == '2' && (
                                        <button className='bg-slate-500 text-lg px-1 rounded text-white hover:bg-slate-600 hover:text-white-500 text-center text-sm flex'
                                            onClick={() => {
                                                const modal = document.getElementById("modalTambahObatKeluar");
                                                if (modal instanceof HTMLDialogElement) {
                                                    modal.showModal();
                                                }
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-6 w-6 text-white dark:text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>
                                            Tambah Obat
                                        </button>
                                    )}
                                    <TambahObat idModal={'modalTambahObatKeluar'} dataId={data.id} fetchDataObatKeluar={fetchDataObatKeluar} fetchDataObat={fetchDataObat} dataObat={dataObat} />
                                </h3>

                                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                                    {dataObatKeluar && dataObatKeluar.length !== 0 ? (
                                        dataObatKeluar.map((data, index) => {
                                            // harga asli atau (dpp / box)
                                            let hrg_dpp = data.harga;
                                            // hna satuan = hrg_dpp / qty_satuan
                                            let set_hna_satuan = hrg_dpp / data.obat.qty_sat;
                                            // dikali ppn 11%
                                            let harga_ppn = set_hna_satuan * 0.11;
                                            // harga setelah ppn
                                            let set_harga_ppn = harga_ppn + set_hna_satuan;
                                            // dikali margin 15%
                                            let harga_margin = set_harga_ppn * 0.15;
                                            // hna + ppn + margin 15%
                                            let hna_ppn_margin = set_harga_ppn + harga_margin;

                                            let jml_harga = hna_ppn_margin * data.jml_obat;

                                            totalHarga += jml_harga;
                                            return (
                                                <div key={'div'} className="flex justify-between items-center w-full">
                                                    <p className="text-base dark:text-white leading-4 text-gray-800">{data.obat.nama_obat}</p>
                                                    <p className="text-base dark:text-gray-300 leading-4 text-gray-600">{formatNumberWithCurrency(hna_ppn_margin)} x {data.jml_obat} = {formatNumberWithCurrency(jml_harga)}</p>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        "Belom Mengambil Obat Apapun"
                                    )}
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-base dark:text-white leading-4 text-gray-800">Biaya {data?.dokter.spesialisdokter.nama_spesialis}</p>
                                        <p className="text-base dark:text-gray-300 leading-4 text-gray-600">{formatNumberWithCurrency(hargaDokter)}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">Total</p>
                                    <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">{formatNumberWithCurrency(totalHarga)}</p>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Dosis Obat</h3>
                                {dataObatKeluar && dataObatKeluar.length !== 0 ? (
                                    dataObatKeluar.map((obatKeluar, index) => {
                                        return (
                                            <div key={'divObatKeluar'} className="flex justify-between items-center w-full">
                                                <p className="text-base dark:text-white leading-4 text-gray-800">{obatKeluar.obat.nama_obat}</p>
                                                <div className='flex gap-3'>
                                                    <p className="text-base dark:text-gray-300 leading-4 text-gray-600">{obatKeluar.dosis}</p>
                                                    {data.status == '2' && (
                                                        <button onClick={() => handleDeleteObat(obatKeluar.id)} className='text-red'>X</button>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    "Belom Mengambil Obat Apapun"
                                )}
                                {data.status == '2' && (
                                    <div>
                                        <button className='bg-slate-500 w-full px-3 py-2 text-lg rounded text-white hover:bg-slate-600 hover:text-white text-center'
                                            onClick={() => handleSelesai(totalHarga)}>
                                            Sudah Selesai Berobat
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Detail;
