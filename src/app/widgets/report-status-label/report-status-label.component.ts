import { Component, Input } from '@angular/core';

@Component( {
    selector: 'report-status-label',
    templateUrl: './report-status-label.component.html'
})
export class ReportStatusLabelComponent {

@Input()
protected status: string;

@Input()
protected valid: boolean;

}
