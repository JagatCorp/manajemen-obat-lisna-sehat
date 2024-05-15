const formatNumberWithCurrency = (number) => {
    // Memformat angka dengan dua angka desimal dan tambahkan simbol mata uang
    return `Rp ${number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

export default formatNumberWithCurrency;