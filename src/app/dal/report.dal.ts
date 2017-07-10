import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RestService } from '../services/rest.service';
import { NotificationService } from '../services/notification.service';

import { Project } from '../models/project';
import { Report } from '../models/report';

@Injectable()
export class ReportDAL {
  constructor(
    private rest: RestService,
    private notif: NotificationService,
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

  private doSave =  (year: number, month: number, rawData: Object): Observable<any> => {
    let reports = Report.buildReports(year, month, rawData);

    // we convert Date to Object because of timezones, and to make month 1-indexed
    let data = reports.map(report => {
      let o: Object = report;
      o["date"] = { "year": year, "month": month + 1, "day": report.date.getDate() };
      return o;
    });

    return this.rest.update('reports/me/' + year, month + 1, data);
  }

  public saveReport = (year: number, month: number, rawData: Object) => {
    this.doSave(year, month, rawData).toPromise().then(() => {
      this.notif.success('Compte rendu ' + (month + 1) + '/' + year + ' sauvegardé.');
    });
  }

  public submitReport = (year: number, month: number, rawData: Object) => {
    return this.doSave(year, month, rawData).combineLatest(
      this.rest.add('reports/me/' + year + '/' + (month + 1) + '/submit', {})
    ).toPromise().then(obs => {
      this.notif.success('Compte rendu ' + (month + 1) + '/' + year + ' sauvegardé et soumis pour validation.', 'Validation');
    }).catch(e => {
      this.notif.error('Le compte rendu ' + (month + 1) + '/' + year + ' a été refusé.', 'Compte rendu invalide');
    });
  }

  public readInfo = () => {
    return this.rest.get('reports/me/info').toPromise();
  }
}
