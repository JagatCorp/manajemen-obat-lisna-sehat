
import { ModalForm } from "@/components/modal/ModalForm";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const DetailQr = ({ idModal, data }) => {
    console.log(data);

    const dataModal = {
        idModal: idModal,
        title: [
            <div
                key={"title"}
                className="flex gap-1 font-semibold"
            >
                <div>
                    Tambah Data Satuan
                </div>
            </div>,
                <div>
                    <button>
                        X
                    </button>
                </div>
        ],
        body: [
            <div key={"input"} className="flex flex-col gap-3" style={{ maxHeight: '255px', overflow: 'auto' }}>
                <div>
                    <div>
                        <div className="font-bold text-center">
                            Biodata Pasien
                        </div>
                        <div>
                            Nama: {data.pasien.nama}
                        </div>
                        <div>
                            Alamat: {data.pasien.alamat}
                        </div>
                        <div>
                            Alergi: {data.pasien.alergi}
                        </div>
                        <div>
                            Gol Darah: {data.pasien.gol_darah}
                        </div>
                        <div>
                            Jenis Kelamin: {data.pasien.jk == 'L' ? "Laki-Laki" : "Perempuan"}
                        </div>
                        <div>
                            No Telp: {data.pasien.no_telp}
                        </div>
                    </div>
                    <br />
                    <hr />
                    <div>
                        <div className="font-bold text-center">
                            Biodata Dokter
                        </div>
                        <div>
                            <img src={ data.dokter.urlGambar } alt="" className="rounded-md" />
                        </div>
                        <div className="text-center font-bold">
                            {data.dokter.nama_dokter} {'('+ data.dokter.jk +')'}
                        </div>
                        <hr />
                        <div className="text-center font-bold">
                            Praktik
                        </div>
                        <div className="text-center">
                            {data.dokter.mulai_praktik} - {data.dokter.selesai_praktik}
                        </div>
                    </div>
                </div>
            </div>,
        ],
        footer: [
            <>
                <button className="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm">
                    Konfirmasi
                </button>
            </>
        ],
    };

    return (
        <div>
            <ModalForm dataModal={dataModal} />
        </div>
    );
};

export default DetailQr;
