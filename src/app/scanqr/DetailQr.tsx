
import { ModalForm } from "@/components/modal/ModalForm";
import axios from "axios";
import { error } from "console";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import API_URL from "../config";

const DetailQr = ({ idModal, data }) => {
    // console.log(data);

    const editStatus = async () => {
        try{
            const formDataToSend = new FormData();
            formDataToSend.append("status", '1');
            
            const response = await axios.put(API_URL + '/transaksi_medis/' + data.id, formDataToSend, {
                headers: {
                    "Content-Type": "application/json",
                    // "Content-Type": "multipart/form-data",
                },
            });

            if(response.status == 200){
                console.log(response);
            } else {
                console.error(response);
            }
        } catch(error){
            console.error(error);
        }
    }

    const dataModal = {
        idModal: idModal,
        title: [
            <div
                key={"title"}
                className="flex gap-1 font-semibold"
            >
                <div>
                    Hasil Scan QR
                </div>
            </div>,
            <div key={"title2"}>
                <button>
                    X
                </button>
            </div>
        ],
        body: [
            <div key={"input1"} className="flex flex-col gap-3" style={{ maxHeight: '255px', overflow: 'auto' }}>
                <div>
                    <div className="flex flex-col">
                        <label className="font-bold text-center">
                            Biodata Pasien
                        </label>
                        <label>
                            Nama: {data.pasien.nama}
                        </label>
                        <label>
                            Alamat: {data.pasien.alamat}
                        </label>
                        <label>
                            Alergi: {data.pasien.alergi}
                        </label>
                        <label>
                            Gol Darah: {data.pasien.gol_darah}
                        </label>
                        <label>
                            Jenis Kelamin: {data.pasien.jk == 'L' ? "Laki-Laki" : "Perempuan"}
                        </label>
                        <label>
                            No Telp: {data.pasien.no_telp}
                        </label>
                    </div>
                    <br />
                    <hr />
                    <div className="flex flex-col">
                        <label className="font-bold text-center">
                            Biodata Dokter
                        </label>
                        <label>
                            <img src={data.dokter.urlGambar} alt="" className="rounded-md" />
                        </label>
                        <label className="text-center font-bold">
                            {data.dokter.nama_dokter} {'(' + data.dokter.jk + ')'}
                        </label>
                        <hr />
                        <label className="text-center font-bold">
                            Praktik
                        </label>
                        <label className="text-center">
                            {data.dokter.mulai_praktik} - {data.dokter.selesai_praktik}
                        </label>
                    </div>
                </div>
            </div>,
        ],
        footer: [
            <>
                <button key={'button'} onClick={editStatus} className="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm">
                    Konfirmasi
                </button>
            </>
        ],
    };

    return (
        <div key={'div'}>
            <ModalForm dataModal={dataModal} />
        </div>
    );
};

export default DetailQr;
