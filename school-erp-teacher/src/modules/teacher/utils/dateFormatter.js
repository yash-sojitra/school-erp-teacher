export function getTodaysDate() {
    var currentDate = new Date();
    var month = currentDate.toLocaleString('default', { month: 'long' }); // Get full name of the month
    var day = currentDate.getDate();

    // Add leading zero if necessary
    day = (day < 10 ? '0' : '') + day;

    // Return the formatted date string in "Month day" format
    return month + ' ' + day;
}

export function getTodaysDay() {
    // Create a new Date object
    var today = new Date();

    // Get the day of the week (0-6, where 0 is Sunday, 1 is Monday, ..., 6 is Saturday)
    var dayOfWeek = today.getDay();

    // Array of day names
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Return the day of the week as a string
    return days[dayOfWeek];
}
