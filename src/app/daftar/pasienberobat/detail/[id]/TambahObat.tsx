import API_URL from "@/app/config";
import { ModalForm } from "@/components/modal/ModalForm";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";


const TambahObat = ({ idModal, dataId, fetchDataObatKeluar, fetchDataObat, dataObat }) => {
    // console.log(errorMessages);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        jml_obat: "",
        obat_id: "",
        dosis: "",
    });

    const [maxJumlah, setMaxJumlah] = useState(null);

    const handleSubmit = async (e) => {
        // e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("jml_obat", formData.jml_obat);
            formDataToSend.append("obat_id", formData.obat_id);
            formDataToSend.append("dosis", formData.dosis);
            formDataToSend.append("transaksi_medis_id", dataId);

            const response = await axios.post(
                API_URL + "/transaksi_obat_keluar/",
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

                fetchDataObatKeluar();
                fetchDataObat();

                const modalTambah = document.getElementById(idModal);
                if (modalTambah instanceof HTMLDialogElement) {
                    modalTambah.close();
                }

                setFormData({
                    jml_obat: "",
                    obat_id: "",
                    dosis: "",
                });

                setLoading(false);
            } else {
                console.error("Gagal mengirim data.");
                showErrorMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            showErrorMessage(error);
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

    const handleSelect = (data) => {
        setFormData((prevData) => ({
            ...prevData,
            obat_id: data.id,
        }));

        console.log(data);

        setMaxJumlah(data.stok);
    }

    const dataModal = {
        idModal: idModal,
        title: [
            <label
                key={"title"}
                className="flex gap-1 items-center font-semibold"
            >
                Tambah Data Obat
            </label>,
        ],
        body: [
            <div key={"input"} className="flex flex-col gap-3">
                <div className="grid grid-cols-3" style={{maxHeight: '300px', overflowY: 'auto'}}>
                    {dataObat && dataObat.length > 0 ? (
                        <>
                            {dataObat.map((obat, index) => (
                                <div key={index} className={`max-w-sm rounded overflow-hidden shadow-lg bg-white w-45 h-55 mt-4 hover:cursor-pointer ${formData.obat_id === obat.id? 'border-blue-500 border-2' : ''}`}
                                onClick={() => handleSelect(obat)}
                                >
                                    <img className="w-full h-35" src={obat.urlGambar} alt="Card Image" />
                                        <div className="px-6 py-4">
                                            <div className="font-bold text-sm mb-2 truncate" title={obat.nama_obat}>{obat.nama_obat}</div>
                                            <p className="text-gray-700 text-sm">
                                                Stok Satuan: {obat.stok}
                                            </p>
                                        </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        'Tidak Ada Data Obat'
                    )}
                </div>


                <div className="">
                    <label htmlFor="jml_obat" className="text-lg">Jumlah :</label>
                    <input
                        type="number"
                        name="jml_obat"
                        id="jml_obat"
                        max={maxJumlah}
                        min={1}
                        value={formData.jml_obat}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>

                <div className="">
                    <label htmlFor="dosis" className="text-lg">Dosis:</label>
                    <input
                        type="text"
                        name="dosis"
                        id="dosis"
                        value={formData.dosis}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
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

export default TambahObat;
