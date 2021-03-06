import {Injectable} from '@angular/core';
import {WebRequestService} from './web-request.service';
import {Observable} from 'rxjs';
import Task from './models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService) {
  }


  /*
  * LISTS
  * */
  createList(title: string): Observable<any> {
    // We want to send a web request to create a list
    return this.webReqService.post('lists', {title});
  }

  update(listId: string, title: string): Observable<any> {
    // We want to send a web request to create a list
    return this.webReqService.patch(`lists/${listId}`, {title});
  }

  updateTask(listId: string, taskId: string, title: string): Observable<any> {
    // We want to send a web request to create a list
    return this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, {title});
  }

  getLists(): Observable<any> {
    return this.webReqService.get('lists');
  }

  getTasks(listId: string): Observable<any> {
    return this.webReqService.get(`lists/${listId}/tasks`);
  }

  deleteList(listId: string): Observable<any> {
    return this.webReqService.delete(`lists/${listId}`);
  }

  /*
  * Tasks
  * */

  createTask(title: string, listId: string): Observable<any> {
    // We want to send a web request to create a list
    return this.webReqService.post(`lists/${listId}/tasks`, {title});
  }

  toggleCompleted(task: Task): Observable<any> {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }


  deleteTask(listId: string, taskId: string ): Observable<any> {
    return this.webReqService.delete(`lists/${listId}/tasks/${taskId}`);
  }
}
