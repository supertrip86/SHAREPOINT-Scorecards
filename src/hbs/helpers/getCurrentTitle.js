module.exports = function() {
	const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	const startDate = document.getElementById('date-button').value.split('-').map( (i) => parseInt(i) );
	const month = startDate[1] -1;
	const year = startDate[0];

	return `WCA SCORECARDS, ${months[month]} ${year}`;
};