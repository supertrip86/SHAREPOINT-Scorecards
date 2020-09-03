module.exports = {
	on: on,
	getNodes: getNodes,
};

function on(selector, eventType, childSelector, eventHandler) {
	const elements = document.querySelectorAll(selector);

    for (element of elements) {
      	element.addEventListener(eventType, eventOnElement => {
			if (eventOnElement.target.matches(childSelector)) {
				eventHandler(eventOnElement);
			}
      	});
    }
}

function getNodes(value, context) {
	const target = context ? context : document;

	return Array.from(target.querySelectorAll(value));
}