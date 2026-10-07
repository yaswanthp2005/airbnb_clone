from __future__ import annotations

"""Seed constants (demo credentials documented in repo README)."""

DEMO_PASSWORD = "Demo@12345"
DEMO_GUEST_EMAIL = "guest@demo.in"

SEED_PHOTO_URLS: tuple[str, ...] = (
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
)

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
