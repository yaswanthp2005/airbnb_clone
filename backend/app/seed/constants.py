from __future__ import annotations

"""Seed constants (demo credentials documented in repo README)."""

DEMO_PASSWORD = "Demo@12345"
DEMO_GUEST_EMAIL = "guest@demo.in"


def unsplash_url(photo_id: str) -> str:
    return f"https://images.unsplash.com/photo-{photo_id}?w=1200&q=80"


# Each listing gets its type's set, rotated so listings of the same type lead with different photos.
PROPERTY_TYPE_PHOTO_IDS: dict[str, tuple[str, ...]] = {
    "Villa": (
        "1613977257365-aaae5a9817ff",
        "1596178067639-5c6e68aea6dc",
        "1594479125841-ff7800c6afcc",
        "1544984243-ec57ea16fe25",
        "1670589953903-b4e2f17a70a9",
    ),
    "Apartment": (
        "1522708323590-d24dbb6b0267",
        "1628592102751-ba83b0314276",
        "1589834390005-5d4fb9bf3d32",
        "1560448204-e02f11c3d0e2",
        "1502672260266-1c1ef2d93688",
    ),
    "Cabin": (
        "1510798831971-661eb04b3739",
        "1475087542963-13ab5e611954",
        "1595521624992-48a59aef95e3",
        "1688184510272-d287551e2b73",
        "1575403071235-5dcd06cbf169",
    ),
    "Houseboat": (
        "1602216056096-3b40cc0c9944",
        "1755547944443-3bb7114e2b1f",
        "1609828913552-f9138ed9e42d",
        "1689151945034-5b654586b628",
        "1661174607003-d9d36388c916",
    ),
    "Treehouse": (
        "1550934482-7904d33d1b54",
        "1618767689160-da3fb810aad7",
        "1604004218771-05c55db4f9f4",
        "1587913696806-280ef35f1e19",
        "1709869837747-cd22da367fdb",
    ),
    "Beachfront": (
        "1499793983690-e29da59ef1c2",
        "1517541866997-ea18e32ea9e9",
        "1721369483526-62f48a00b949",
        "1595832880577-a84565468640",
        "1528913775512-624d24b27b96",
    ),
    "Farmhouse": (
        "1720631882065-ec1329796714",
        "1592212671488-700bb9a101e1",
        "1596753365498-2d23bbfcbc24",
        "1600210491892-03d54c0aaf87",
        "1714402582129-7c363203367e",
    ),
    "Heritage haveli": (
        "1629725053305-9bb7886f9545",
        "1682414181897-b2369acbb3c8",
        "1682414181248-8b0d51289e88",
        "1682414181819-7e02418135a4",
        "1582998451055-5ce52763e246",
    ),
    "Camping": (
        "1657903567141-c3d4aa36c8f8",
        "1714326029322-fcc1464df757",
        "1632367294096-4e77d53c4ae9",
        "1676776292778-2ad713ec39f3",
        "1641569618527-68e26db76db0",
    ),
}


def property_type_photo_urls(property_type: str, rotation: int) -> list[str]:
    photo_ids = PROPERTY_TYPE_PHOTO_IDS[property_type]
    start = rotation % len(photo_ids)
    return [unsplash_url(photo_id) for photo_id in photo_ids[start:] + photo_ids[:start]]

AMENITY_DEFINITIONS: tuple[tuple[str, str], ...] = (
    ("Wifi", "wifi"),
    ("Kitchen", "utensils"),
    ("Free parking", "car"),
    ("Air conditioning", "snowflake"),
    ("Washer", "shirt"),
    ("Dedicated workspace", "laptop"),
    ("TV", "tv"),
    ("Pool", "waves"),
    ("Hot tub", "bath"),
    ("BBQ grill", "flame"),
    ("Breakfast", "coffee"),
    ("Gym", "dumbbell"),
    ("Elevator", "arrow-up-down"),
    ("Sea view", "water"),
    ("Mountain view", "mountain"),
    ("Fireplace", "flame-kindling"),
    ("Pets allowed", "paw-print"),
    ("Smoking allowed", "cigarette"),
    ("Beach access", "umbrella"),
    ("Garden", "flower-2"),
)

REVIEW_COMMENTS: tuple[str, ...] = (
    "Wonderful stay — exactly as pictured. Host was very responsive.",
    "Great location and spotless rooms. Would book again.",
    "Perfect weekend getaway with family. Kids loved the pool.",
    "Calm neighbourhood and easy check-in. Highly recommend.",
    "Beautiful views and thoughtful amenities throughout.",
    "Comfortable beds and well-equipped kitchen.",
    "A memorable experience — authentic local hospitality.",
    "Good value for money; minor noise one evening only.",
    "Stunning interiors and peaceful mornings on the terrace.",
    "Host went out of their way to help with travel plans.",
    "Ideal base for exploring the city and nearby sights.",
    "Clean, stylish, and close to restaurants and markets.",
)
