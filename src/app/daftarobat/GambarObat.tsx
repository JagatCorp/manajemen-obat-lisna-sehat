import { ModalForm } from "@/components/modal/ModalForm";
import axios from "axios";
import { use, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";


const GambarObat = ({ idModal, dataObat }) => {
    const [loading, setLoading] = useState(false);

    const dataModal = {
        idModal: idModal,
        title: [
            <label
                key={"title"}
                className="flex gap-1 items-center font-semibold"
            >
                Gambar Obat {dataObat['nama_obat']}
            </label>,
        ],
        body: [
            <div key={"input"} className="flex flex-col gap-3">
                <img src={dataObat['urlGambar']} alt="" />
            </div>,
        ],
        footer: [
            <>
                <button className="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm">
                    Close
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

export default GambarObat;
