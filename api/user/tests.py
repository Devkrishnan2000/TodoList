from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from user.models import User

# Create your tests here.


class BaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_data_valid = {
            "username": "test@gmail.com",
            "password": "123",
            "first_name": "test",
            "last_name": "tester",
        }
        self.register_data_invalid_username = {
            "username": "test",
            "password": "123",
            "first_name": "test",
            "last_name": "tester",
        }
        self.register_data_invalid_password = {
            "username": "test@gmail.com",
            "password": "",
            "first_name": "test",
            "last_name": "tester",
        }
        self.register_data_invalid_first_name = {
            "username": "test@gmail.com",
            "password": "123",
            "first_name": "test1",
            "last_name": "tester",
        }
        self.register_data_invalid_last_name = {
            "username": "test@gmail.com",
            "password": "123",
            "first_name": "test",
            "last_name": "tester#",
        }
        
        
        
class RegistrationTestCase(BaseTest):
    def test_can_register(self):
        response = self.client.post(reverse("create_user"),data=self.register_data_valid,format="json")
        self.assertEqual(response.status_code,201)
    def test_cannot_register_invalid_username(self):
        response = self.client.post(reverse("create_user"),data=self.register_data_invalid_username,format="json")
        self.assertEqual(response.status_code,400)
    def test_cannot_register_invalid_password(self):
        response = self.client.post(reverse("create_user"),data=self.register_data_invalid_password,format="json")
        self.assertEqual(response.status_code,400)  
    def test_cannot_register_invalid_first_name(self):
        response = self.client.post(reverse("create_user"),data=self.register_data_invalid_first_name,format="json")
        self.assertEqual(response.status_code,400)
    def test_cannot_register_invalid_last_name(self):
        response = self.client.post(reverse("create_user"),data=self.register_data_invalid_last_name,format="json")
        self.assertEqual(response.status_code,400)                       
        
        
