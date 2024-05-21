import { useEffect, useState } from "react";
// import Loader from "./Loader";
import './index.css';

export const ModalForm = ({ dataModal }) => {

    // console.log(localStorage.getItem('color-theme') == '"dark"');

    const [colorTheme, setColorTheme] = useState('');
    
    useEffect(() => {
        setColorTheme(localStorage.getItem('color-theme'));
        
        const intervalId = setInterval(() => {
            setColorTheme(localStorage.getItem('color-theme'));
        }, 500);

        return () => clearInterval(intervalId);
    }, [])
    
    return (
        <>
            <dialog id={dataModal.idModal} className="modal rounded-xl">
                <form method="dialog" className="dark:bg-slate-700">
                    <div className="modal-box w-72 md:w-[600px] h-auto p-3">
                        <div className="flex justify-between modal-footer border-b pb-2 dark:text-white">
                            {dataModal.title}
                        </div>
                        <div className="mt-2 py-1">
                            <div className={`modal-body text-start w-full ${localStorage.getItem('color-theme') == '"dark"' ? 'inputDark' : '' }`}>
                                {dataModal.body}
                            </div>
                            <div className=" mt-6 flex gap-4 justify-end dark:text-white">
                                {dataModal.footer}
                            </div>
                        </div>
                    </div>
                </form>
            </dialog>
        </>
    );
};
