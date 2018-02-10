/***
*
*   Created: 03 December 2017
*   @author Matt Bergstrom, A.K.A devmattb or Mattias Bergström.
*   Copyright 2017 Matt Bergstrom
*   Statement:
*   None of this code is to be copied or used without my (Matt Bergstrom's) permission.
*
***/

Template.calendar.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'CalEvents' );
});

Template.calendar.onRendered( () => {
  let isPast = ( date ) => {
  let today = moment().format();
  return moment( today ).isAfter( date );
  };

  $('.schedule').fullCalendar({

      header: {
        // Buttons and header text:
        left: 'agendaWeek, month, list',
        center: 'title',
        right: 'prev, today, next'

      },
      allDayText: 'Deadlines', // Appears on top of the calendar issues.
      // Specifying our time ranges.
      minTime: '16:00:00',
      maxTime: '22:00:00',
      editable: false, // Not editable
      weekends: true, // Include weekends.
      defaultView: 'agendaWeek',
      eventStartEditable: false,
      // Enabling list-view.
      listDayFormat: true,
      height: 450,
      // Get events from DB
      events( start, end, timezone, callback ) {
        var eventsId = Session.get("id").toString();
        let data = CalEvents.find({connectedUserId: eventsId}).fetch().map( ( event ) => {
          event.editable = !isPast( event.start );
          return event;
        });

        if ( data ) {
          callback( data );
        }
      },
      // Render events
      eventRender( event, element ) {

      // TODO: Add subject/study tech symbol to html event.
      //if (event.type == "Math") { }
      element.find( '.fc-content' ).html(
        `
         <h4 class="white-text center">${ event.title }<br>
         <small><i class="fa fa-pie-chart"></i></small>
         </h4>
        `
        // <p class="type-${ event.type } white-text">#${ event.type }</p>
      ).attr("htmlDesc", event.htmlDescription);
      }
  });

  Tracker.autorun( () => {
    var eventsId = Session.get("id").toString();
    CalEvents.find({connectedUserId: eventsId}).fetch();
    $( '.schedule' ).fullCalendar( 'refetchEvents' );
  });

});

// Click events, etc.
Template.calendar.events({

  'click .fc-event-container': function(e){
    var htmlDesc;
    // BUG: undefined sometimes...

    // Only change htmlDesc if its something we dont want.
    // Either the parent or the child holds the info.
    if ($(e.target).parents(".fc-content").attr("htmlDesc") != undefined && (htmlDesc != $(e.target).parents(".fc-content").attr("htmlDesc"))) {
      htmlDesc = $(e.target).parents(".fc-content").attr("htmlDesc");
    } else if($(e.target).children(".fc-content").attr("htmlDesc") != undefined && (htmlDesc != $(e.target).children(".fc-content").attr("htmlDesc"))){
      htmlDesc = $(e.target).children(".fc-content").attr("htmlDesc");
    } else if ( $(e.target).find(".fc-content").attr("htmlDesc") != htmlDesc && $(e.target).find(".fc-content").attr("htmlDesc") != undefined) {
      // If all else fails.. try this...
      htmlDesc = $(e.target).find(".fc-content").attr("htmlDesc");
    }
    $("#eventDescModal .modal-content").html(`
      <div class="row col s12">
      `+htmlDesc+`
      </div>
    `);

    $("#eventDescModal").modal('open');
  }

})

// Click events, etc.
Template.home.events({

  'click .fc-event-container': function(e){
    var htmlDesc;
    // BUG: undefined sometimes...

    // Only change htmlDesc if its something we dont want.
    // Either the parent or the child holds the info.
    if ($(e.target).parents(".fc-content").attr("htmlDesc") != undefined && (htmlDesc != $(e.target).parents(".fc-content").attr("htmlDesc"))) {
      htmlDesc = $(e.target).parents(".fc-content").attr("htmlDesc");
    } else if($(e.target).children(".fc-content").attr("htmlDesc") != undefined && (htmlDesc != $(e.target).children(".fc-content").attr("htmlDesc"))){
      htmlDesc = $(e.target).children(".fc-content").attr("htmlDesc");
    } else if ( $(e.target).find(".fc-content").attr("htmlDesc") != htmlDesc && $(e.target).find(".fc-content").attr("htmlDesc") != undefined) {
      // If all else fails.. try this...
      htmlDesc = $(e.target).find(".fc-content").attr("htmlDesc");
    }
    $("#eventDescModal .modal-content").html(`
      <div class="row col s12">
      `+htmlDesc+`
      </div>
    `);

    $("#eventDescModal").modal('open');
  }

})
