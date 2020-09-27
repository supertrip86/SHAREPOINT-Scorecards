import utilities from "./utilities";

class ScoreCardsItemSP {
    constructor(retrieved, previous, context, createMode) {
        (context == "wca-content" && createMode) && ( this.Title = utilities.createScorecardTitle() );
        (context == "wca-content" && createMode) && ( this.scoredate = utilities.fromDateToSP() );
        (context == "wca-content" && createMode) && ( this.motto = document.querySelector('.scorecard-motto').value );
        (context == "wca-content" && createMode) && ( this.comment = document.querySelector('.scorecard-main-summary .ql-editor').innerHTML );
        (context == "wca-content" && createMode) && ( this.wcadata = this.createWca() );

        (context == "wca-content" && !createMode) && ( this.motto = this.editMotto(retrieved, previous) );
        (context == "wca-content" && !createMode) && ( this.comment = this.editComment(retrieved, previous) );
        (context == "wca-content" && !createMode) && ( this.wcadata = this.editWca(retrieved, previous) );

        this.__metadata = { type: app.storage.scorecardsType };
    }

    createWca() {
        let wca = {};

        utilities.getNodes('.active-content .scorecard-row').forEach( (i) =>  {
            let code = i.dataset.code;

            wca[code] = {};

            wca[code]['description'] = i.querySelector('.ql-editor').innerHTML;
            wca[code]['title'] = i.querySelector('.scorecard-edit-title').value;
            wca[code]['indicator1'] = i.querySelector('.scorecard-indicator-title-1').value;
            wca[code]['indicator2'] = i.querySelector('.scorecard-indicator-title-2').value;
            wca[code]['value1'] = utilities.filterOut(i.querySelector('.scorecard-indicator-value-1').value);
            wca[code]['value2'] = utilities.filterOut(i.querySelector('.scorecard-indicator-value-2').value);
            wca[code]['target1'] = utilities.filterOut(i.querySelector('.scorecard-indicator-target-1').value);
            wca[code]['target2'] = utilities.filterOut(i.querySelector('.scorecard-indicator-target-2').value);
            wca[code]['date1'] = i.querySelector('.scorecard-indicator-date-1').value;
            wca[code]['date2'] = i.querySelector('.scorecard-indicator-date-2').value;
            wca[code]['old1'] = utilities.filterOut(i.querySelector('.scorecard-indicator-old-1').value);
            wca[code]['old2'] = utilities.filterOut(i.querySelector('.scorecard-indicator-old-2').value);
            wca[code]['arrow1'] = utilities.fromArrowToSP(i.querySelector('.scorecard-indicator-arrow-1'));
            wca[code]['arrow2'] = utilities.fromArrowToSP(i.querySelector('.scorecard-indicator-arrow-2'));
            wca[code]['likelihood1'] = utilities.fromLikelihoodToSP(i.querySelector('.scorecard-likelihood-1 .line'));
            wca[code]['likelihood2'] = utilities.fromLikelihoodToSP(i.querySelector('.scorecard-likelihood-2 .line'));
            wca[code]['color'] = i.dataset.color;
        });

        return JSON.stringify(wca);
    }

    editWca(retrieved, previous) {
        let column = {};
    
        utilities.getNodes('.active-content .scorecard-row').forEach( (i) =>  {
            let code = i.dataset.code;
            let old = previous.wcadata[code];
    
            column[code] = {};
    
            (i.querySelector('.ql-editor').innerHTML != old.description) && 								        (column[code]['description'] = i.querySelector('.ql-editor').innerHTML);
            (i.querySelector('.scorecard-edit-title').value != old.title) && 								        (column[code]['title'] = i.querySelector('.scorecard-edit-title').value);
            (i.querySelector('.scorecard-indicator-title-1').value != old.indicator1) && 					        (column[code]['indicator1'] = i.querySelector('.scorecard-indicator-title-1').value);
            (i.querySelector('.scorecard-indicator-title-2').value != old.indicator2) && 					        (column[code]['indicator2'] = i.querySelector('.scorecard-indicator-title-2').value);
            (utilities.filterOut(i.querySelector('.scorecard-indicator-value-1').value) != old.value1) && 			(column[code]['value1'] = utilities.filterOut(i.querySelector('.scorecard-indicator-value-1').value));
            (utilities.filterOut(i.querySelector('.scorecard-indicator-value-2').value) != old.value2) && 			(column[code]['value2'] = utilities.filterOut(i.querySelector('.scorecard-indicator-value-2').value));
            (utilities.filterOut(i.querySelector('.scorecard-indicator-target-1').value) != old.target1) && 		(column[code]['target1'] = utilities.filterOut(i.querySelector('.scorecard-indicator-target-1').value));
            (utilities.filterOut(i.querySelector('.scorecard-indicator-target-2').value) != old.target2) && 		(column[code]['target2'] = utilities.filterOut(i.querySelector('.scorecard-indicator-target-2').value));
            (i.querySelector('.scorecard-indicator-date-1').value != old.date1) && 							        (column[code]['date1'] = i.querySelector('.scorecard-indicator-date-1').value);
            (i.querySelector('.scorecard-indicator-date-2').value != old.date2) && 							        (column[code]['date2'] = i.querySelector('.scorecard-indicator-date-2').value);
            (utilities.filterOut(i.querySelector('.scorecard-indicator-old-1').value) != old.old1) && 				(column[code]['old1'] = utilities.filterOut(i.querySelector('.scorecard-indicator-old-1').value));
            (utilities.filterOut(i.querySelector('.scorecard-indicator-old-2').value) != old.old2) && 				(column[code]['old2'] = utilities.filterOut(i.querySelector('.scorecard-indicator-old-2').value));
            (utilities.fromArrowToSP(i.querySelector('.scorecard-indicator-arrow-1')) != old.arrow1) && 			(column[code]['arrow1'] = utilities.fromArrowToSP(i.querySelector('.scorecard-indicator-arrow-1')));
            (utilities.fromArrowToSP(i.querySelector('.scorecard-indicator-arrow-2')) != old.arrow2) && 			(column[code]['arrow2'] = utilities.fromArrowToSP(i.querySelector('.scorecard-indicator-arrow-2')));
            (utilities.fromLikelihoodToSP(i.querySelector('.scorecard-likelihood-1 .line')) != old.likelihood1) && 	(column[code]['likelihood1'] = utilities.fromLikelihoodToSP(i.querySelector('.scorecard-likelihood-1 .line')));
            (utilities.fromLikelihoodToSP(i.querySelector('.scorecard-likelihood-2 .line')) != old.likelihood2) && 	(column[code]['likelihood2'] = utilities.fromLikelihoodToSP(i.querySelector('.scorecard-likelihood-2 .line')));
        });
    
        for (element in column) {
            Object.keys(column[element]).forEach( (i) => {
                retrieved.wcadata[element][i] = column[element][i];
            });
        }
    
        return JSON.stringify(retrieved.wcadata);
    }

    editComment(retrieved, previous) {
        let old = previous.comment;
        let current = document.querySelector('.scorecard-main-summary .ql-editor').innerHTML;

        if (current != old) {
            retrieved.comment = current;
        }

        return retrieved.comment;
    }

    editMotto(retrieved, previous) {
        let old = previous.motto;
        let current = document.querySelector('.scorecard-motto').value;

        if (current != old) {
            retrieved.motto = current;
        }

        return retrieved.motto;
    }
}

export { ScoreCardsItemSP };