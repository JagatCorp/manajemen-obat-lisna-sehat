// const formatNumberWithCurrency = (number) => {
//     if (number === null || number === undefined) {
//         return 'Rp 0'; // atau Anda dapat mengembalikan nilai default yang sesuai
//     }
//     return `Rp ${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
// };

// export default formatNumberWithCurrency;

const formatNumberWithCurrency = (number) => {
    if (number === null || number === undefined || isNaN(number)) {
        return 'Rp 0';
    }

    // Remove commas from the input and convert it to a number
    const cleanedNumber = parseFloat(number.toString().replace(/,/g, ''));

    // Handle the case where parsing fails
    if (isNaN(cleanedNumber)) {
        return 'Rp 0';
    }

    // Format the number with commas
    const formattedNumber = cleanedNumber.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return `Rp ${formattedNumber}`;
};

export default formatNumberWithCurrency;
