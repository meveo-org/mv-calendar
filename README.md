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
    allow-partial                           // allows entering and selecting partial dates(year only, year and month only)
    min-year="2010"                         // minimum year allowed in the year input
    max-year="2030"                         // maximum year allowed in the year input
    pattern="MM/DD/YYYY"                    // the date pattern used for masking and formatting the date
    pattern-matcher="MDY"                   // specify which characters in the pattern are editable
    pattern-regex="\\d"                     // specify regex used for characters allowed in the pattern
    ?has-error="${this.hasError}"           // optional - boolean to indicate if the input date has an error
    .theme="${theme}"                       // theme used in displaying the calendar (light or dark)
    .selected="${this.selectedDate}"        // the Date object that specifies the value of the calendar
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
    allow-partial                           // allows entering and selecting partial dates(year only, year and month only)
    min-year="2010"                         // minimum year allowed in the year input
    max-year="2030"                         // maximum year allowed in the year input
    pattern="MM/DD/YYYY"                    // the date pattern used for masking and formatting the date
    pattern-matcher="MDY"                   // specify which characters in the pattern are editable
    pattern-regex="\\d"                     // specify regex used for characters allowed in the pattern
    ?has-error="${this.hasError}"           // optional - boolean to indicate if the input date has an error
    .theme="${theme}"                       // theme used in displaying the calendar (light or dark)
    .selected="${this.selectedDate}"        // the Date object that specifies the value of the calendar
    @select-date="${this.changeDate}"       // custom event dispatched when a date is selected/entered
  ></mv-calendar>
```

The range calendar will display a component with two calendars that allow the user to choose a start and end date range.
```javascript
  <mv-calendar
    name="rangeCalendar"                   // name that is returned in select-date event details
    range-calendar                          // specifies that this is a range calendar
    inline-input                            // displays an inline input at the top of the calendar
    .start="${this.start}"                  // contains the start values and properties
    .end="${this.end}"                      // contains the end values and properties
    monday-first                            // changes the first column to Monday instead of Sunday
    allow-partial                           // allows entering and selecting partial dates(year only, year and month only)
    pattern="MM/DD/YYYY"                    // the date pattern used for masking and formatting the date
    pattern-matcher="MDY"                   // specify which characters in the pattern are editable
    pattern-regex="\\d"                     // specify regex used for characters allowed in the pattern
    .theme="${theme}"                       // theme used in displaying the calendar (light or dark)
    @select-date="${this.changeDate}"       // custom event dispatched when a date is selected/entered
  ></mv-calendar>
```

## Input values
The `selected` attribute's value should have the following details:
```json
{
  date,         // optional - the javascript Date object if a full date is selected
  year,         // the full year value
  month,        // the month value (0-11)
  day           // the day value (0-31)
}
```

The for `range` calendars, the `start` and `end` attributes' values should have the following details:
```json
{
  selected: {
    date,               // optional - the javascript Date object if a full date is selected
    year,               // the full year value
    month,              // the month value (0-11)
    day                 // the day value (0-31)
  },
  placeholder,      // the placeholder text when input is empty
  hasError,       // optional - boolean to indicate if the input date has an error
  minYear,        // minimum year allowed in the year input
  maxYear,        // maximum year allowed in the year input
}
```

## Return values

For `single` calendars, the `select-date` custom event's `detail` has the following values:
```json
const {
  detail: {
    name,           // the value of the name attribute declared in the component
    selected: {
      date,         // the javascript Date object if a full date is selected
      year,         // the full year value
      month,        // the month value (0-11)
      day           // the day value (0-31)
    },
  }
} = event;
```

For `range` calendars, the `select-date` custom event's `detail` has the following values:
```json
const {
  detail: {
    name,           // the value of the name attribute declared in the component
    selected: {
      start: {
        date,         // the javascript Date object if a full date is selected
        year,         // the full year value
        month,        // the month value (0-11)
        day           // the day value (0-31)
      },
      end: {
        date,         // the javascript Date object if a full date is selected
        year,         // the full year value
        month,        // the month value (0-11)
        day           // the day value (0-31)
      },
    }
  }
} = event;
```

You can also check this [demo](https://calendar.meveo.org)


## Acknowledgements
* MvCalendar uses [moment.js](https://momentjs.com/) for formatting.
