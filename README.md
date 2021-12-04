# handpickedmusic

## feature requests

### Notifications if the amount of unscheduled songs left reaches a value

Have a daily running lambda function that notifies in production when the list of unscheduled songs goes below a value
so that there is always a song ready

Need to setup emailing from lambda: https://aws.amazon.com/premiumsupport/knowledge-center/lambda-send-email-ses/

### Allow uploading a passage of text with a song

This can be done by adding a text field to the upload component and adding a text field to the track entry

Then can add that text to the music component, overriding the current header text if set.

May need to modify how context works as it currently just has trackId in string, maybe that context should be entire
track

### Optionally prevent generation of new daily songs when visiting page

This can be done via a cookie value on the page being used to detect if the user wants to opt out
of generating songs.

Can then add a parameter on the graphql resolver to enable / disable setting new daily songs

Then modify the lambda function resolver to check that param on the event and not set a new song if set, either
just return nothing or the daily song if set

### Turn the whole thing into an android application

Set up new frontend for the application as an android application

Can then do push notifications and other stuff
