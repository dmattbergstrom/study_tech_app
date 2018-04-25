import {addDays} from "../dateFunctions/addDays"
import {checkDates} from "./checkDates"
import {formatDayOrMonth} from "./formatDayOrMonth"

/**
*
*   createStudySessions():
*   creates study sessions for the user!
*
*   TODO: Forced to schedule less than we want? Notify user...
*   TODO: Prioritize days furthest away from deadline.
*   TODO: Prioritize times between 18-22, ASK USER????
*   TODO: Last few days, deviate from original elements, use for preparation of examination.
*
*   This function will determine when the student will be
*   scheduled and how he/she will be instructed to study.
*
*   @param desc is the description string grabbed from our database. It is the general tip description for the exType.
*   @param numStudySessions is the measurement for the examination. Which could mean the amount of pages, exercises or words required for the examination.
*   @param numAvailableDays is the number of days until the deadline is reached.
*   @param deadline is the users deadline.
*   @param pagesPerSession The number of pages per session in this activity chain.
*
**/
export function createStudySessions(courseName, exType, descIdArray, numStudySessions, numAvailableDays, deadline, pagesPerSession) {

  numAvailableDays -= 1; // Don't study the last day.

  /**
  *    Variables that are to be altered by the algorithm...
  **/
  var title, type, startDate, endDate;

  /**
  *    Get the time of the events that are already scheduled, so we do not schedule
  *    over these. Also, get the forbidden schedule times.
  **/
  var startFromDay = new Date();

  /**
  *   Create all events!
  **/

  var studySessionsPerDay = Math.round(numStudySessions/numAvailableDays);
  var distancePerStudySession = Math.floor(numAvailableDays/numStudySessions);
  if ( studySessionsPerDay < 1 ) {
    studySessionsPerDay = 1; // Make sure we have atleast one study session a day.
  }
  if (distancePerStudySession < 1) {
    distancePerStudySession = 1;  // Make sure we have atleast one days break between them.
  }


  /**
  *   Before creating all the studySessions, we need to
  *   create the connected StudyChain
  **/
  /**
  *   Creation of the JSON object that is to be inserted.
  **/
  let studyChain = {
    'courseName': courseName,
    'examinationType':exType,
    'deadline': deadline,
    'unitsPerSession': pagesPerSession,
  };

  var studyChainId;

  /**
  *   Insertion of the current doc. Report any and all errors.
  **/
  StudyChain.insert(
    studyChain,
    function(error, studyChain_id) {
      if ( error ) {
        console.log ( error ); //info about what went wrong
        Materialize.toast('Något gick fel... Försök igen!', 4000, "red");
        return; // Stop exec
      } else {
        // Everything went smoothly...
        // Make note of the StudyChain id, that is to be inserted
        // in all the studysessions.
        studyChainId = studyChain_id;
      }
    }
  );

  for ( var i = 0; i < numStudySessions; i++ ) {

    if ( i > 0 ) { // Schedule with our desired distance between study sessions.
      // Have the maximum distance between study sessions.
      startFromDay = addDays(startFromDay, distancePerStudySession);
    } else {
      // Don't start today.
      startFromDay = addDays(startFromDay, 1);
    }

    for ( var j = 1; j <= studySessionsPerDay; j++ ) {

      /**
      *     Set preliminary event. Check if it's alright afterwards.
      *     TODO: Start at 22 if they like to study late, 18 if they like to study early. Machine Learning/Data Analytics..?
      **/

      // Create a new DateTime Date object.
      var preliminaryDateObj = new Date(""+startFromDay.getFullYear()
      +"-"+formatDayOrMonth(startFromDay.getMonth()+1)
      +"-"+formatDayOrMonth(startFromDay.getDate())
      + " 16:00:00");

      // Fix this date if it is scheduled illegally: NOTE: We start at 16-18 statically.
      // NOTE: If the date is okay, we will return first Date object.
      var currentDateObj;
      currentDateObj = checkDates(preliminaryDateObj);

      var startHours = currentDateObj.getHours();
      var endHours = currentDateObj.getHours()+2;
      var startDay = formatDayOrMonth(parseInt(currentDateObj.getDate()));
      var startMonth = formatDayOrMonth(parseInt(currentDateObj.getMonth())+1); // Month indexing starts at 0.
      var startYear = currentDateObj.getFullYear();

      /**
      *   We now know the date is okay.
      **/
      title = courseName+' '+ startHours +':00-'+ endHours+':00';

      var start = startYear+"-"+startMonth+"-"+startDay; // start and end have the same date, but not the same time.
      var end = start;

      /**
      *   Creation of the JSON object that is to be inserted.
      **/
      let doc = {
        'connectedStudyChainId': studyChainId, // e.g: qHfJWYf4uSgQ7CuMD
        'connectedUserId': Meteor.userId(),
        'htmlDescriptionId': descIdArray[i],
        'title': title,
        'start': start+" "+startHours+":00:00",
        'end': end+" "+endHours+":00:00", // e.g 2017-02-01 22:00:00 which is feb 2nd 22:00, 2017
        'url': "DUMMY_URL" // Updated after insert.
      };

      /**
      *   Insertion of the current doc. Report any and all errors.
      **/
      StudySession.insert(
        doc,
        function(error, doc_id) {
          if ( error ) {
            console.log(descIdArray[i]);
            console.log ( error ); //info about what went wrong
            Materialize.toast('Något gick fel... Försök igen!', 4000, "red");
            return; // Stop exec
          } else {
            // Everything went smoothly...
            /**
            *   UPDATE meetings url to its id.
            *   This makes each study session uniquely clickable.
            **/
            var uniqueUrl = Meteor.absoluteUrl("studySession/"+doc_id, {});
            doc.url = uniqueUrl; // Update doc with new url
            doc.connectedStudyChainId = studyChainId;
            Meteor.call("upsertStudySession", doc_id, doc);
          }
        }
      );


      // If we added more than one study session this day.
      if ( j > 1 ) {
        numStudySessions--;
        i++; // So we go to the next desc.
      }

    }

  } // End of event creation...

  // SUCCESS ACTIONS:
  Materialize.toast('Lyckades!', 6000, "green");
  FlowRouter.go("calendar");
}
