const formatNumberWithCurrency = (number) => {
    if (number === null || number === undefined) {
        return 'Rp 0'; // atau Anda dapat mengembalikan nilai default yang sesuai
    }
    return `Rp ${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export default formatNumberWithCurrency;