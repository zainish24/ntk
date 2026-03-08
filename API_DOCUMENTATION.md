# NTR Properties REST API Documentation

Base URL: `https://your-domain.com/api/v1`

## Authentication
All authenticated endpoints require a valid Supabase session token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Endpoints

### 1. Get All Phases
**GET** `/phases`

Returns all active phases in North Town Residency.

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Phase 1",
      "location": "Near 4K Chowrangi",
      "description": "...",
      "display_order": 1,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 2. Get Blocks
**GET** `/blocks?phase_id=<uuid>`

Returns blocks, optionally filtered by phase.

**Query Parameters:**
- `phase_id` (optional): Filter blocks by phase ID

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "phase_id": "uuid",
      "name": "Titanium Block",
      "block_type": "residential",
      "is_active": true,
      "phase": {
        "name": "Phase 1"
      }
    }
  ]
}
```

---

### 3. Get Listings
**GET** `/listings`

Returns approved listings with filters and pagination.

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 20): Items per page
- `phase_id`: Filter by phase
- `block_id`: Filter by block
- `property_type`: `residential_plot` or `commercial_shop`
- `listing_type`: `sale` or `rent`
- `min_price`: Minimum price
- `max_price`: Maximum price
- `search`: Search in title
- `sort_by` (default: created_at): Sort field
- `sort_order` (default: desc): `asc` or `desc`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "120 Sq Yd Corner Plot",
      "description": "...",
      "phase_id": "uuid",
      "block_id": "uuid",
      "property_type": "residential_plot",
      "listing_type": "sale",
      "plot_size_sqyd": 120,
      "price": 5000000,
      "price_type": "negotiable",
      "is_corner": true,
      "is_road_facing": true,
      "status": "approved",
      "created_at": "2024-01-01T00:00:00Z",
      "phase": { "id": "uuid", "name": "Phase 1" },
      "block": { "id": "uuid", "name": "Titanium Block" },
      "images": [
        {
          "id": "uuid",
          "image_url": "https://...",
          "is_primary": true,
          "display_order": 0
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### 4. Get Single Listing
**GET** `/listings/:id`

Returns a single listing by ID (increments view count).

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "...",
    "description": "...",
    "phase": { "id": "uuid", "name": "Phase 1", "location": "..." },
    "block": { "id": "uuid", "name": "Titanium Block" },
    "images": [...],
    "profile": {
      "full_name": "John Doe",
      "phone": "+923001234567"
    }
  }
}
```

---

### 5. Create Listing (Authenticated)
**POST** `/listings`

Creates a new listing (status: pending).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "120 Sq Yd Corner Plot",
  "description": "Prime location plot...",
  "phase_id": "uuid",
  "block_id": "uuid",
  "property_type": "residential_plot",
  "listing_type": "sale",
  "plot_size_sqyd": 120,
  "price": 5000000,
  "price_type": "negotiable",
  "is_corner": true,
  "is_road_facing": false,
  "is_park_facing": false,
  "is_west_open": false,
  "has_construction": false,
  "construction_status": "empty",
  "address_details": "Near main gate"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "status": "pending",
    ...
  }
}
```

---

### 6. Update Listing (Authenticated)
**PUT** `/listings/:id`

Updates a listing (only pending listings by owner).

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:** Same as create listing

---

### 7. Delete Listing (Authenticated)
**DELETE** `/listings/:id`

Deletes a listing (only by owner).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Listing deleted"
}
```

---

### 8. Upload Image (Authenticated)
**POST** `/upload`

Uploads an image to Supabase Storage.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Body (FormData):**
- `file`: Image file
- `listing_id` (optional): If provided, creates listing_images record

**Response:**
```json
{
  "data": {
    "url": "https://...",
    "path": "user-id/timestamp.jpg"
  }
}
```

---

### 9. Get User's Listings (Authenticated)
**GET** `/user/listings?status=<status>`

Returns current user's listings.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, rejected)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "...",
      "status": "pending",
      "rejection_reason": null,
      ...
    }
  ]
}
```

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Flutter Integration Example

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class NTRApi {
  static const baseUrl = 'https://your-domain.com/api/v1';
  
  static Future<List<dynamic>> getListings({
    int page = 1,
    String? phaseId,
    String? propertyType,
  }) async {
    final queryParams = {
      'page': page.toString(),
      if (phaseId != null) 'phase_id': phaseId,
      if (propertyType != null) 'property_type': propertyType,
    };
    
    final uri = Uri.parse('$baseUrl/listings').replace(
      queryParameters: queryParams,
    );
    
    final response = await http.get(uri);
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return data['data'];
    } else {
      throw Exception('Failed to load listings');
    }
  }
  
  static Future<Map<String, dynamic>> createListing(
    String accessToken,
    Map<String, dynamic> listingData,
  ) async {
    final response = await http.post(
      Uri.parse('$baseUrl/listings'),
      headers: {
        'Authorization': 'Bearer $accessToken',
        'Content-Type': 'application/json',
      },
      body: json.encode(listingData),
    );
    
    if (response.statusCode == 201) {
      final data = json.decode(response.body);
      return data['data'];
    } else {
      throw Exception('Failed to create listing');
    }
  }
}
```
