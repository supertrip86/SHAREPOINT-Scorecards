module.exports = function(title) {
    const firstLetter = title.charAt(0).toUpperCase();
    const restOfTheTitle = title.slice(1);

    return `<span>${firstLetter}</span><span>${restOfTheTitle}</span>`;
};