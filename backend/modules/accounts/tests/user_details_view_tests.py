import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
def test_patch_user_details_invalid_tcgp_id():
    # Arrange: create and authenticate user
    user = User.objects.create_user(
        username="testuser", password="strongpass", email="user@example.com"
    )

    client = APIClient()
    client.force_authenticate(user=user)

    # This should match your urlpatterns name
    url = reverse("user-details")

    # Invalid tcgpId format
    bad_data = {"tcgpId": "1234-5678-bad-format"}

    # Act
    response = client.patch(url, bad_data, format="json")

    # Assert
    assert response.status_code == 400
    assert "tcgpId" in response.data
    assert response.data["tcgpId"] == ["tcgpId must be in the format 1234-5678-9012-3456"]
