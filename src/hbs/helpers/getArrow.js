module.exports = function(arrow) {
    switch (arrow) {
        case 0:
            return '';
        case 1:
            return 'scorecard-indicator-arrow-down';
        case 2:
            return 'scorecard-indicator-arrow-right';
        case 3:
            return 'scorecard-indicator-arrow-up';
    }
};