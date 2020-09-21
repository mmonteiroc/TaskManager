import { Component, OnInit } from '@angular/core';
import {TaskService} from '../../task.service';
import {Router} from '@angular/router';
import List from '../../models/list.model';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss']
})
export class NewListComponent implements OnInit {

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit(): void {
  }

  createNewList(title: string): void {
    this.taskService.createList(title).subscribe((list: List) => {
      console.log(list);
      const newId = list._id;
      this.router.navigate([ '/lists', newId ]);
    });
  }
}
