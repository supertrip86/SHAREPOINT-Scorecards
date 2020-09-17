module.exports = function(item) {
    const color = item.color;

    switch (color) {
        case "Grey":
            return "grey-square";
        case "Blue":
            return "blue-square";
        case "Orange":
            return "orange-square";
    }
};