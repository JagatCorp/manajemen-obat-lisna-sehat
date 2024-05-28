import { ModalForm } from "@/components/modal/ModalForm";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import API_URL from "../config";

const EditSatuanDokter = ({ idModal, data, fetchData }) => {
    // console.log('data', data);
    const [loading, setLoading] = useState(false);

    const gambarRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        nama_dokter: "",
        jk: "",
        mulai_praktik: "",
        selesai_praktik: "",
        hari_praktik: "",
        gambar_dokter: "",
        spesialis_dokter_id: "",
        username: "",
        password: "",
    });

    useEffect(() => {
        setFormData({
            nama_dokter: data.nama_dokter,
            jk: data.jk,
            mulai_praktik: data.mulai_praktik,
            selesai_praktik: data.selesai_praktik,
            hari_praktik: data.hari_praktik,
            gambar_dokter: data.gambar_dokter,
            spesialis_dokter_id: data.spesialis_dokter_id,
            username: data.username,
            password: data.password,
        });
    }, [data]);

    const handleSubmit = async (e) => {
        // e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("nama_dokter", formData.nama_dokter);
            formDataToSend.append("jk", formData.jk);
            formDataToSend.append("mulai_praktik", formData.mulai_praktik);
            formDataToSend.append("selesai_praktik", formData.selesai_praktik);
            formDataToSend.append("hari_praktik", formData.hari_praktik);
            formDataToSend.append("gambar_dokter", formData.gambar_dokter);
            formDataToSend.append("spesialis_dokter_id", formData.spesialis_dokter_id);
            formDataToSend.append("username", formData.username);
            formDataToSend.append("password", formData.password);
            formDataToSend.append("profile", 'true');
            
            if (gambarRef.current) {
                gambarRef.current.value = null;
            }
            
            const response = await axios.put(
                API_URL + "/dokter/" + localStorage.getItem('id'),
                formDataToSend, // Kirim FormData
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            const modalEdit = document.getElementById(idModal);
            if (modalEdit instanceof HTMLDialogElement) {
                modalEdit.close();
            }

            
            if (response.status === 200) {
                // console.log('coba',response);
                showToastMessage("Data Dokter berhasil diubah!", true);
                setLoading(false);
                fetchData();
                // console.log('coba', data.urlGambar);
                if(formData.gambar_dokter){
                    localStorage.setItem('urlGambar', response.data.urlGambar);
                }
            } else {
                showToastMessage("Data Dokter gagal diubah!", false);
                setLoading(false);
                console.error("Gagal mengirim data.");
            }
        } catch (error) {
            showToastMessage("Data Dokter gagal diubah!", false);
            setLoading(false);
            console.error("Error:", error);
        }
    };

    const showToastMessage = (message: string, status: boolean) => {
        if (status) {
            toast.success(message, {
                position: "top-right",
            });
        } else {
            toast.error(message, {
                position: "top-right",
            });
        }
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
                Edit Data Dokter
            </label>,
        ],
        body: [
            <div key={"input1"} className="flex flex-col gap-3">
                <div className="">
                    <label htmlFor="nama_dokter">Nama :</label>
                    <input
                        type="text"
                        name="nama_dokter"
                        id="nama_dokter"
                        value={formData.nama_dokter}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
            </div>,
            <div key={"input2"} className="flex flex-col gap-3">
                <div className="">
                    <label htmlFor="jk">Jenis Kelamin :</label>
                    <select
                        name="jk"
                        id="jk"
                        value={formData.jk}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    >
                        <option value="L">Laki-Laki</option>
                        <option value="P">Perempuan</option>
                    </select>
                </div>
            </div>,
            <div key={"input3"} className="flex flex-col gap-3">
                <div className="">
                    <label htmlFor="hari_praktik">Hari Praktik :</label>
                    <input
                        type="text"
                        name="hari_praktik"
                        id="hari_praktik"
                        value={formData.hari_praktik}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
            </div>,
            <div key={"input4"} className="flex flex-col gap-3">
                <div className="flex gap-3 justify-center">
                    <div>
                        <label htmlFor="mulai_praktik">Mulai Praktik :</label>
                        <input
                            type="time"
                            name="mulai_praktik"
                            id="mulai_praktik"
                            value={formData.mulai_praktik}
                            onChange={handleChange}
                            className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="mulai_praktik">Selesai Praktik :</label>
                        <input
                            type="time"
                            name="selesai_praktik"
                            id="selesai_praktik"
                            value={formData.selesai_praktik}
                            onChange={handleChange}
                            className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        />
                    </div>
                </div>
            </div>,
            <div key={"input5"} className="flex flex-col gap-3">
                <div className="">
                    <label htmlFor="gambar_dokter">Gambar Profile :</label>
                    <input
                        ref={gambarRef}
                        type="file"
                        name="gambar_dokter"
                        id="gambar_dokter"
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
            </div>,
            <div key={"input6"}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="Username"
                />
            </div>,
            <div key={"input7"} className="mb-3">
                <label htmlFor="password">Password :</label>
                <input
                    type="text"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    placeholder="Password"
                />
                <small>Kosongkan bila tidak ingin mengubah password</small>
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

export default EditSatuanDokter;
