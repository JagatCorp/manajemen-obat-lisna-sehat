import { useEffect, useState } from "react";
// import Loader from "./Loader";

export const ModalForm = ({ dataModal }) => {
    return (
        <>
            <dialog id={dataModal.idModal} className="modal rounded-xl">
                <form method="dialog">
                    <div className="modal-box w-72 md:w-[600px] h-auto p-3">
                        <div className="flex justify-between modal-footer border-b pb-2">
                            {dataModal.title}
                        </div>
                        <div className="mt-2 py-1">
                            <div className="modal-body text-start w-full">
                                {dataModal.body}
                            </div>
                            <div className=" mt-6 flex gap-4 justify-end">
                                {dataModal.footer}
                            </div>
                        </div>
                    </div>
                </form>
            </dialog>
        </>
    );
};
