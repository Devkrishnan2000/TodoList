from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from user.models import User


# Create your tests here
class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # creating a test user
        self.user = User.objects.create_user(
            username="tester", password="12345678"
        )
        self.client.force_authenticate(self.user)
        # urls
        self.login_url = reverse("login")
        self.view_task_url = reverse("view-tasks")
        self.view_pending_task_url = f"{reverse('view-tasks')}?status=False"
        self.view_completed_task_url = f"{reverse('view-tasks')}?status=True"
        self.view_ascending_url = f"{reverse('view-tasks')}?sort=asc"
        self.view_decending_url = f"{reverse('view-tasks')}?sort=desc"
        self.view_invalid__status_url = f"{reverse('view-tasks')}?status=fbhsdfg"
        self.view_invalid__sort_url = f"{reverse('view-tasks')}?sort=dsfdjshff"
        self.create_task_url = reverse("create-task")
        # values
        self.login_data_valid_data = {
            "username": "tester",
            "password": "12345678"
        }
        self.login_data_invalid_data = {
            "username": "fsdfgs",
            "password": "00000"
        }
        self.valid_task_data = {
            "task_name": "task 2",
            "task_desc": "hello world1"
        }
        self.valid_closed_task_data = {
            "task_name": "task 1",
            "task_desc": "hello world",
            "task_status": True,
        }
        self.create_invalid_taskname_data = {
            "task_name": "@$Df",
            "task_desc": "hello world",
        }
        self.create_invalid_taskdesc_data = {
            "task_name": "task 1",
            "task_desc": "@$fg",
        }
        self.update_valid_task_data = {
            "task_name": "task update1",
            "task_desc": "hello world update1",
            "version": 1,
        }
        self.update_invalid_taskname_data = {
            "task_name": "@#$",
            "task_desc": "hello world update",
            "version": 1,
        }
        self.update_invalid_taskdesc_data = {
            "task_name": "task update",
            "task_desc": "#$%#",
            "version": 1,
        }
        self.update_version_mismatch_data = {
            "task_name": "task update",
            "task_desc": "hello world update",
            "version": 100,
        }
        return super().setUp()

    def helper_create_task(self, payload):
        response = self.client.post(
            self.create_task_url, data=payload, format="json"
        )
        return response


class LoginTestCase(BaseTest):
    def test_can_login_with_valid_credentials(self):
        response = self.client.post(
            self.login_url, data=self.login_data_valid_data, format="json"
        )
        self.assertEqual(response.status_code, 200)

    def test_can_login_with_invalid_credentials(self):
        response = self.client.post(
            self.login_url, data=self.login_data_invalid_data, format="json"
        )
        self.assertEqual(response.status_code, 401)


