# Project architecture

- Keep exceptional service dates and venue details in a shared, date-scoped module so temporary notices disappear automatically after their scheduled day.
- Display event times in the church venue's Europe/Rome timezone so server and browser locale settings cannot change the advertised hour.