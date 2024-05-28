import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import API_URL from '@/app/config';

// Functional Component
const ExcelObat = () => {
    const [data, setData] = useState([]);

    const [inputBulan, setInputBulan] = useState('');
    const [inputTahun, setInputTahun] = useState('');

    const bulan = {
        "Januari": 31,
        "Februari": 29,
        "Maret": 31,
        "April": 30,
        "Mei": 31,
        "Juni": 30,
        "Juli": 31,
        "Agustus": 31,
        "September": 30,
        "Oktober": 31,
        "November": 30,
        "Desember": 31
    };

    // Fetch data function using useEffect to run on component mount
    // useEffect(() => {
    const fetchData = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("tahun", inputTahun);
            formDataToSend.append("bulan", inputBulan);

            const response = await axios.post(`${API_URL}/obat/data/`, formDataToSend, {
                headers: {
                    "Content-Type": "application/json",
                    // "Content-Type": "multipart/form-data",
                },
            });

            // console.log('excel');
            // console.log('excel', response);
            if (response.status === 200) {
                setData(response.data.data);
                console.log('excel', response);
            } else {
                console.error(response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //     fetchData();
    // }, []);

    // Function to create styled Excel file
    const CreateStyledExcelFile = async () => {
        fetchData();
        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Styled Sheet');

        // Add a row with headers and apply styles
        const headerRow = worksheet.addRow(['LAPORAN STOK OBAT KLINIK LISNA SEHAT']);
        headerRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true, color: { argb: 'FF000000' }, size: 12 };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
            };
        });
        worksheet.mergeCells(`A1:C1`);

        // PERIODE
        worksheet.getCell('D1').value = 'PERIODE ' + 'TAHUN ' + inputTahun + ' BULAN ' + inputBulan;
        worksheet.getCell('D1').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('D1').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('D1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.getColumn(5).width = 10;
        worksheet.mergeCells('D1', 'G1');

        // Add some data with different styles
        const row1 = worksheet.addRow(['NO.', 'Nama Barang', 'Prinsipal', 'CONVERSI SATUAN BOX - TABLET', 'SAT']);

        // NO.
        row1.getCell(1).font = { name: 'Arial', size: 14, color: { argb: 'FF000000' }, bold: true };
        row1.getCell(1).alignment = {
            vertical: 'middle',
            horizontal: 'center',
        };
        worksheet.mergeCells(`A2:A4`);

        // NAMA BARANG
        row1.getCell(2).font = { name: 'Arial', size: 14, color: { argb: 'FF000000' }, bold: true };
        row1.getCell(2).alignment = {
            vertical: 'middle',
            horizontal: 'center',
        };
        worksheet.getColumn(2).width = 20; // Set width for column B (Nama Barang)
        worksheet.mergeCells(`B2:B4`);

        // PRINCIPLE
        row1.getCell(3).font = { name: 'Arial', size: 14, color: { argb: 'FF000000' }, bold: true };
        row1.getCell(3).alignment = {
            vertical: 'middle',
            horizontal: 'center',
        };
        worksheet.getColumn(3).width = 20;
        worksheet.mergeCells(`C2:C4`);

        // CONVERSI SATUAN BOX - TABLET
        row1.getCell(4).font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        row1.getCell(4).alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true
        };
        worksheet.mergeCells('D2', 'F3');

        // QTY / BOX
        worksheet.getCell('D4').value = 'QTY / BOX';
        worksheet.getCell('D4').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('D4').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('D4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.getColumn(5).width = 10;
        worksheet.mergeCells('D4', 'E4');

        // QTY / SAT
        worksheet.getCell('F4').value = 'QTY / SAT';
        worksheet.getCell('F4').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('F4').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('F4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.getColumn(5).width = 10;

        // SAT
        worksheet.getCell('G2').value = 'SAT';
        worksheet.getCell('G2').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('G2').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('G2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.getColumn(5).width = 5;
        worksheet.mergeCells('G2', 'G4');

        // STOK
        worksheet.getCell('H2').value = 'STOK';
        worksheet.getCell('H2').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('H2').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('H2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('H2', 'H4');

        // Menambahkan row "Tanggal" dan menggabungkan sel dari I hingga AE
        worksheet.mergeCells('I2:BR2');
        worksheet.getCell('I2').value = 'TANGGAL';
        worksheet.getCell('I2').font = { bold: true, size: 14 };
        worksheet.getCell('I2').alignment = { vertical: 'middle', horizontal: 'center' };

        // Loop untuk menambahkan tanggal dan subheader "M" dan "K"
        for (let i = 0; i < 31; i++) {
            const dateColumnIndex = 9 + i * 2; // Mulai dari kolom I (9) dan tambahkan offset untuk setiap tanggal

            // Tanggal 1-31 di baris 3
            worksheet.getCell(3, dateColumnIndex).value = (i + 1).toString();
            worksheet.getCell(3, dateColumnIndex).font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
            worksheet.getCell(3, dateColumnIndex).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            worksheet.getCell(3, dateColumnIndex).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background

            // Menggabungkan sel untuk tanggal
            worksheet.mergeCells(3, dateColumnIndex, 3, dateColumnIndex + 1);

            // Subheader "M" di baris 4
            worksheet.getCell(4, dateColumnIndex).value = 'M';
            worksheet.getCell(4, dateColumnIndex).font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
            worksheet.getCell(4, dateColumnIndex).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            worksheet.getCell(4, dateColumnIndex).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background

            // Subheader "K" di baris 4
            worksheet.getCell(4, dateColumnIndex + 1).value = 'K';
            worksheet.getCell(4, dateColumnIndex + 1).font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
            worksheet.getCell(4, dateColumnIndex + 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            worksheet.getCell(4, dateColumnIndex + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        }


        // JUMLAH STOK
        worksheet.getCell('BS2').value = 'JUMLAH STOK';
        worksheet.getCell('BS2').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('BS2').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('BS2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('BS2', 'BT3');

        // M
        worksheet.getCell('BS4').value = 'M';
        worksheet.getCell('BS4').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('BS4').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('BS4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background

        // K
        worksheet.getCell('BT4').value = 'K';
        worksheet.getCell('BT4').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('BT4').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('BT4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background

        // SISA STOK
        worksheet.getCell('BU2').value = 'SISA STOK';
        worksheet.getCell('BU2').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('BU2').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('BU2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.getColumn(5).width = 5;
        worksheet.mergeCells('BU2', 'BU4');

        // PEMBELIAN
        worksheet.getCell('BV2').value = 'PEMBELIAN';
        worksheet.getCell('BV2').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('BV2').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('BV2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('BV2', 'CC2');

        // HARGA DPP / BOX
        worksheet.getCell('BV3').value = 'HARGA DPP / BOX';
        worksheet.getCell('BV3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('BV3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('BV3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('BV3', 'BV4');

        // DISC
        worksheet.getCell('BW3').value = 'DISC';
        worksheet.getCell('BW3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('BW3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('BW3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('BW3', 'BW4');

        // DISC (dikosong)
        worksheet.getCell('BX3').value = '%';
        worksheet.getCell('BX3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('BX3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('BX3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('BX3', 'BX4');

        // HARGA (-) DISC
        worksheet.getCell('BY3').value = 'HARGA (-) DISC';
        worksheet.getCell('BY3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('BY3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('BY3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('BY3', 'BY4');

        // PPN
        worksheet.getCell('BZ3').value = 'PPN';
        worksheet.getCell('BZ3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('BZ3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('BZ3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('BZ3', 'BZ4');

        // HARGA SETELAH PPN
        worksheet.getCell('CA3').value = 'HARGA SETELAH PPN';
        worksheet.getCell('CA3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CA3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CA3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CA3', 'CA4');

        // HARGA SATUAN
        worksheet.getCell('CB3').value = 'HARGA SATUAN';
        worksheet.getCell('CB3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CB3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CB3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CB3', 'CB4');

        // JUMLAH
        worksheet.getCell('CC3').value = 'JUMLAH';
        worksheet.getCell('CC3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CC3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CC3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CC3', 'CC4');


        // PENJUALAN
        worksheet.getCell('CD2').value = 'PENJUALAN';
        worksheet.getCell('CD2').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CD2').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CD2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CD2', 'CE2');

        // HARGA / SATUAN
        worksheet.getCell('CD3').value = 'HARGA / SATUAN';
        worksheet.getCell('CD3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CD3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CD3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CD3', 'CD4');

        // JUMLAH
        worksheet.getCell('CE3').value = 'JUMLAH';
        worksheet.getCell('CE3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CE3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CE3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CE3', 'CE4');

        // PROFIT / SATUAN
        worksheet.getCell('CF2').value = 'PROFIT / SATUAN';
        worksheet.getCell('CF2').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CF2').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CF2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CF2', 'CF4');

        // NOTED
        worksheet.getCell('CG2').value = 'NOTED';
        worksheet.getCell('CG2').font = { name: 'Arial', size: 15, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CG2').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CG2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.getColumn('CG').width = 20;
        worksheet.mergeCells('CG2', 'CG4');

        // PEMBELIAN
        worksheet.getCell('CH2').value = 'PEMBELIAN';
        worksheet.getCell('CH2').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CH2').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CH2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CH2', 'CS2');

        // HARGA ASLI
        worksheet.getCell('CH3').value = 'HARGA ASLI';
        worksheet.getCell('CH3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CH3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CH3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CH3', 'CH4');

        // HNA / SATUAN
        worksheet.getCell('CI3').value = 'HNA / SATUAN';
        worksheet.getCell('CI3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CI3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CI3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CI3', 'CI4');

        // PPN 11%
        worksheet.getCell('CJ3').value = 'PPN 11%';
        worksheet.getCell('CJ3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CJ3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CJ3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CJ3', 'CJ4');

        // HNA SETELAH PPN
        worksheet.getCell('CK3').value = 'HNA SETELAH PPN';
        worksheet.getCell('CK3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CK3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CK3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CK3', 'CK4');

        // MARGIN 15%
        worksheet.getCell('CL3').value = 'MARGIN 15%';
        worksheet.getCell('CL3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CL3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CL3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CL3', 'CM3');

        // MARGIN 15% (%)
        worksheet.getCell('CL4').value = '%';
        worksheet.getCell('CL4').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CL4').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CL4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background

        // MARGIN 15% (RP)
        worksheet.getCell('CM4').value = 'RP';
        worksheet.getCell('CM4').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CM4').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CM4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background

        // HNA + PPN + MARGIN 15%
        worksheet.getCell('CN3').value = 'HNA + PPN + MARGIN 15%';
        worksheet.getCell('CN3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CN3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CN3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CN3', 'CN4');

        // PEMBELIAN - PENJUALAN
        worksheet.getCell('CO3').value = 'PEMBELIAN - PENJUALAN';
        worksheet.getCell('CO3').font = { name: 'Arial', size: 7, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CO3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CO3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CO3', 'CO4');

        // DISC
        worksheet.getCell('CP3').value = 'DISC';
        worksheet.getCell('CP3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CP3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CP3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CP3', 'CP4');

        // DISC PRINCIPAL
        worksheet.getCell('CQ3').value = 'DISC PRINCIPAL';
        worksheet.getCell('CQ3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CQ3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CQ3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CQ3', 'CQ4');

        // PROFIT / SATUAN
        worksheet.getCell('CR3').value = 'PROFIT / SATUAN';
        worksheet.getCell('CR3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CR3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CR3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CR3', 'CR4');

        // PROFIT TOTAL
        worksheet.getCell('CS3').value = 'PROFIT TOTAL';
        worksheet.getCell('CS3').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CS3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CS3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CS3', 'CS4');

        // HARGA PENJUALAN
        worksheet.getCell('CT2').value = 'HARGA PENJUALAN';
        worksheet.getCell('CT2').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CT2').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CT2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CT2', 'CT4');

        // TOTAL SALDO
        worksheet.getCell('CU2').value = 'TOTAL SALDO';
        worksheet.getCell('CU2').font = { name: 'Arial', size: 8, color: { argb: 'FF000000' }, bold: true };
        worksheet.getCell('CU2').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        worksheet.getCell('CU2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White background
        worksheet.mergeCells('CU2', 'CU4');


        // Fungsi untuk memberikan border pada semua sel
        function addBorderToCell(cell) {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        }

        // Menelusuri setiap baris dan setiap sel dalam worksheet
        worksheet.eachRow({ includeEmpty: true }, function (row) {
            row.eachCell({ includeEmpty: true }, function (cell) {
                addBorderToCell(cell);
            });
        });

        // Mengisi data
        data.forEach((item, index) => {
            const rowIndex = 5 + index;
            worksheet.getCell(`A${rowIndex}`).value = item.no;
            worksheet.getCell(`B${rowIndex}`).value = item.namaBarang;
            worksheet.getCell(`C${rowIndex}`).value = item.prinsipal;

            worksheet.getCell(`D${rowIndex}`).value = '1';
            worksheet.getCell(`E${rowIndex}`).value = item.satuan_box;
            worksheet.getCell(`F${rowIndex}`).value = item.qtySat;

            worksheet.getCell(`G${rowIndex}`).value = item.satuan_sat;
            worksheet.getCell(`H${rowIndex}`).value = item.stok;
            worksheet.getCell(`BS${rowIndex}`).value = item.jumlahStok.M;

            worksheet.getCell(`BT${rowIndex}`).value = item.jumlahStok.K;
            worksheet.getCell(`BU${rowIndex}`).value = item.sisaStok;
            worksheet.getCell(`BV${rowIndex}`).value = item.hargaDPPBox;

            worksheet.getCell(`BW${rowIndex}`).value = item.disc;
            worksheet.getCell(`BX${rowIndex}`).value = item.per_disc + '%';
            worksheet.getCell(`BY${rowIndex}`).value = item.harga_disc;

            worksheet.getCell(`BZ${rowIndex}`).value = item.ppn_pem;
            worksheet.getCell(`CA${rowIndex}`).value = item.hrg_set_ppn;
            worksheet.getCell(`CB${rowIndex}`).value = item.hrg_sat_pem;

            worksheet.getCell(`CC${rowIndex}`).value = item.jumlah_pem;

            worksheet.getCell(`CD${rowIndex}`).value = item.hrg_sat_pen;
            worksheet.getCell(`CE${rowIndex}`).value = item.jumlah_pen;

            worksheet.getCell(`CF${rowIndex}`).value = item.profit_sat;
            worksheet.getCell(`CH${rowIndex}`).value = item.harga_asli;
            worksheet.getCell(`CI${rowIndex}`).value = item.hna_satuan;

            worksheet.getCell(`CJ${rowIndex}`).value = item.ppn11;
            worksheet.getCell(`CK${rowIndex}`).value = item.set_hna_ppn;

            worksheet.getCell(`CL${rowIndex}`).value = item.per_margin + '%';
            worksheet.getCell(`CM${rowIndex}`).value = item.rp_margin;
            worksheet.getCell(`CN${rowIndex}`).value = item.hna_ppn_margin;

            worksheet.getCell(`CO${rowIndex}`).value = item.pem_pen;
            worksheet.getCell(`CP${rowIndex}`).value = item.disc_pem + '%';
            worksheet.getCell(`CQ${rowIndex}`).value = item.disc_pem_principle;

            worksheet.getCell(`CR${rowIndex}`).value = item.profit_sat_pem;
            worksheet.getCell(`CS${rowIndex}`).value = item.profit_total_pem;
            worksheet.getCell(`CT${rowIndex}`).value = item.hrg_penjualan;

            worksheet.getCell(`CU${rowIndex}`).value = item.total_saldo;


            // Mengisi kolom tanggal
            for (let i = 0; i < bulan[inputBulan]; i++) {
                const dateColumnIndex = 9 + i * 2;
                const dayData = item.tanggal[i + 1];
                worksheet.getCell(rowIndex, dateColumnIndex).value = dayData ? dayData.M : 0;
                worksheet.getCell(rowIndex, dateColumnIndex + 1).value = dayData ? dayData.K : 0;
            }

        });


        // Save the workbook to a buffer
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'styled_example.xlsx');
    };

    return (
        <div>
            <button onClick={CreateStyledExcelFile}>Download Excel File</button>
            <div className='flex gap-5'>
                <div className='flex flex-col'>
                    <label htmlFor="bulan">Pilih Bulan:</label>
                    <select id="bulan" onChange={(e) => setInputBulan(e.target.value as any)}
                        className="w-48 rounded-l-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md dark:bg-slate-500 dark:text-white md:w-56"
                    >
                        <option value="">- Masukan Tanggal -</option>
                        <option value="Januari">Januari</option>
                        <option value="Februari">Februari</option>
                        <option value="Maret">Maret</option>
                        <option value="April">April</option>
                        <option value="Mei">Mei</option>
                        <option value="Juni">Juni</option>
                        <option value="Juli">Juli</option>
                        <option value="Agustus">Agustus</option>
                        <option value="September">September</option>
                        <option value="Oktober">Oktober</option>
                        <option value="November">November</option>
                        <option value="Desember">Desember</option>
                    </select>
                </div>

                <div className='flex flex-col'>
                    <label htmlFor="tahun">Pilih Tahun:</label>
                    <select id="tahun" onChange={(e) => setInputTahun(e.target.value)}
                        className="w-48 rounded-l-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md dark:bg-slate-500 dark:text-white md:w-56"
                    >
                        {/* Pilihan tahun, misalnya dari 1900 hingga 2100 */}
                        <option value="">- Masukan Tahun -</option>
                        {Array.from({ length: 2101 - 1900 }, (_, i) => 1900 + i).map(year => (
                            <option value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ExcelObat;
