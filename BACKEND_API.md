# Backend API (V1)

Base URL: `${BACKEND_ORIGIN}/api`

---

## List endpoints

### GET /links/redirect
List **redirect**-type links.

**Response 200**
```json
[
  {
    "id": 6,
    "type": "redirect",
    "slug": "promo",
    "redirect": "https://example.com/promo",
    "description": "Promo link",
    "hits": 3,
    "created": "2025-08-26T06:25:16.015Z",
    "updated": "2025-08-26T06:25:16.015Z"
  }
]
```

### GET /links/ab
List **A/B**-type links with their variants (weights shown as stored).

**Response 200**
```json
[
  {
    "id": 9,
    "type": "ab",
    "slug": "abtest",
    "redirect": [
      { "id": 3, "short_id": 9, "name": "V1", "redirect": "https://example.com/v1", "weight": 50 },
      { "id": 4, "short_id": 9, "name": "v2", "redirect": "https://example.com/v2", "weight": 50 }
    ],
    "description": "AB test description",
    "hits": 7,
    "created": "2025-08-28T09:02:22.128Z",
    "updated": "2025-08-28T09:02:22.128Z"
  },
  {
    "id": 7,
    "type": "ab",
    "slug": "testab",
    "redirect": [
      { "id": 1, "short_id": 7, "name": "v1", "redirect": "https://example.com/1", "weight": 50 },
      { "id": 2, "short_id": 7, "name": "v2", "redirect": "https://example.com/2", "weight": 50 }
    ],
    "description": "test ab description",
    "hits": 7,
    "created": "2025-08-26T06:26:48.209Z",
    "updated": "2025-08-26T06:26:48.209Z"
  }
]
```

### GET /links/calendar
List **calendar**-type links (summary rows).

**Response 200**
```json
[
  {
    "id": 6,
    "type": "calendar",
    "slug": "testcal",
    "redirect": "",
    "description": "Cal Testing",
    "hits": 3,
    "created": "2025-08-26T06:25:16.015Z",
    "updated": "2025-08-26T06:25:16.015Z"
  }
]
```

> Note: Detailed calendar rules live in the `calendar` table and are used by the resolver and ICS builder.

---

## Create endpoints (V1)

### POST /links/redirect
Create a redirect link.

**Body**
```json
{ "slug": "promo", "redirect": "https://example.com/promo", "description": "Promo link" }
```

### POST /links/ab
Create an A/B link.

**Body**
```json
{
  "slug": "abtest",
  "description": "AB test description",
  "variations": [
    { "name": "V1", "redirect": "https://example.com/v1" },
    { "name": "v2", "redirect": "https://example.com/v2" }
  ]
}
```

### POST /links/calendar
Create a calendar link (event series managed in `calendar` table).

**Body**
```json
{
  "slug": "webinar",
  "description": "Webinar series",
  "event" : {
    "name" : "Team Sync Meeting",
    "location" : "https://example.com",
    "start_date" : "2025-09-01T14:00:00Z",
    "end_date" : "2025-09-01T16:00:00Z",
    "description" : "Event Detaisl, what to expect list etc",
    "recurrence" : true,
    "frequency" : "Daily", // options Daily, Weekly or Monthly
    "rinterval" : 2, // Repeat Interval 2 means every second day or every second month
    "rcount" : 1, // How many times you it needs to repeat x times.
  }
}
```

---

## Public Redirects

### GET /:slug
Resolves a link and issues **one 302** to the final URL.

### GET /ab/:slug
A/B redirect route (kept for learning/debug).

### GET /c/:t/:slug
Calendar redirect / ICS.
- `t=g` Google
- `t=y` Yahoo
- `t=o` Outlook
- `t=d` **Download ICS** (includes RRULE if present)
