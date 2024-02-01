// taskManager.js
import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getTasks from '@salesforce/apex/TaskController.getTasks';
import markTaskComplete from '@salesforce/apex/TaskController.markTaskComplete';
import createTask from '@salesforce/apex/TaskController.createTask';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class TaskManager extends LightningElement {
    tasks;
    showModal;
    subject = '';
    dueDate = '';
    wiredTasksResult;

    @wire(getTasks)
    wiredTasks(result) {
        this.wiredTasksResult = result;
        if (result.data) {
            this.tasks = result.data;
        } else if (result.error) {
            console.error(result.error);
        }
    }

    markAsComplete(event) {
        const taskId = event.target.dataset.taskId;
        markTaskComplete({ taskId })
            .then(() => {
                return refreshApex(this.wiredTasksResult);
            })
            .catch(error => {
                console.error(error);
            });
    }

    createNewTask() {
        this.showModal = true;
    }

    handleCloseModal() {
        this.showModal = false;
    }

    handleInputChange(event){
        const Name = event.target.name;
        if(Name == 'subject'){
            this.subject = event.target.value;
        }else if(Name == 'dueDate'){
            this.dueDate = event.target.value;
        }
    }

    handleSaveTask() {
        if (!this.subject || !this.dueDate) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please fill in all fields',
                    variant: 'error'
                })
            );
            return;
        }

        createTask({ subject: this.subject, dueDate: this.dueDate, priority: 'Normal' })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Task created successfully',
                        variant: 'success'
                    })
                );
                this.subject = '';
                this.dueDate = '';
                this.showModal = false;
                return refreshApex(this.wiredTasksResult);
            })
            .catch(error => {
                console.error(error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'An error occurred while creating the task',
                        variant: 'error'
                    })
                );
            });
    }
}