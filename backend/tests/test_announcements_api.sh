#!/bin/bash

# Test script for announcement API with image
# Usage: ./test_announcements_api.sh

API_URL="http://localhost:3000/api"
ADMIN_EMAIL="admin@griote.com"
ADMIN_PASSWORD="admin123"

echo "=== Testing Announcement API with Image ==="

# 1. Login to get JWT token
echo ""
echo "1. Login as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "'$ADMIN_EMAIL'", "password": "'$ADMIN_PASSWORD'"}')

echo "Login response: $LOGIN_RESPONSE"

# Extract token (simple parsing)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to get token. Exiting."
  exit 1
fi

echo "Token obtained: ${TOKEN:0:50}..."

# 2. Upload an image first
echo ""
echo "2. Upload an image..."
IMAGE_FILE="/home/brandoniscoding/Documents/GRIOTE/code/griote/frontend/public/griote.jpg"

if [ ! -f "$IMAGE_FILE" ]; then
  echo "Image file not found at $IMAGE_FILE"
  exit 1
fi

UPLOAD_RESPONSE=$(curl -s -X POST "$API_URL/admin/annonces/upload-image" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@$IMAGE_FILE" \
  -F "description=Test announcement image")

echo "Upload response: $UPLOAD_RESPONSE"

# Extract image ID
IMAGE_ID=$(echo $UPLOAD_RESPONSE | grep -o 'image_id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$IMAGE_ID" ]; then
  echo "Failed to upload image. Exiting."
  exit 1
fi

echo "Image uploaded with ID: $IMAGE_ID"

# 3. Create announcement with image_apercu_id
echo ""
echo "3. Create announcement with image_apercu_id: $IMAGE_ID..."

CREATE_RESPONSE=$(curl -s -X POST "$API_URL/admin/annonces" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Test Announcement with Image",
    "contenu": "<p>This is a test announcement created via API with an image.</p>",
    "image_apercu_id": '$IMAGE_ID'
  }')

echo "Create response: $CREATE_RESPONSE"

# Check if image_apercu_id is set in response
echo ""
echo "4. Checking result..."
if echo "$CREATE_RESPONSE" | grep -q '"image_apercu_id"'; then
  echo "SUCCESS: Announcement created with image_apercu_id"
else
  echo "FAILED: image_apercu_id not found in response"
fi

echo ""
echo "=== Test Complete ==="
