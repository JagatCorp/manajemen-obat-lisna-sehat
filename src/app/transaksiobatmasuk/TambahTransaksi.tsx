import { ModalForm } from "@/components/modal/ModalForm";
import axios from "axios";
import { use, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import API_URL from "../config";
import { set } from "date-fns";
import formatNumberWithCurrency from "@/components/formatNumberWithCurrency";


const TambahTransaksi = ({ idModal, fetchData, dataObat, dataPrinciple }) => {
    // console.log('obat', dataObat);

    const [loading, setLoading] = useState(false);
    const obat_ref = useRef(null);
    const principle_ref = useRef(null);

    const [hargaHasil, setHargaHasil] = useState(null);
    const [jumlahHasil, setJumlahHasil] = useState(null);
    const [hasil, setHasil] = useState(null);

    const [formData, setFormData] = useState({
        obat_id: "",
        harga: "",
        principle_id: "",
        jml_obat: "",
        createdAt: '',
    });

    const handleSubmit = async (e) => {
        // e.preventDefault();
        setLoading(true);

        try {
            var formDataToSend = new FormData();
            formDataToSend.append("obat_id", formData.obat_id);
            formDataToSend.append("harga", formData.harga);
            formDataToSend.append("principle_id", formData.principle_id);
            formDataToSend.append("jml_obat", formData.jml_obat);
            formDataToSend.append("createdAt", formData.createdAt);

            const response = await axios.post(
                API_URL + "/transaksi_obat_masuk",
                formDataToSend, // Kirim FormData
                {
                    headers: {
                        "Content-Type": "application/json",
                        // "Content-Type": "multipart/form-data",
                    },
                },
            );

            if (response.status === 200) {
                showToastMessage("Data berhasil ditambahkan!");

                const modalTambah = document.getElementById(idModal);
                if (modalTambah instanceof HTMLDialogElement) {
                    modalTambah.close();
                }

                principle_ref.current.value = null;
                obat_ref.current.value = null;

                setFormData(prevData => ({
                    ...prevData,
                    stok: "",
                    harga: "",
                    jml_obat: "",
                    createdAt: "",
                }));

                setHargaHasil(0);
                setJumlahHasil(0);
                setHasil(0);

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

        if (e.target.name === 'harga' && e.target.value != '') {
            setHargaHasil(e.target.value);
            setHasil(Number(e.target.value) * Number(formData.jml_obat));
        }

        if (e.target.name === 'jml_obat' && e.target.value != '') {
            setJumlahHasil(e.target.value);
            setHasil(Number(formData.harga) * Number(e.target.value));
        }
    };

    const handleSelectChange = (event) => {
        const selectedId = event.target.value;
        if (selectedId != '') {
            const obat = dataObat.find(o => o.id === parseInt(selectedId));
            console.log('obat', obat);
            setFormData(prevData => ({
                ...prevData,
                ['harga']: obat.harga,
                ['obat_id']: obat.id,
            }));
            setHargaHasil(obat.harga);
            setHasil(obat.harga * parseInt(formData.jml_obat));
        }
    };

    const dataModal = {
        idModal: idModal,
        title: [
            <label
                key={"title"}
                className="flex gap-1 items-center font-semibold"
            >
                Hapus Data Obat
            </label>,
        ],
        body: [
            <div key={"input"} className="flex flex-col gap-3">
                <div className="">
                    <label htmlFor="obat_id">Obat :</label>
                    <select
                        name="obat_id"
                        id="obat_id"
                        ref={obat_ref}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        required
                        onChange={handleSelectChange}
                    >
                        <option value=''>-- Pilih Obat --</option>
                        {dataObat.map((obat) => (
                            <option key={obat.id} value={obat.id}>{obat.nama_obat}</option>
                        ))}
                    </select>
                </div>
                <div className="">
                    <label htmlFor="principle_id">Principle :</label>
                    <select name="principle_id" id="principle_id"
                        onChange={handleChange}
                        ref={principle_ref}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        required>
                        <option value=''>-- Pilih Principle --</option>
                        {dataPrinciple.map((principle, index) => (
                            <option value={principle['id']}>{principle['attributes']['nama_instansi']}</option>
                        ))}
                    </select>
                </div>
                <div className="">
                    <label htmlFor="jml_obat">Jumlah :</label>
                    <input
                        type="number"
                        name="jml_obat"
                        id="jml_obat"
                        min="0"
                        value={formData.jml_obat}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
                <div className="">
                    <label htmlFor="harga">Harga Satuan Box :</label>
                    <input
                        type="number"
                        name="harga"
                        id="harga"
                        min="0"
                        value={formData.harga}
                        // value={selectedObat ? selectedObat.harga : ''}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
                <div className="">
                    <label htmlFor="createdAt">Tanggal :</label>
                    <input
                        type="datetime-local"
                        name="createdAt"
                        id="createdAt"
                        value={formData.createdAt}
                        onChange={handleChange}
                        className="border w-full rounded-md p-2 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>
            </div>,
            <hr className="mt-3 mb-3" />,
            <div id="hasil">
                <div className="text-center">Detail Pengeluaran</div>
                {hargaHasil ? formatNumberWithCurrency(parseInt(hargaHasil)) : 0} x {jumlahHasil ?? 0} = {hasil ? formatNumberWithCurrency(parseInt(hasil)) : 0}
            </div>,
        ],
        footer: [
            <>
                <button
                    onClick={() => {
                        const modalTambah = document.getElementById(idModal);
                        if (modalTambah instanceof HTMLDialogElement) {
                            modalTambah.close();
                        }
                    }}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm">
                    Cancel
                </button>
                <button
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

export default TambahTransaksi;
