
import { ModalForm } from "@/components/modal/ModalForm";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";


const HapusSatuan = ({ idModal, data, fetchData }) => {
    // console.log(errorMessages);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        // e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.delete(
                "https://api.lisnasehat.online/api/satuan/" + data.id,
            );

            if (response.status === 200) {

                const modalHapus = document.getElementById(idModal);
                if(modalHapus instanceof HTMLDialogElement){
                    modalHapus.close();
                }

                showToastMessage("Data Satuan berhasil ditambahkan!");
                setLoading(false);
                fetchData();
            } else {
                console.error("Gagal mengirim data.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const showToastMessage = (message: string) => {
        toast.success(message, {
            position: "top-right",
        });
    };

    const dataModal = {
        idModal: idModal,
        title: [
            <label
                key={"title"}
                className="flex gap-1 items-center font-semibold"
            >
                Tambah Data Satuan
            </label>,
        ],
        body: [
            <div key={"input"} className="flex flex-col gap-3">
                Apakah Anda yakin ingin menghapus data ini?
            </div>,
        ],
        footer: [
            <>
                <button className="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm">
                    Cancel    
                </button>
                <button
                    key="buttonSubmit"
                    className={`ml-3 rounded bg-blue-700 px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 ${loading ? "cursor-not-allowed" : ""
                        }`}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="animate-spin">&#9696;</span>
                    ) : (
                        ''                        
                    )}
                    {loading ? "Loading..." : "Submit"}
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

export default HapusSatuan;
