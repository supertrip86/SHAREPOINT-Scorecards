module.exports = {
	on: on,
	preventDefault: preventDefault,
	getNodes: getNodes,
	startLoader: startLoader,
	editorOptions: editorOptions
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

function startLoader() {
	const body = document.getElementsByTagName('body')[0];
	const dialog = document.getElementById('settingsMenu');
	const settingsIcon = document.querySelector('.settings-link');
	const spinner = '<div class="spinner"></div>';

	dialog.setAttribute('style', 'display: none;');
	settingsIcon.setAttribute('style', 'display: none;');
	body.setAttribute('style', 'user-select: none; overflow: hidden;')
	body.insertAdjacentHTML('beforeend', spinner);
}

function preventDefault(e) {
	e.preventDefault();
}

function editorOptions() {
	return {
		modules: {
			'toolbar': [ 
				[ 'bold', 'italic', 'underline' ], 
				[{ 'color': [] }, { 'background': [] }, { 'script': 'sub'}, { 'script': 'super' }], 
				[{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }], 
				[{ 'align': [] }], [ 'link'] 
			]
		},
		placeholder: 'Insert a description',
		theme: 'snow'
	};
}