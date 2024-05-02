import { ModalForm } from "@/components/modal/ModalForm";
import axios from "axios";
import { use, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";


const TambahObat = ({ idModal, fetchData, dataSatuan }) => {
    const [loading, setLoading] = useState(false);
    const gambar_obat_ref = useRef(null);
    const satuan_sat_ref = useRef(null);
    const satuan_box_ref = useRef(null);

    const [formData, setFormData] = useState({
        nama_obat: "",
        qty_box: "",
        qty_sat: "",
        stok: "",
        satuan_box_id: "",
        satuan_sat_id: "",
        gambar_obat: "",
    });

    const handleSubmit = async (e) => {
        // e.preventDefault();
        setLoading(true);

        try {
            var formDataToSend = new FormData();
            formDataToSend.append("nama_obat", formData.nama_obat);
            formDataToSend.append("qty_box", formData.qty_box);
            formDataToSend.append("qty_sat", formData.qty_sat);
            formDataToSend.append("stok", formData.stok);
            formDataToSend.append("satuan_box_id", formData.satuan_box_id);
            formDataToSend.append("satuan_sat_id", formData.satuan_sat_id);
            if (formData.gambar_obat) {
                formDataToSend.append("gambar_obat", formData.gambar_obat);
            }

            const response = await axios.post(
                "https://api.lisnasehat.online/api/obat",
                formDataToSend, // Kirim FormData
                {
                    headers: {
                        // "Content-Type": "application/json",
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            if (response.status === 200) {
                showToastMessage("Data berhasil ditambahkan!");
                
                const modalTambah = document.getElementById(idModal);
                if(modalTambah instanceof HTMLDialogElement){
                    modalTambah.close();
                }
                
                setFormData(prevData => ({
                    ...prevData,
                    nama_obat: "",
                    qty_box: "",
                    qty_sat: "",
                    stok: "",
                    satuan_box_id: "",
                    satuan_sat_id: "",
                    gambar_obat: "",
                }));
                
                gambar_obat_ref.current.value = "";
                satuan_box_ref.current.value = "";
                satuan_sat_ref.current.value = "";

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
        const { name, type } = e.target;
        const value = type === "file" ? e.target.files[0] : e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

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
                <div className="">
                    <label htmlFor="">Nama Obat :</label>
                    <input
                        type="text"
                        name="nama_obat"
                        id="nama_obat"
                        value={formData.nama_obat}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
                <div>
                    <div className="grid grid-cols-2">
                        <label htmlFor="">Qty Box</label>
                        <label htmlFor="">Qty Satuan</label>
                    </div>
                    <div className="flex gap-3">
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="number"
                                name="qty_box"
                                id="qty_box"
                                min="0"
                                value={formData.qty_box}
                                onChange={handleChange}
                                className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 col-span-2"
                            />
                            <select 
                            onChange={handleChange} 
                            name="satuan_box_id" 
                            id="satuan_box_id" 
                            ref={satuan_box_ref}
                            className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option value="">-</option>
                                {dataSatuan.map((satuan, index) => (
                                    <option key={index} value={satuan.id}>{satuan.attributes.nama_satuan}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="number"
                                name="qty_sat"
                                id="qty_sat"
                                min="0"
                                value={formData.qty_sat}
                                onChange={handleChange}
                                className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 col-span-2"
                            />
                            <select onChange={handleChange} 
                            name="satuan_sat_id" 
                            id="satuan_sat_id"
                            ref={satuan_sat_ref} 
                            className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option value="">-</option>
                                {dataSatuan.map((satuan, index) => (
                                    <option key={index} value={satuan.id}>{satuan.attributes.nama_satuan}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="">
                    <label htmlFor="">Stok Obat :</label>
                    <input
                        type="number"
                        name="stok"
                        id="stok"
                        min="0"
                        value={formData.stok}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
                <div className="">
                    <label htmlFor="">Gambar Obat :</label>
                    <input
                        ref={gambar_obat_ref}
                        type="file"
                        name="gambar_obat"
                        id="gambar_obat"
                        // value={formData.gambar_obat}
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
