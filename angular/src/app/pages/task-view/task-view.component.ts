import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskService} from '../../task.service';
import Task from '../../models/task.model';
import List from '../../models/list.model';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists: List[];
  tasks: Task[];

  selectedListId: string;

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params.listId) {
        this.selectedListId = params.listId;
        this.taskService.getTasks(params.listId).subscribe((tasks: Task[]) => {
          this.tasks = tasks;
        });
      } else {
        this.tasks = undefined;
      }

    });

    this.taskService.getLists().subscribe((lists: List[]) => {
      this.lists = lists;
    });
  }

  onTaskClick(task: Task): void {
    // set task to completed
    this.taskService.toggleCompleted(task).subscribe(() => {
      task.completed = !task.completed;
    });
  }

  onDeleteListClicked(): void {
    this.taskService.deleteList(this.selectedListId).subscribe((response) => {
      console.log(response);
      this.router.navigate(['/lists']);
    });
  }

  onTaskDelete(id: string): void {
    this.taskService.deleteTask(this.selectedListId, id).subscribe((response) => {
      this.tasks = this.tasks.filter(indv => indv._id !== id);
      console.log(response);
    });
  }

  disconnect(): void{
    this.authService.logout();
  }


}
