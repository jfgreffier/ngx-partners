export class CalendarHelper {

  public static monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  public static daysInMonth(anyDate: Date): number {
    return new Date(anyDate.getFullYear(), anyDate.getMonth() + 1, 0).getDate();
  }

  public static monthName(month): string{
    let m: number = month.getMonth() || month;

    return CalendarHelper.monthNames[m];
  }

}
