public with sharing class TaskController {
    
    @AuraEnabled(cacheable=true)
    public static List<Task> getTasks() {
        // Retrieve tasks assigned to the current user
        return [SELECT Id, Subject, ActivityDate, Status FROM Task WHERE OwnerId = :UserInfo.getUserId()];
    }

    @AuraEnabled
    public static void markTaskComplete(String taskId) {
        // Update task status to 'Completed'
        Task taskToUpdate = new Task(Id = taskId, Status = 'Completed');
        update taskToUpdate;
    }

    @AuraEnabled
    public static void createTask(String subject, Date dueDate, String priority) {
        Task newTask = new Task(
            Subject = subject,
            ActivityDate = dueDate,
            Priority = priority,
            OwnerId = UserInfo.getUserId()
        );
        insert newTask;
    }
}