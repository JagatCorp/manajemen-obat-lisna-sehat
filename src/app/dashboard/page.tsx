"use client";
import ChatCard from '@/components/Chat/ChatCard';
import { BRAND } from "@/types/brand";
import Image from "next/image";
import API_URL from '../config';
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import FormattedDate from "@/components/FormattedDate";

const Dashboard = () => {
  const [obat, setObat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/transaksi_obat_masuk/hariini?page=${currentPage}`
      );
      setObat(response.data.data);
      setTotalPages(response.data.totalPages);
      setPageSize(response.data.pageSize);
      setTotalCount(response.data.totalCount);
    } catch (error: any) {
      console.error("Error fetching data Obat:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const formatNumberWithCurrency = (number) => {
    // Memformat angka dengan dua angka desimal dan tambahkan simbol mata uang
    return `Rp ${number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  return (
    <div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
              Transaksi Obat Masuk Hari Ini!
            </h4>
            <div className="flex flex-col">
              <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                <div className="p-2.5 xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Obat</h5>
                </div>
                <div className="p-2.5 xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Principle</h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Jumlah</h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Harga</h5>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Tanggal</h5>
                </div>
              </div>

              {loading ? (
                <div>Loading...</div>
              ) : error ? (
                <div>{error}</div>
              ) : obat.length > 0 ? (
                obat.map((item, key) => (
                  <div
                    className={`grid grid-cols-3 sm:grid-cols-5 ${
                      key === obat.length - 1
                        ? ""
                        : "border-b border-stroke dark:border-strokedark"
                    }`}
                    key={key}
                  >
                    <div className="flex items-center gap-3 p-2.5 xl:p-5">
                      <div className="flex-shrink-0">
                        <img src={item['urlGambar']} alt="Brand" width={48} height={48} />
                      </div>
                      <p className="hidden text-black dark:text-white sm:block">
                        {item['obat']["nama_obat"]}
                      </p>
                    </div>

                    <div className="flex items-center justify-center p-2.5 xl:p-5"> 
                      <p className="text-black dark:text-white"> {item['principle']['nama_instansi']}</p>
                    </div>
 
                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                      <p className="text-black dark:text-white">{item['jml_obat']}</p>
                    </div>

                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                      <p className="text-meta-3">{formatNumberWithCurrency(item['harga'])}</p>
                    </div>

                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                      <p className="text-black dark:text-white">
                        <FormattedDate date={item['createdAt']} />
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">Tidak Ada Data Obat</div>
              )}
            </div>
          </div>
        </div>
        <ChatCard />
      </div>
    </div>
  );
};

export default Dashboard;
