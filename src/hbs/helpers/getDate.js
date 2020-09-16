module.exports = function(date) {
    const months = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
    const startDate = document.getElementById('date-button').value.split('-').map( (i) => parseInt(i) );
    const year = new Date(startDate[0], startDate[1]-1, 15).getFullYear();
    const month = new Date(startDate[0], startDate[1]-1, 15).getMonth();

    switch (date) {
        case "Monthly":
            return formatDate(new Date(year, month -1, 15));

        case "Quarterly":
            return formatDate(new Date(year, month -3, 15));

        case "Yearly":
            return formatDate(new Date(year -1, month, 15));

        case "All Previous Year":
            return formatDate(new Date(year -1, 0, 15));

        case "Last Three Years":
            return formatDate(new Date(year -3, month, 15));

        case "RIDE":
            const newDate = new Date(year -1, month, 15);
            return `RIDE ${String(newDate.getFullYear()).substr(2)}’`;

        default:
            return "N/A";
    }

    function formatDate(newDate) {
        const newMonth = months[newDate.getMonth()];
        const newYear = String(newDate.getFullYear()).substr(2);
    
        return `${newMonth} ${newYear}’`;
    }
};