function CrowdsourceHinter(runtime, element, data){

    var onHinterPage = true; //We don't do hinter logic if we're on a differ tab in a sequential.
    
    $(".crowdsourcehinter_block", element).hide();

    if(!onHinterPage){
        return;
    }

    /**
     * Set onHinterPage to false, disabling the hinter xblock. Triggered by switching units
     * in edX course.
     * This is a workaround for when a student switches to/from a unit and causes multiple
     * instances of the hinter to be running.
     */
    function stopScript(){
        onHinterPage = false;
    }
    Logger.listen('seq_next', null, stopScript);
    Logger.listen('seq_prev', null, stopScript);
    Logger.listen('seq_goto', null, stopScript);

    /**
     * Get a hint from the server to show to the student after inc-orrectly answering a
     * question. On success, continue to showHint.
     * @param problemGradedEvent is data generated by the problem_graded event
     */
    function getHint(problemGradedEvent){
        $(".crowdsourcehinter_block", element).show();
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'get_hint'),
            data: JSON.stringify({"submittedanswer": problemGradedEvent[0]}),
            success: showHint
        });
    }

    /**
     * Start student hint rating/contribution. This will allow students to contribute new hints
     * to the hinter as well as vote on the helpfulness of the first hint they received
     * for the current problem. This function is called after the student answers
     * the question correctly.
     */
    function startHintRating(){
        $('.csh_correct', element).show();
        $(".csh_hint_reveal", element).hide();
        if($('.csh_hint_creation', element)){
        //send empty data for ajax call because not having a data field causes error
            $.ajax({
                type: "POST",
                url: runtime.handlerUrl(element, 'get_used_hint_answer_data'),
                data: JSON.stringify({}),
                success: setHintRatingUX
            });
        }
    }

    /**
     * Check whether or not the question was correctly answered by the student.
     * The current method of checking the correctness of the answer is very brittle
     * since we simply look for a string within the problemGradedEventData.
     * HACK
     * @param problemGradedEventData is the data from problem_graded event.
     */
    function checkIsAnswerCorrect(problemGradedEventData){
        if (problemGradedEventData[1].search(/class="correct/) === -1){
            return false;
        } else {
            return true;
        }
    }

    /**
     * Check whether student answered the question correctly and call the appropriate
     * function afterwards. Current method for determining correctness if very brittle.
     * @param event_type, element are both unused but automatically passed
     * @param data is generated by problem_graded event, contains status and data of the problem block
     */
    function onStudentSubmission(){ return function(event_type, data, element){
        //search method of correctness of problem is brittle
        if (checkIsAnswerCorrect(data)){
            startHintRating();
        } else { //if the submitted answer is incorrect
            getHint(data);
        }
    }}

    /**
     * Set the target problem for which to listen for the problem_graded event. Set target to first
     * problem block if no target element has been manually entered.
     */
    if(data.target_problem == undefined || data.target_problem == ''){
        //contains workaround because the data-usage-id shows up with ";_" in place of "/" in lms
        targetProblem = ($('.xblock[data-block-type="problem"]').first().attr('data-usage-id')).replace(/;_/g, '/');
    } else {
        targetProblem = data.target_problem;
    }

    Logger.listen('problem_graded', targetProblem, onStudentSubmission());

    /**
     * Modify csh_hint_text attributes to show hint to the student.
     */
    function showHint(result){
        $('.csh_hint_text', element).attr('student_answer', result.StudentAnswer);
        $('.csh_hint_text', element).attr('hint_received', result.BestHint);
        $('.csh_hint_text', element).text("Hint: " + result.BestHint);
        $('.csh_rate_hint_completed', element).attr('class', 'csh_rate_hint');
        $('.csh_hint_text', element).attr('rating', '');
        Logger.log('crowd_hinter.showHint', {"student_answer": result.StudentAnswer, "hint_received": result.Hints});
    }

    /**
     * Called by setHintRatingUX to append hints into divs created by
     * showStudentSubmissoinHistory, after the student answered the question correctly.
     * Feedback on hints at this stage consists of upvote/downvote/report buttons.
     * @param hint is the first hint that was shown to the student
     * @param student_answer is the first incorrect answer submitted by the student
     */
    function showStudentHintRatingUX(hint, student_answer){
        var hintRatingUXTemplate = $(Mustache.render($('#show_hint_rating_ux').html(), {hintIdentifier: encodeURI(hint), hintText: hint}));
        $('.csh_answer_text', element).append(hintRatingUXTemplate);
        var hintCreationTemplate = $(Mustache.render($('#add_hint_creation').html(), {}));
        $('.csh_answer_text', element).append(hintCreationTemplate);
        Logger.log("crowd_hinter.hint_rating_UX", {"hint": hint, "student_answer": student_answer});
    }

    /**
     * Show options to remove or return reported hints from/to the hint pool. Called after
     * correctly answering the question, only visible to staff.
     * A better method of moderating hints should probably be implemented in the future. Hints
     * only can be moderated after being reported, so unreported hints will stay in the system.
     * @param reportedHint is the reported hint text
     */
    function showReportedModeration(reportedHint){
        var reportedModerationTemplate = $(Mustache.render($('#show_reported_moderation').html(), {reportedHintIdentifier: encodeURI(reportedHint), reportedHintText: reportedHint}));
        $('.csh_reported_hints', element).append(reportedModerationTemplate);
    }

    /**
     * Append new divisions into html for each answer the student submitted before correctly 
     * answering the question. showStudentHintRatingUX appends new hints into these divs.
     *
     * @param student_answers is the text of the student's incorrect answer
     */
    function showStudentSubmissionHistory(student_answer){
        var showStudentSubmissionTemplate = $(Mustache.render($('#show_student_submission').html(), {answerIdentifier: encodeURI(student_answer), answerText: student_answer}));
        $('.csh_student_submission', element).append(showStudentSubmissionTemplate);
    }

    /**
     * Set up student/staff voting on hints and contribution of new hints. The original incorrect answer and the
     * the corresponding hint shown to the student is displayed. Students can upvote/downvote/report
     * the hint or contribute a new hint for their incorrect answer.
     *
     * @param result is a dictionary of incorrect answers and hints, with the index being the hint and the value
     * being the incorrect answer
     */
    function setHintRatingUX(result){
        if(data.isStaff){ //allow staff to see and remove/return reported hints to/from the hint pool for a problem
            $('.crowdsourcehinter_block', element).attr('class', 'crowdsourcehinter_block_is_staff');
            $.each(result, function(index, value) {
                if(value == "Reported") {
                    //index represents the reported hint's text
                    showReportedModeration(index);
                }
            });
        }
        $.each(result, function(index, value) {
            if(value != "Reported"){
                showStudentSubmissionHistory(value);
                student_answer = value;
                hint = index;
                //hints return null if no answer-specific hints exist
                if(hint === "null") {
                    var noHintsTemplate = $(Mustache.render($('#show_no_hints').html(), {}));
                    $('.csh_student_answer', element).append(noHintsTemplate);
                    var hintCreationTemplate = $(Mustache.render($('#add_hint_creation').html(), {}));
                    $('.csh_student_answer', element).append(hintCreationTemplate);
                    Logger.log("crowd_hinter.hint_rating_UX", {"hint": "null", "student_answer": student_answer});
                } else {
                    showStudentHintRatingUX(hint, student_answer);
                }
            }
        });
    }

    /**
     * Create a text input area for the student to create a new hint. This function
     * is triggered by clicking the "contribute a new hint" button.
     * @param createTextInputButtonHTML is the "contribute a new hint" button that was clicked
     */
    function createHintContributionTextInput(){ return function(createTextInputButtonHTML){
        $('.csh_student_hint_creation', element).each(function(){
            $(createTextInputButtonHTML.currentTarget).show();
        });
        $('.csh_student_text_input', element).remove();
        $('.csh_submit_new', element).remove();
        $(createTextInputButtonHTML.currentTarget).hide();
        student_answer = $('.csh_answer_text', element).attr('answer');
        var hintTextInputTemplate = $(Mustache.render($('#hint_text_input').html(), {student_answer: student_answer}));
        $('.csh_student_answer', element).append(hintTextInputTemplate); //TODO: change csh_hint_value, messes up for staff
    }}
    $(element).on('click', '.csh_student_hint_creation', createHintContributionTextInput($(this)));

    /**
     * Submit a new hint created by the student to the hint pool. Hint text is in
     * the text input area created by createHintContributionTextInput. Contributed hints are specific to 
     * incorrect answers. Triggered by clicking the "submit hint" button.
     * @param submitHintButtonHTML is the "submit hint" button clicked
     */
    function submitNewHint(){ return function(submitHintButtonHTML){
    //add the newly created hint to the hinter's pool of hints
        if($('.csh_student_text_input', element).val().length > 0){
            //encodeURI is used on the answer string when it is passed to mustache due to errors that
            //arise in answers that contain spaces. Since the original answer is not in the encoded form,
            //we must use the decoded form here.
            var studentAnswer = decodeURI(submitHintButtonHTML.currentTarget.attributes['answer'].value);
            var newHint = unescape($('.csh_student_text_input').val());
            $('.csh_submitbutton', element).show();
            $.ajax({
                type: "POST",
                url: runtime.handlerUrl(element, 'add_new_hint'),
                data: JSON.stringify({"new_hint_submission": newHint, "answer": studentAnswer}),
                success: function() {
                    $('.csh_student_text_input', element).attr('style', 'display: none;');
                    $(submitHintButtonHTML.currentTarget).attr('style', 'display: none;');
                    $('.csh_hint_value', element).append("<br>Thankyou!");
                    Logger.log('crowd_hinter.submitNewHint', {"student_answer": studentAnswer, "new_hint_submission": newHint})
                }
            });
        }
    }}
    $(element).on('click', '.csh_submit_new', submitNewHint($(this)));

    /**
     * Send vote data to modify a hint's rating (or mark it as reported). Triggered by
     * clicking a button to upvote, downvote, or report the hint (both before and after
     * the student correctly submits an answer).
     * @param rateHintButtonHTML is the rate_hint button clicked (upvote/downvote/report)
     */
    function rateHint(){ return function(rateHintButtonHTML){
        rating = rateHintButtonHTML.currentTarget.attributes['data-rate'].value;
        $('.csh_hint_text', element).attr('rating', rating);
        $('.csh_hint', element).attr('rating', rating);
        hint = $('.csh_hint_text', element).attr('hint_received');
        //encodeURI is used on the answer string when it is passed to mustache due to errors that
        //arise in answers that contain spaces. Since the original answer is not in the encoded form,
        //we must use the decoded form here.
        student_answer = decodeURI($('.csh_hint_text', element).attr('student_answer'));
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'rate_hint'),
            data: JSON.stringify({"student_rating": rating, "hint": hint, "student_answer": student_answer}),
            success: function() {
                Logger.log('crowd_hinter.rateHint', {"hint": hint, "student_answer": student_answer, "rating": rating})
                $('.csh_rate_hint', element).attr('class', 'csh_rate_hint_completed');
            }
        });
    }}
    $(element).on('click', '.csh_rate_hint', rateHint($(this)));

    function reportHint(){ return function(reportHintButtonHTML){
        hint = $('.csh_hint_text', element).attr('hint_received');
        //encodeURI is used on the answer string when it is passed to mustache due to errors that
        //arise in answers that contain spaces. Since the original answer is not in the encoded form,
        //we must use the decoded form here.
        student_answer = decodeURI($('.csh_hint_text', element).attr('student_answer'));
        $('.csh_hint_text', element).text('This hint has been reported for review.');
        $('.csh_hint', element).text('This hint has been reported for review.');
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'rate_hint'),
            data: JSON.stringify({"student_rating": "report", "hint": hint, "student_answer": student_answer}),
            success: function() {
                    Logger.log('crowd_hinter.reportHint', {"hint": hint, "student_answer": student_answer})
                }
        });
    }}
    $(element).on('click', '.csh_report_hint', reportHint($(this)));

    /**
     * Remove a reported hint from the reported moderation area (for staff only). Hints
     * are removed from the moderation area regardless of whether they are to be permanently removed
     * from the hint pool or not. Called by staffRateHint.
     */
    function removeReportedHint(){
        Logger.log('crowd_hinter.staffRateHint', {"hint": hint, "student_answer": student_answer, "rating": rating});
        $(".csh_hint_value[value='" + hint + "']", element).remove();
    }

    /**
     * Send staff rating data to determine whether or not a reported hint will be removed from the
     * hint pool or not. Triggered by clicking a staff_rate button.
     * @param staffRateHintButtonHTML is the csh_staff_rate button that was clicked
     */
    function staffRateHint(){ return function(staffRateHintButtonHTML){
        hint = $(staffRateHintButtonHTML.currentTarget).parent().find(".csh_hint").text();
        rating = staffRateHintButtonHTML.currentTarget.attributes['data-rate'].value
        student_answer = "Reported";
        Logger.log('crowd_hinter.staff_rate_hint', {"hint": hint, "student_answer": student_answer, "rating": rating});
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'rate_hint'),
            data: JSON.stringify({"student_rating": rating, "hint": hint, "student_answer": student_answer}),
            success: removeReportedHint()
        });
    }}
    $(element).on('click', '.csh_staff_rate', staffRateHint($(this)));

    $(element).on('click', '.csh_reveal_info', function(){
        if($('.csh_user_info', element).attr('style') == "display: none;"){
            $('.csh_user_info', element).attr('style', "display: block;")
        }else{
            $('.csh_user_info', element).attr('style', "display: none;")
        }
    })

}
