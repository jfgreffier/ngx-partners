import { User } from "../models/user";
import { Project } from "../models/project";

export class Report {
  public user: number;
  public activity: number;
  public date: Date;
  public duration: number;

  constructor(activity?: number, date?: Date, duration?: number, user?: number) {
    this.user = user || null;
    this.activity = activity || 0;
    this.date = date || null;
    this.duration = duration || 0;
  }

  public static buildReports = (year: number, month: number, rawData: Object): Array<Report> => {
    let reports = new Array<Report>();

    Object.keys(rawData).forEach(_project => {
        let project: number = Number(_project);

        Object.keys(rawData[project]).forEach(_day => {
            let day: number = Number(_day);

            if (rawData[project][day] <= 0) return;

            reports.push(new Report(project, new Date(year, month, day), rawData[project][day]));
        })
    })

    return reports;
  }
}
