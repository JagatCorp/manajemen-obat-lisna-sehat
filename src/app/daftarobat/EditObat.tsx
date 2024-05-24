import { ModalForm } from "@/components/modal/ModalForm";
import axios from "axios";
import { use, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import API_URL from "../config";


const EditObat = ({ idModal, fetchData, dataSatuan, dataObat }) => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nama_obat: dataObat['nama_obat'],
        qty_sat: dataObat['qty_sat'],
        stok: dataObat['stok'],
        harga: dataObat['harga'],
        satuan_box_id: dataObat['satuan_box_id'],
        satuan_sat_id: dataObat['satuan_sat_id'],
        disc_principle: dataObat['disc_principle'],
        gambar_obat: "",
    });
    
    // console.log(formData);
    const handleSubmit = async (e) => {
        // e.preventDefault();
        setLoading(true);

        var formDataToSendEdit = new FormData;
        formDataToSendEdit.append("nama_obat", formData.nama_obat);
        formDataToSendEdit.append("qty_sat", formData.qty_sat);
        formDataToSendEdit.append("stok", formData.stok);
        formDataToSendEdit.append("harga", formData.harga);
        formDataToSendEdit.append("satuan_box_id", formData.satuan_box_id);
        formDataToSendEdit.append("disc_principle", formData.disc_principle);

        if (formData.gambar_obat) {
            formDataToSendEdit.append("gambar_obat", formData.gambar_obat);
        }

        try {
            const response = await axios.put(
                API_URL + `/obat/${dataObat.id}`,
                formDataToSendEdit,
                {
                    headers: {
                        // "Content-Type": "application/json",
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
                
                // console.log(response);
            if (response.status === 200) {
                // console.log(response);
                showToastMessage("Data berhasil ditambahkan!");
                
                const modalEdit = document.getElementById(idModal);
                if(modalEdit instanceof HTMLDialogElement){
                    modalEdit.close();
                }

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

    // const handleChange = (e) => {
    //     const { name, type } = e.target;
    
    //     if (type === "file") {
    //         // Mengambil file dari input
    //         const file = e.target.files[0];
    //         // Menyimpan file ke dalam state formData
    //         setFormData((prevData) => ({
    //             ...prevData,
    //             [name]: file,
    //         }));
    //     } else {
    //         // Mengambil nilai dari input teks biasa
    //         const value = e.target.value;
    //         // Menyimpan nilai ke dalam state formData
    //         setFormData((prevData) => ({
    //             ...prevData,
    //             [name]: value,
    //         }));
    //     }
    // };

    const dataModal = {
        idModal: idModal,
        title: [
            <label
                key={"title"}
                className="flex gap-1 items-center font-semibold"
            >
                Edit Data Obat
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
                            <select 
                            onChange={handleChange} 
                            name="satuan_box_id" 
                            id="satuan_box_id" 
                            className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option value="">-</option>
                                {dataSatuan.map((satuan, index) => (
                                    <option key={index} value={satuan.id} selected={satuan.id == formData.satuan_box_id ? true : false} >{satuan.attributes.nama_satuan}</option>
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
                            className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500">
                                <option value="">-</option>
                                {dataSatuan.map((satuan, index) => (
                                    <option key={index} value={satuan.id} selected={satuan.id == formData.satuan_sat_id ? true : false} >{satuan.attributes.nama_satuan}</option>
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
                    <label htmlFor="harga">Harga Obat :</label>
                    <input
                        type="number"
                        name="harga"
                        id="harga"
                        min="0"
                        value={formData.harga}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
                <div className="">
                    <label htmlFor="disc_principle">Disc Principle :</label>
                    <input
                        type="disc_principle"
                        name="disc_principle"
                        id="disc_principle"
                        min="0"
                        value={formData.disc_principle}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
                <div className="">
                    <label htmlFor="">Gambar Obat :</label>
                    <input
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
                    {loading ? "Loading..." : "Edit"}
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

export default EditObat;
