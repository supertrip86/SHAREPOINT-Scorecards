module.exports = function() {
    const year = new Date().getFullYear();
    const rawMonth = new Date().getMonth() +1;
    const month = rawMonth < 10 ? `0${rawMonth}` : rawMonth;

    return `${year}-${month}`;
};