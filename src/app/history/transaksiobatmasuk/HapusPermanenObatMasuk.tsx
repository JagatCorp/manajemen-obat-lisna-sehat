
import API_URL from "@/app/config";
import { ModalForm } from "@/components/modal/ModalForm";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";


const HapusPermanenObatMasuk = ({ idModal, data, fetchData }) => {
    // console.log('transaksi',data);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        // e.preventDefault();
        setLoading(true);

        const formData = new FormData;
        formData.append('deletedAt', null);

        try {
            const response = await axios.delete(
                API_URL + "/transaksi_obat_masuk/hard/" + data.id
            );

            if (response.status === 200) {
                console.log('hapus', response);

                const modalRestore = document.getElementById(idModal);
                if (modalRestore instanceof HTMLDialogElement) {
                    modalRestore.close();
                }

                showToastMessage("Data Transaksi Obat Masuk berhasil dihapus permanen!");
                setLoading(false);
                fetchData();
            } else {
                showErrorMessage(response.data.message);
                setLoading(false);
                console.error("Gagal mengirim data.");
            }
        } catch (error) {
            showErrorMessage(error.response.data.message);
            setLoading(false);
            console.error("Error:", error);
        }
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

    const dataModal = {
        idModal: idModal,
        title: [
            <label
                key={"title"}
                className="flex gap-1 items-center font-semibold"
            >
                Hapus Permanen Data Transaksi Obat Masuk
            </label>,
        ],
        body: [
            <div key={"input"} className="flex flex-col gap-3">
                Apakah Anda yakin ingin menghapus permanen data ini?
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

export default HapusPermanenObatMasuk;