class CreateTaskTestCase(BaseTest):
    def test_can_create_task(self):
        response = self.helper_create_task(self.valid_task_data)
        self.assertEqual(response.status_code, 201)

    def test_cannot_create_invalid_taskname(self):
        response = self.client.post(
            self.create_task_url,
            data=self.create_invalid_taskname_data,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cannot_create_invalid_taskdesc(self):
        response = self.client.post(
            self.create_task_url,
            data=self.create_invalid_taskdesc_data,
            format="json",
        )
        self.assertEqual(response.status_code, 400)


class ViewTasksTestCase(BaseTest):
    def test_can_get_all_task(self):
        self.helper_create_task(
            self.valid_task_data
        ).content  # need some task's to display it
        response = self.client.get(self.view_task_url, format="json")
        self.assertEqual(response.status_code, 200)

    def test_can_get_pending_task(self):
        self.helper_create_task(
            self.valid_task_data
        ).content  # need some task's to display it
        response = self.client.get(self.view_pending_task_url, format="json")
        self.assertEqual(response.status_code, 200)

    def test_can_get_completed_task(self):
        self.helper_create_task(
            self.valid_closed_task_data
        ).content  # need some task's to display it
        response = self.client.get(self.view_completed_task_url, format="json")
        self.assertEqual(response.status_code, 200)

    def test_if_tasklist_empty(self):
        response = self.client.get(self.view_task_url, format="json")
        self.assertEqual(response.status_code, 200)
        
    def test_can_get_task_in_ascending(self):
        self.helper_create_task(
            self.valid_task_data
        ).content  # need some task's to display it
        response = self.client.get(self.view_ascending_url, format="json")
        self.assertEqual(response.status_code, 200) 
    
    def test_can_get_task_in_descending(self):
        self.helper_create_task(
            self.valid_task_data
        ).content  # need some task's to display it
        response = self.client.get(self.view_decending_url, format="json")
        self.assertEqual(response.status_code, 200)   
    
    def test_cannot_get_invalid_status(self):
        self.helper_create_task(
            self.valid_task_data
        ).content  # need some task's to display it
        response = self.client.get(self.view_invalid__status_url, format="json")
        self.assertEqual(response.status_code, 400)  
    
    def test_cannot_get_invalid_sort(self):
        self.helper_create_task(
            self.valid_task_data
        ).content  # need some task's to display it
        response = self.client.get(self.view_invalid__sort_url, format="json")
        self.assertEqual(response.status_code, 400)               


class CloseTaskTestCase(BaseTest):
    def test_can_close_task(self):
        # need some task to close it
        task = self.helper_create_task(
            self.valid_task_data
        )
        # extract task id from resulting task
        task_id = task.json()["data"]["id"]
        close_task_url_valid_id = reverse(
            "close-task", kwargs={"task_id": task_id}
        )
        response = self.client.put(close_task_url_valid_id, format="json")
        self.assertEqual(response.status_code, 200)

    def test_cannot_close_invalid_task(self):
        task_id = 100  # task id that doesn't exist
        close_task_url_invalid_id = reverse(
            "close-task", kwargs={"task_id": task_id}
        )
        response = self.client.put(close_task_url_invalid_id, format="json")
        self.assertEqual(response.status_code, 404)


class DeleteTaskTestCase(BaseTest):
    def test_can_delete_task(self):
        # need some task to delete it
        task = self.helper_create_task(
            self.valid_task_data
        )
        # extract task id from resulting task
        task_id = task.json()["data"]["id"]
        delete_task_url_valid_id = reverse(
            "delete-task", kwargs={"task_id": task_id}
        )
        response = self.client.delete(delete_task_url_valid_id, format="json")
        self.assertEqual(response.status_code, 200)

    def test_cannot_delete_invalid_task(self):
        task_id = 100  # task id that doesn't exist
        delete_task_url_invalid_id = reverse(
            "delete-task", kwargs={"task_id": task_id}
        )
        response = self.client.delete(
            delete_task_url_invalid_id, format="json"
        )
        self.assertEqual(response.status_code, 404)


class UpdateTaskTestCase(BaseTest):
    def test_can_update_task(self):
        # need some task to update
        task = self.helper_create_task(self.valid_task_data)
        # extract task id from resulting task
        task_id = task.json()["data"]["id"]
        update_task_url_valid_id = reverse(
            "update-task", kwargs={"task_id": task_id}
        )
        response = self.client.put(
            update_task_url_valid_id,
            data=self.update_valid_task_data,
            format="json",
        )
        self.assertEqual(response.status_code, 200)

    def test_cannot_update_invalid_taskname(self):
        # need some task to update
        task = self.helper_create_task(self.valid_task_data)
        # extract task id from resulting task
        task_id = task.json()["data"]["id"]
        update_task_url_valid_id = reverse(
            "update-task", kwargs={"task_id": task_id}
        )
        response = self.client.put(
            update_task_url_valid_id,
            data=self.update_invalid_taskname_data,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cannot_update_invalid_taskdesc(self):
        # need some task to update
        task = self.helper_create_task(self.valid_task_data)
        # extract task id from resulting task
        task_id = task.json()["data"]["id"]
        update_task_url_valid_id = reverse(
            "update-task", kwargs={"task_id": task_id}
        )
        response = self.client.put(
            update_task_url_valid_id,
            data=self.update_invalid_taskdesc_data,
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_cannot_update_invalid_task(self):
        task_id = 100  # task id that doesn't exist in db
        update_task_url_invalid_id = reverse(
            "update-task", kwargs={"task_id": task_id}
        )
        response = self.client.put(
            update_task_url_invalid_id,
            data=self.update_valid_task_data,
            format="json",
        )
        self.assertEqual(response.status_code, 404)
    
    
    def test_cannot_update_version_mismatch(self):
         # need some task to update
        task = self.helper_create_task(self.valid_task_data)
        # extract task id from resulting task
        task_id = task.json()["data"]["id"]
        update_task_url_invalid_id = reverse(
            "update-task", kwargs={"task_id": task_id}
        )
        response = self.client.put(
            update_task_url_invalid_id,
            data=self.update_version_mismatch_data,
            format="json",
        )
        self.assertEqual(response.status_code, 409)    
