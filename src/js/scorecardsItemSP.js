import utilities from "./utilities";

/* 
    To prevent Users from overriding each other's edits while working at the same time on the ScoreCards Sharepoint List, 
    every time a User saves any modification, the algorithm checks which data have been modified from their original state by comparing the information found 
    in the "previous" parameter and the ones that are being currently saved by the User (the data retrieved from the HTML form).

    In the "Edit Actions" scenario, during each User's session, all the IDs of the deleted actions are stored in the "deletedActions" array. Those Ids are now used to remove from the "retrieved" parameter all the deleted actions.
    In the "Edit Actions" scenario, newly created actions (marked with class "new-action") are not yet considered, and therefore not taken from the HTML form.

    Every modification is then stored in the "column" object. ONLY MODIFICATIONS ARE INSERTED.
    
    The "retrieved" parameter gets at this point updated with the modifications found in the "column" object.
    
    All the newly created actions are now taken from the HTML form and inserted in the "retrieved" object.

    Finally, "retrieved" is sent to Sharepoint via REST API and replaces the old information in the Sharepoint List.

    A perfect example of each step is in the editActions() method of the Class below.

    IMPORTANT: every action has a unique ID. A unique ID is crucial for this method to work.
*/

class ScoreCardsItemSP {
    constructor(retrieved, previous, previousOld, context, createMode) {
        (context == "wca" && createMode) && ( this.Title = utilities.createScorecardTitle() );
        (context == "wca" && createMode) && ( this.scoredate = utilities.fromDateToSP() );
        (context == "wca" && createMode) && ( this.motto = document.querySelector('.scorecard-motto').value );
        (context == "wca" && createMode) && ( this.comment = document.querySelector('.scorecard-main-summary .ql-editor').innerHTML );
        (context == "wca" && createMode) && ( this.wcadata = this.createWca() );

        (context == "wca" && !createMode) && ( this.motto = this.editMotto(retrieved, previous) );
        (context == "wca" && !createMode) && ( this.comment = this.editComment(retrieved, previous) );
        (context == "wca" && !createMode) && ( this.wcadata = this.editWca(retrieved, previous) );

        (context == "hubs" && createMode) && ( this.westdata = this.createHubs('west') );
        (context == "hubs" && createMode) && ( this.coastaldata = this.createHubs('coastal') );
        (context == "hubs" && createMode) && ( this.centraldata = this.createHubs('central') );

        (context == "hubs" && !createMode) && ( this.westdata = this.editHubs(retrieved, previous, 'west') );
        (context == "hubs" && !createMode) && ( this.coastaldata = this.editHubs(retrieved, previous, 'coastal') );
        (context == "hubs" && !createMode) && ( this.centraldata = this.editHubs(retrieved, previous, 'central') );

        (context == "west" && createMode) && ( this.westaction = this.createActions('west') );
        (context == "coastal" && createMode) && ( this.coastalaction = this.createActions('coastal') );
        (context == "central" && createMode) && ( this.centralaction = this.createActions('central') );

        (context == "west" && !createMode) && ( this.westaction = this.editActions(retrieved, previous, previousOld, 'west') );
        (context == "coastal" && !createMode) && ( this.coastalaction = this.editActions(retrieved, previous, previousOld, 'coastal') );
        (context == "central" && !createMode) && ( this.centralaction = this.editActions(retrieved, previous, previousOld, 'central') );

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

    createHubs(hub) {
        let data = {};

        data[hub] = {};

        app.settings.forEach( (i) => {
            let code = i.Code;

            let left = document.getElementById(`${code}-hub-row-left`);
            let right = document.getElementById(`${code}-hub-row-right`);

            data[hub][code] = {};

            data[hub][code]['value1'] = utilities.filterOut(left.querySelector(`.${hub}-indicator-value`).value);
            data[hub][code]['target1'] = utilities.filterOut(left.querySelector(`.${hub}-indicator-target`).value);
            data[hub][code]['date1'] = left.querySelector(`.${hub}-indicator-date`).value;
            data[hub][code]['old1'] = utilities.filterOut(left.querySelector(`.${hub}-indicator-old`).value);
            data[hub][code]['arrow1'] = utilities.fromArrowToSP(left.querySelector(`.${hub}-indicator-arrow`));
            data[hub][code]['likelihood1'] = utilities.fromLikelihoodToSP(left.querySelector(`.${hub}-indicator-likelihood`));

            data[hub][code]['value2'] = utilities.filterOut(right.querySelector(`.${hub}-indicator-value`).value);
            data[hub][code]['target2'] = utilities.filterOut(right.querySelector(`.${hub}-indicator-target`).value);
            data[hub][code]['date2'] = right.querySelector(`.${hub}-indicator-date`).value;
            data[hub][code]['old2'] = utilities.filterOut(right.querySelector(`.${hub}-indicator-old`).value);
            data[hub][code]['arrow2'] = utilities.fromArrowToSP(right.querySelector(`.${hub}-indicator-arrow`));
            data[hub][code]['likelihood2'] = utilities.fromLikelihoodToSP(right.querySelector(`.${hub}-indicator-likelihood`));
        });

        return JSON.stringify(data[hub]);
    }

    createActions(action) {
        let data = {};
        data[action] = {};

        utilities.getNodes('.active-action .responsive-header').forEach( (i) => {
            let code = i.id.split('-')[0];
            data[action][code] = {};

            i.querySelectorAll('.responsive-element').forEach( (d) => {
                let id = `${code}-${d.dataset.action}`;
                data[action][code][id] = {};

                data[action][code][id]['Code'] = code;
                data[action][code][id]['Index'] = d.dataset.action;
                data[action][code][id]['Project'] = d.querySelector('.column-1 textarea').value.trim();
                data[action][code][id]['Country'] = d.querySelector('.column-2 textarea').value.trim();
                data[action][code][id]['Stage'] = d.querySelector('.column-3 textarea').value.trim();
                data[action][code][id]['Action'] = d.querySelector('.column-4 textarea').value.trim();
                data[action][code][id]['Status'] = d.querySelector('.column-5 select').value;
                data[action][code][id]['Updates'] = d.querySelector('.column-6 textarea').value.trim();
                data[action][code][id]['Lead'] = d.querySelector('.column-7 .select-pure__label').innerText;
                data[action][code][id]['Deadline'] = d.querySelector('.column-8 textarea').value.trim();
            });
        });

        return JSON.stringify(data[action]);
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

    editHubs(retrieved, previous, hub) {
        let column = {};

        utilities.getNodes('.active .scorecard-row').forEach( (i) =>  {
            let code = i.dataset.code;
            let old = previous[`${hub}data`][code];

            let value1 = utilities.filterOut( i.querySelector(`#${code}-hub-row-left .${hub}-indicator-value`).value );
            let target1 = utilities.filterOut( i.querySelector(`#${code}-hub-row-left .${hub}-indicator-target`).value );
            let date1 = i.querySelector(`#${code}-hub-row-left .${hub}-indicator-date`).value;
            let old1 = utilities.filterOut( i.querySelector(`#${code}-hub-row-left .${hub}-indicator-old`).value );
            let arrow1 = utilities.fromArrowToSP( i.querySelector(`#${code}-hub-row-left .${hub}-indicator-arrow`) );
            let likelihood1 = utilities.fromLikelihoodToSP( i.querySelector(`#${code}-hub-row-left .${hub}-indicator-likelihood .line`) );

            let value2 = utilities.filterOut( i.querySelector(`#${code}-hub-row-right .${hub}-indicator-value`).value );
            let target2 = utilities.filterOut( i.querySelector(`#${code}-hub-row-right .${hub}-indicator-target`).value );
            let date2 = i.querySelector(`#${code}-hub-row-right .${hub}-indicator-date`).value;
            let old2 = utilities.filterOut( i.querySelector(`#${code}-hub-row-right .${hub}-indicator-old`).value );
            let arrow2 = utilities.fromArrowToSP( i.querySelector(`#${code}-hub-row-right .${hub}-indicator-arrow`) );
            let likelihood2 = utilities.fromLikelihoodToSP( i.querySelector(`#${code}-hub-row-right .${hub}-indicator-likelihood .line`) );

            column[code] = {};

            value1 != old.value1 && (column[code]['value1'] = value1);
            value2 != old.value2 && (column[code]['value2'] = value2);
            target1 != old.target1 && (column[code]['target1'] = target1);
            target2 != old.target2 && (column[code]['target2'] = target2);
            date1 != old.date1 && (column[code]['date1'] = date1);
            date2 != old.date2 && (column[code]['date2'] = date2);
            old1 != old.old1 && (column[code]['old1'] = old1);
            old2 != old.old2 && (column[code]['old2'] = old2);
            arrow1 != old.arrow1 && (column[code]['arrow1'] = arrow1);
            arrow2 != old.arrow2 && (column[code]['arrow2'] = arrow2);
            likelihood1 != old.likelihood1 && (column[code]['likelihood1'] = likelihood1);
            likelihood2 != old.likelihood2 && (column[code]['likelihood2'] = likelihood2);
        });

        for (element in column) {
            Object.keys(column[element]).forEach( (i) => {
                retrieved[`${hub}data`][element][i] = column[element][i];
            });
        }

        return JSON.stringify(retrieved[`${hub}data`]);
    }

    editActions(retrieved, previous, previousOld, action) {
        let column = {};
        let maxIndexes = {};
        let spColumn = `${action}action`;

        app.deletedActions.forEach( (d) => {
            let code = d.split('-')[0];

            delete retrieved[spColumn][code][d]; // if target action has already been deleted by another user, it is ignored
        });

        utilities.getNodes('.active-action .responsive-element:not(.new-action)').forEach( (i) => {
            // if the item has been concurrently deleted while User is modifying it, it will result in that specific Action not being saved
            let id = i.dataset.code;
            let code = id.split('-')[0];
            let old = previous[spColumn] ? previous[spColumn][code][id] : previousOld[spColumn][code][id];

            let project = i.querySelector('.column-1 textarea').value.trim();
            let country = i.querySelector('.column-2 textarea').value.trim();
            let stage = i.querySelector('.column-3 textarea').value.trim();
            let act = i.querySelector('.column-4 textarea').value.trim();
            let status = i.querySelector('.column-5 select').value;
            let updates = i.querySelector('.column-6 textarea').value.trim();
            let lead = i.querySelector('.column-7 .select-pure__label').innerText;
            let deadline = i.querySelector('.column-8 textarea').value.trim();

            !column[code] && ( column[code] = {} );
            column[code][id] = {};

            project != old.Project && (column[code][id]['Project'] = project);
            country != old.Country && (column[code][id]['Country'] = country);
            stage != old.Stage && (column[code][id]['Stage'] = stage);
            act != old.Action && (column[code][id]['Action'] = act);
            status != old.Status && (column[code][id]['Status'] = status);
            updates != old.Updates && (column[code][id]['Updates'] = updates);
            lead != old.Lead && (column[code][id]['Lead'] = lead);
            deadline != old.Deadline && (column[code][id]['Deadline'] = deadline);
        });

        for (element in column) {
            Object.keys(column[element]).forEach( (i) => {
                Object.keys(column[element][i]).forEach( (d) => {
                    let target = retrieved[spColumn][element][i];

                    !!target && (target[d] = column[element][i][d]); // ignores deleted actions
                });
            });
        }

        utilities.getNodes('.active-action .new-action').forEach( (c) => {
            let id = c.dataset.code;
            let code = id.split('-')[0];
            let exists = !!retrieved[spColumn][code][id];
            let retrievedIndexes, absoluteMax, index, newId, target;

            if (exists) {
                retrievedIndexes = Object.values(retrieved[spColumn][code]).map( (d) => parseInt(d.Index));
                absoluteMax = Math.max(...retrievedIndexes);
                !maxIndexes[code] && ( maxIndexes[code] = {Max: absoluteMax} ); // only initialized when the first concurrent action for each Category is found

                maxIndexes[code]['Max'] += 1;
                index = maxIndexes[code]['Max'];
                newId = `${code}-${index}`;
                retrieved[spColumn][code][newId] = {};
                target = retrieved[spColumn][code][newId];

            } else {
                index = id.split('-')[1];
                retrieved[spColumn][code][id] = {};
                target = retrieved[spColumn][code][id];
            }

            target['Code'] = code;
            target['Index'] = index;
            target['Project'] = c.querySelector('.column-1 textarea').value.trim();
            target['Country'] = c.querySelector('.column-2 textarea').value.trim();
            target['Stage'] = c.querySelector('.column-3 textarea').value.trim();
            target['Action'] = c.querySelector('.column-4 textarea').value.trim();
            target['Status'] = c.querySelector('.column-5 select').value;
            target['Updates'] = c.querySelector('.column-6 textarea').value.trim();
            target['Lead'] = c.querySelector('.column-7 .select-pure__label').innerText;
            target['Deadline'] = c.querySelector('.column-8 textarea').value.trim();
        });

        return JSON.stringify(retrieved[spColumn]);
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