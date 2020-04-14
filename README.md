# mv-calendar

MvCalendar is a Meveo calendar component (based on lit-element) that renders a datepicker component that can display a simple calendar, a calendar with date range, or a datepicker popup in an input field.

## Features
* Renders the calendar using a single component tag
* Renders a simple calendar
* Renders a calendar with date range
* Renders a datepicker popup in an input field
* Written in vanilla javascript


## Quick Start

To experiment with the MvCalendar component.   

1. Clone this repo.

2. Serve the project from the root directory with some http server (best served with meveo itself)

## Sample usage

The `mv-calendar` has 3 `type` variants:
```
default, dropdown, and range
```

The default calendar will display a simple calendar on the page.
```javascript
  <mv-calendar
    name="singleCalendar"                   // name that is returned in select-date event details
    placeholder="Single Calendar"           // the placeholder text when input is empty
    inline-input                            // displays an inline input at the top of the calendar
    monday-first                            // changes the first column to Monday instead of Sunday
    min-year="2010"                         // minimum year allowed in the year spinner
    max-year="2030"                         // maximum year allowed in the year spinner
    pattern="MM/DD/YYYY"                    // the date pattern used for masking and formatting the date
    pattern-matcher="MDY"                   // specify which characters in the pattern are editable
    pattern-regex="\\d"                     // specify regex used for characters allowed in the pattern
    .theme="${theme}"                       // theme used in displaying the calendar (light or dark)
    .selected-date="${this.selectedDate}"   // the Date object that specifies the value of the calendar
    @select-date="${this.changeDate}"       // custom event dispatched when a date is selected/entered
  ></mv-calendar>
```

The dropdown calendar will display an input field which pops out a calendar dropdown when focused.
```javascript
  <mv-calendar
    name="singleCalendar"                   // name that is returned in select-date event details
    dropdown                                // specifies that this is a dropdown calendar
    placeholder="Dropdown Calendar"         // the placeholder text when input is empty    
    monday-first                            // changes the first column to Monday instead of Sunday
    min-year="2010"                         // minimum year allowed in the year spinner
    max-year="2030"                         // maximum year allowed in the year spinner
    pattern="MM/DD/YYYY"                    // the date pattern used for masking and formatting the date
    pattern-matcher="MDY"                   // specify which characters in the pattern are editable
    pattern-regex="\\d"                     // specify regex used for characters allowed in the pattern
    .theme="${theme}"                       // theme used in displaying the calendar (light or dark)
    .selected-date="${this.selectedDate}"   // the Date object that specifies the value of the calendar
    @select-date="${this.changeDate}"       // custom event dispatched when a date is selected/entered
  ></mv-calendar>
```

The range calendar will display a component with two calendars that allow the user to choose a start and end date range.
```javascript
  <mv-calendar
    name="singleCalendar"                   // name that is returned in select-date event details
    range-calendar                          // specifies that this is a range calendar
    inline-input                            // displays an inline input at the top of the calendar
    start-placeholder="Start"               // the placeholder text when start date is empty
    end-placeholder="End"                   // the placeholder text when end date is empty
    monday-first                            // changes the first column to Monday instead of Sunday
    min-year="2010"                         // minimum year allowed in the year spinner
    max-year="2030"                         // maximum year allowed in the year spinner
    pattern="MM/DD/YYYY"                    // the date pattern used for masking and formatting the date
    pattern-matcher="MDY"                   // specify which characters in the pattern are editable
    pattern-regex="\\d"                     // specify regex used for characters allowed in the pattern
    .theme="${theme}"                       // theme used in displaying the calendar (light or dark)
    .start-date="${this.startDate}"         // the Date object that specifies the start date of the calendar
    .end-date="${this.endDate}"             // the Date object that specifies the end date of the calendar
    @select-date="${this.changeDate}"       // custom event dispatched when a date is selected/entered
  ></mv-calendar>
```

The `select-date` custom event's `detail` has the following values:
```
const {
  detail: {
    name,      // the value of the name attribute declared in the component
    date,      // the Date object returned by the default and dropdown calendars, not used by range calendar
    start,     // the Date object for the start value of the range calendar
    end        // the Date object for the end value of the range calendar
  }
} = event;
```

You can also check this [demo](https://calendar.meveo.org)


## Acknowledgements
* MvCalendar uses [moment.js](https://momentjs.com/) for formatting.
