import { ModalForm } from "@/components/modal/ModalForm";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import API_URL from "../config";

const EditSatuanPasien = ({ idModal, data, fetchData }) => {
    // console.log('modal', data.nama);
    const [loading, setLoading] = useState(false);

    const passRef = useRef(null);

    const [formData, setFormData] = useState({
        nama: "",
        alamat: "",
        jk: "",
        id_relasi: "",
        no_telp: "",
        alergi: "",
        tgl_lahir: "",
        gol_darah: "",
        username: "",
        password: "",
    });

    useEffect(() => {
        const dateObject = new Date(data.tgl_lahir);
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Tambahkan 1 karena bulan dimulai dari 0
        const day = String(dateObject.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        setFormData({
            nama: data.nama,
            alamat: data.alamat,
            jk: data.jk,
            id_relasi: data.id_relasi,
            no_telp: data.no_telp,
            alergi: data.alergi,
            tgl_lahir: formattedDate,
            gol_darah: data.gol_darah,
            username: data.username,
            password: data.password,
        });
    }, [data]);

    const handleSubmit = async (e) => {
        // e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("nama", formData.nama);
            formDataToSend.append("alamat", formData.alamat);
            formDataToSend.append("jk", formData.jk);
            formDataToSend.append("id_relasi", formData.id_relasi);
            formDataToSend.append("no_telp", formData.no_telp);
            formDataToSend.append("alergi", formData.alergi);
            formDataToSend.append("tgl_lahir", formData.tgl_lahir);
            formDataToSend.append("gol_darah", formData.gol_darah);
            formDataToSend.append("username", formData.username);
            formDataToSend.append("password", formData.password);

            const response = await axios.put(
                API_URL + "/pasien/" + sessionStorage.getItem('id'),
                formDataToSend, // Kirim FormData
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const modalEdit = document.getElementById(idModal);
            if (modalEdit instanceof HTMLDialogElement) {
                modalEdit.close();
            }

            if (response.status === 200) {
                showToastMessage("Data Pasien berhasil diubah!", true);
                setLoading(false);
                fetchData();

                passRef.current.value = null;
            } else {
                showToastMessage("Data Pasien gagal diubah!", false);
                setLoading(false);
                console.error("Gagal mengirim data.");
            }
        } catch (error) {
            showToastMessage("Data Pasien gagal diubah!", false);
            setLoading(false);
            console.error("Error:", error);
        }
    };

    const showToastMessage = (message: string, status: boolean) => {
        if(status){
            toast.success(message, {
                position: "top-right",
            });
        } else{
            toast.error(message, {
                position: "top-right",
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // console.log('nama', formData);

    const dataModal = {
        idModal: idModal,
        title: [
            <label
                key={"title"}
                className="flex gap-1 items-center font-semibold"
            >
                Edit Data Pasien
            </label>,
        ],
        body: [
            <div key={"input"} className="flex flex-col gap-3">
                <div className="">
                    <label htmlFor="">Nama :</label>
                    <input
                        type="text"
                        name="nama"
                        id="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
            </div>,
            <div key={"input"} className="flex flex-col gap-3">
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
            <div key={"input"} className="flex flex-col gap-3">
                <div className="">
                    <label htmlFor="no_telp">Nomor Telepon :</label>
                    <input
                        type="number"
                        name="no_telp"
                        id="no_telp"
                        min={0}
                        value={formData.no_telp}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
            </div>,
            <div key={"input"} className="flex flex-col gap-3">
                <div className="">
                    <label htmlFor="alergi">Alergi :</label>
                    <input
                        type="alergi"
                        name="alergi"
                        id="alergi"
                        min={0}
                        value={formData.alergi}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
            </div>,
            <div key={"input"} className="flex flex-col gap-3">
                <div className="">
                    <label htmlFor="tgl_lahir">Tanggal Lahir :</label>
                    <input
                        type="date"
                        name="tgl_lahir"
                        id="tgl_lahir"
                        min={0}
                        value={formData.tgl_lahir}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
            </div>,
            <div key={"input"} className="flex flex-col gap-3">
                <div className="">
                    <label htmlFor="gol_darah">Golongan Darah :</label>
                    <input
                        type="text"
                        name="gol_darah"
                        id="gol_darah"
                        value={formData.gol_darah}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
            </div>,
            <div key={"input"} className="flex flex-col gap-3">
                <div className="">
                    <label htmlFor="alamat">Alamat :</label>
                    <textarea
                        name="alamat"
                        id="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
            </div>,
            <div key={"input"} className="flex flex-col gap-3">
                <div className="">
                    <label htmlFor="username">Username :</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
            </div>,
            <div key={"input"} className="flex flex-col gap-3">
                <div className="">
                    <label htmlFor="password">Password :</label>
                    <input
                        ref={passRef}
                        type="text"
                        name="password"
                        id="password"
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                <small>Kosongkan bila tidak ingin mengubah password</small>
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

export default EditSatuanPasien;
