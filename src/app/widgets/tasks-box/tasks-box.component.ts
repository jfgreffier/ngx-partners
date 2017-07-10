import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../models/message';

@Component( {
    /* tslint:disable */
    selector: '.tasksBox',
    /* tslint:enable */
    styleUrls: ['./tasks-box.component.css'],
    templateUrl: './tasks-box.component.html'
})
export class TasksBoxComponent implements OnInit {

    private messages: Message[];
    protected tasksLength: {} = { 0: '9' };

    constructor() {
        // TODO 
    }

    public ngOnInit() {
        // TODO
    }

}
