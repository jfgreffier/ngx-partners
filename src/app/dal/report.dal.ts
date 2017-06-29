import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RestService } from '../services/rest.service';
import { NotificationService } from '../services/notification.service';

import { ProjectDAL } from '../dal/project.dal';

import { Project } from '../models/project';
import { Report } from '../models/report';

@Injectable()
export class ReportDAL {
  constructor(
    private rest: RestService,
    private notif: NotificationService,
    private projectDAL: ProjectDAL,
  ) {
  }

  public readMonth = (year: number, month: number): Promise<Array<Report>> => {
    return this.rest.get('reports/me/' + year, month + 1).map((array: Array<Report>) => {
      return array.map(it => {
        it.date = new Date(it.date);
        return it;
      });
    }).toPromise();
  }

  public saveReport = (year: number, month: number, rawData: Object) => {
    let reports = Report.buildReports(year, month, rawData);

    // we convert Date to Object because of timezones, and to make month 1-indexed
    let data = reports.map(report => {
      let o: Object = report;
      o["date"] = { "year": year, "month": month + 1, "day": report.date.getDate() };
      return o;
    });

    this.rest.update('reports/me/' + year, month + 1, data).toPromise().then(() => {
      this.notif.success('Compte rendu ' + (month + 1) + '/' + year + ' sauvegardé.');
    });
  }
}
