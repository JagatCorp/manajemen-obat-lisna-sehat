import { ModalForm } from "@/components/modal/ModalForm";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import API_URL from "../config";


const PenjualPembuatPrinciple = ({ idModal, distributor, principle, fetchData }) => {
    // console.log('coba aja', distributor);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        principle_id: "",
        distributor_id: "",
    });

    const handleSubmit = async (e) => {
        // e.preventDefault();

        console.log(formData);
        
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("distributor_id", formData.distributor_id);
            formDataToSend.append("principle_id", principle.id);

            const response = await axios.post(
                API_URL + "/penjualpembuat",
                formDataToSend, // Kirim FormData
                {
                    headers: {
                        "Content-Type": "application/json",
                        // "Content-Type": "multipart/form-data",
                        // Tidak perlu menentukan 'Content-Type', axios akan menanganinya
                    },
                },
            );

            if (response.status === 200) {
                showToastMessage("Data berhasil ditambahkan!");

                const modalPenjualPembuat = document.getElementById(idModal);
                if (modalPenjualPembuat instanceof HTMLDialogElement) {
                    modalPenjualPembuat.close();
                }

                setFormData({
                    principle_id: "",
                    distributor_id: "",
                });

                setLoading(false);
                fetchData();
            } else {
                console.error("Gagal mengirim data.");
            }
        } catch (error) {
            console.error("Error:", error.response.data.message);
            showErrorMessage(error.response.data.message);
            setTimeout(() => {
                setLoading(false);
            }, 5000);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDeletePembuat = async (itemIdToDelete, index) => {
        const id = itemIdToDelete;

        try {
            const response = await axios.delete(
                API_URL + `/penjualpembuat/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (response.status === 201) {
                throw new Error("Gagal menghapus data");
            }

            // setDataPrincipleDistributor((prevItems) => prevItems.filter((_, i) => i !== index))
            showToastMessage("Data berhasil dihapus!");

        } catch (error) {
            console.error("Terjadi kesalahan:", error);
        } finally {
            // setShowDeleteModal(false);
        }
    };

    const dataModal = {
        idModal: idModal,
        title: [
            <label
                key={"title"}
                className="flex gap-1 items-center font-semibold"
            >
                {/* <IconUserPlus color="#4777F3" /> */}
                Tambah Data Distributor
            </label>,
        ],
        body: [
            <div key={"input"} className="flex flex-col gap-3">
                <div className="w-full">
                    <ul className="bg-white shadow-md rounded-lg p-4">
                        {principle.attributes.penjualpembuat.map((data, index) => (
                            <li key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                <span className="text-gray-700">{data.barangdistributor.nama_distributor}</span>
                                <button onClick={() => handleDeletePembuat(data.id, index)} className="text-red-500 hover:text-red-700">Hapus</button>
                            </li>
                        ))}

                    </ul>
                </div>

                <div className="">
                    <label htmlFor="">Distributor :</label>
                    <select
                        name="distributor_id"
                        id="distributor_id"
                        value={formData.distributor_id}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    >
                        <option value="">
                            - Pilih Distributor -
                        </option>
                        {distributor.map((dist, index) => (
                            <option key={index} value={dist.id}>
                                {dist.nama_distributor}
                            </option>
                        ))}
                    </select>
                </div>
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

export default PenjualPembuatPrinciple;
