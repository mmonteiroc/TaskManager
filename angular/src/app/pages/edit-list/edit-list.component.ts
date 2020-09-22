import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskService} from '../../task.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) {
  }

  listId: string;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.listId = params.listId;
    });
  }


  updateList(title: string): void {
    this.taskService.update(this.listId, title).subscribe((res)=>{
      console.log(res);
      this.router.navigate(['/lists']);
    });
  }
}
