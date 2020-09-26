module.exports = function(value) {
    const likelihood = value ? value : 0;

    switch (likelihood) {
        case 0:
            return '';
        case 1:
            return 'green-line';
        case 2:
            return 'yellow-line';
        case 3:
            return 'orange-line';
        case 4:
            return 'red-line';
    }
};