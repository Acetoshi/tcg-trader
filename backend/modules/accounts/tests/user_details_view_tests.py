import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model

from django.db import connection

User = get_user_model()


# TODO : this is common, and probably needs to be moved into another file
@pytest.fixture
def enable_unaccent_extension():
    with connection.cursor() as cursor:
        cursor.execute("CREATE EXTENSION IF NOT EXISTS unaccent;")


@pytest.fixture
def authenticated_client(db, enable_unaccent_extension):
    user = User.objects.create_user(
        username="testuser", password="strongpass", email="user@example.com"
    )
    client = APIClient()
    client.force_authenticate(user=user)
    return client, user


# username
def test_patch_user_details_invalid_username(authenticated_client):
    client, _ = authenticated_client
    url = reverse("user-details")
    bad_data = {"username": "aaaaaaaaaaaaaaaaaaaaa"}

    response = client.patch(url, bad_data, format="json")

    assert response.status_code == 400


def test_patch_user_details_valid_username(authenticated_client):
    client, _ = authenticated_client
    url = reverse("user-details")
    good_data = {"username": "aaaaaaaaaa"}

    response = client.patch(url, good_data, format="json")

    assert response.status_code == 200
    assert response.data["username"] == "aaaaaaaaaa"


# tcgp_id
def test_patch_user_details_invalid_tcgp_id(authenticated_client):
    client, _ = authenticated_client
    url = reverse("user-details")
    bad_data = {"tcgpId": "1234-5678-bad-format"}

    response = client.patch(url, bad_data, format="json")

    assert response.status_code == 400
    assert "tcgpId" in response.data


def test_patch_user_details_valid_tcgp_id(authenticated_client):
    client, _ = authenticated_client
    url = reverse("user-details")
    good_data = {"tcgpId": "1234-5678-9012-3456"}

    response = client.patch(url, good_data, format="json")

    assert response.status_code == 200
    assert response.data["tcgpId"] == "1234-5678-9012-3456"


# bio
def test_patch_user_details_invalid_bio(authenticated_client):
    client, _ = authenticated_client
    url = reverse("user-details")
    bad_data = {"bio": "hello" * 100}

    response = client.patch(url, bad_data, format="json")

    assert response.status_code == 400
