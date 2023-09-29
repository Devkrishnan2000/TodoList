from django.db import models
from user.models import User

class Task(models.Model):
    task_name = models.CharField(max_length=100)
    task_desc = models.CharField(max_length=150)
    task_status = models.BooleanField(default=False)
    task_created = models.DateTimeField(auto_now_add=True)
    task_updated = models.DateTimeField(auto_now=True)
    version = models.IntegerField(default=1)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="tasks") 
                          
    def __str__(self) -> str:
        return self.task_name

    class Meta:
        verbose_name = "TodoList"  # human readable name
        db_table = 'task'  # overriding default table name
        ordering = ['-id']
        
