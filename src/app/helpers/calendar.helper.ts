let addDay = (date: Date, day: number) => {
  let r = new Date(date);
  r.setDate(r.getDate() + day);
  return r;
}

export class CalendarHelper {

  public static monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  public static daysShortNames = [ "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  public static bankHolidays: Array<Date> = new Array<Date>();

  public static daysInMonth(anyDate: Date): number {
    return new Date(anyDate.getFullYear(), anyDate.getMonth() + 1, 0).getDate();
  }

  public static monthName(month: any): string{
    let m: number = month.getMonth() || month;

    return CalendarHelper.monthNames[m];
  }

  public static dayShortName(day: any): string{
    let d: number = day.getFullYear() ? day.getDay() : day;

    return CalendarHelper.daysShortNames[d];
  }

  public static isWorkingDay(day: Date): boolean{
    let weekend: boolean = day.getDay() % 6 == 0;

    let bankHoliday: boolean = CalendarHelper.bankHolidays.findIndex(it => {
      return it.getFullYear() == day.getFullYear() && it.getMonth() == day.getMonth() && it.getDate() == day.getDate();
    }) != -1;

    return !weekend && !bankHoliday;
  }

  public static computeBankHolidays(year: number) {
    let r = [];
    for (let y = year - 1; y <= year + 1; y++){
      r.push(new Date(y, 1 - 1, 1)); // Jour de l'an
      r.push(new Date(y, 5 - 1, 1)); // Fete du travail
      r.push(new Date(y, 5 - 1, 8)); // Victoire 1945
      r.push(new Date(y, 7 - 1, 14)); // Fete nationale
      r.push(new Date(y, 8 - 1, 15)); // Assomption
      r.push(new Date(y, 11 - 1, 1)); // Toussaint
      r.push(new Date(y, 11 - 1, 11)); // Armistice 1918
      r.push(new Date(y, 12 - 1, 25)); // Noel

		  // Récupération de paques. Permet ensuite d'obtenir le jour de l'ascension et celui de la pentecote
      let easter = CalendarHelper.eastern_computus(y);
      r.push(addDay(easter, 1)); // Paques
      r.push(addDay(easter, 39)); // Ascension
      r.push(addDay(easter, 50)); // Pentecote
    }

    CalendarHelper.bankHolidays = r;
  }

  public static eastern_computus(y: number): Date {
        var date, a, b, c, m, d;

        // Instantiate the date object.
        date = new Date;

        // Set the timestamp to midnight.
        date.setHours( 0, 0, 0, 0 );

        // Set the year.
        date.setFullYear( y );

        // Find the golden number.
        a = y % 19;

        // Choose which version of the algorithm to use based on the given year.
        b = ( 2200 <= y && y <= 2299 ) ?
            ( ( 11 * a ) + 4 ) % 30 :
            ( ( 11 * a ) + 5 ) % 30;

        // Determine whether or not to compensate for the previous step.
        c = ( ( b === 0 ) || ( b === 1 && a > 10 ) ) ?
            ( b + 1 ) :
            b;

        // Use c first to find the month: April or March.
        m = ( 1 <= c && c <= 19 ) ? 3 : 2;

        // Then use c to find the full moon after the northward equinox.
        d = ( 50 - c ) % 31;

        // Mark the date of that full moon—the "Paschal" full moon.
        date.setMonth( m, d );

        // Count forward the number of days until the following Sunday (Easter).
        date.setMonth( m, d + ( 7 - date.getDay() ) );

        // Gregorian Western Easter Sunday
        return date;
    }

    public static init(){
      CalendarHelper.computeBankHolidays(new Date().getFullYear());
    }

}

CalendarHelper.init();