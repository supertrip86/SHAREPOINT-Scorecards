module.exports = function(status, options) {
    return (status != "Completed") ? options.fn(this) : options.inverse(this);
}