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
@pytest.mark.parametrize(
    "username,expected_status",
    [
        ("a" * 10, 200),
        ("a" * 25, 400),
        ("ok", 400),  # too short if you require 3+ chars
        ("valid_user", 200),
    ],
)
def test_patch_username(authenticated_client, username, expected_status):
    client, _ = authenticated_client
    url = reverse("user-details")
    data = {"username": username}

    response = client.patch(url, data, format="json")
    assert response.status_code == expected_status


# tcgp_id
@pytest.mark.parametrize(
    "tcgp_id,expected_status",
    [
        ("1234-5678-9012-3456", 200),
        ("1234-5678-bad-format", 400),
        ("abcd-1234-5678-0000", 400),  # edge case with letters
        ("1234567890123456", 400),  # no dashes
    ],
)
def test_patch_tcgp_id(authenticated_client, tcgp_id, expected_status):
    client, _ = authenticated_client
    url = reverse("user-details")
    data = {"tcgpId": tcgp_id}

    response = client.patch(url, data, format="json")
    assert response.status_code == expected_status


# bio
@pytest.mark.parametrize(
    "bio,expected_status",
    [
        ("hello", 200),
        ("hello" * 100, 400),  # too long
        ([1, 2, 3], 400),
    ],
)
def test_patch_user_details_invalid_bio(authenticated_client, bio, expected_status):
    client, _ = authenticated_client
    url = reverse("user-details")
    bad_data = {"bio": "hello" * 100}

    response = client.patch(url, bad_data, format="json")

    assert response.status_code == 400
