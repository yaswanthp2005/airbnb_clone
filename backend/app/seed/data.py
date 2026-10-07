from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class SeedUser:
    name: str
    email: str
    is_host: bool
    avatar_url: str
    bio: str
    joined_years_ago: int


@dataclass(frozen=True)
class CitySeed:
    city: str
    state: str
    latitude: float
    longitude: float
    # One listing per entry, in this order.
    property_types: tuple[str, ...]


@dataclass(frozen=True)
class DestinationSeed:
    city: str
    state: str
    tagline: str
    photo_id: str


SEED_USERS: tuple[SeedUser, ...] = (
    SeedUser(
        name="Arjun Mehta",
        email="arjun.host@demo.in",
        is_host=True,
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
        bio="Goa-born host sharing coastal homes and city apartments across western India.",
        joined_years_ago=6,
    ),
    SeedUser(
        name="Priya Sharma",
        email="priya.host@demo.in",
        is_host=True,
        avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        bio="Heritage stays in Rajasthan and curated boutique listings for slow travel.",
        joined_years_ago=4,
    ),
    SeedUser(
        name="Vikram Singh",
        email="vikram.host@demo.in",
        is_host=True,
        avatar_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
        bio="Mountain cabins, farm stays, and adventure bases in the Himalayas and hills.",
        joined_years_ago=3,
    ),
    SeedUser(
        name="Ananya Iyer",
        email="ananya.guest@demo.in",
        is_host=False,
        avatar_url="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
        bio="Food blogger exploring homestays across South India.",
        joined_years_ago=2,
    ),
    SeedUser(
        name="Rohit Khanna",
        email="rohit.guest@demo.in",
        is_host=False,
        avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
        bio="Weekend traveller from Delhi; loves heritage havelis and houseboats.",
        joined_years_ago=3,
    ),
    SeedUser(
        name="Demo Guest",
        email="guest@demo.in",
        is_host=False,
        avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
        bio="Default demo account for trying bookings and reviews.",
        joined_years_ago=1,
    ),
)

CITY_SEEDS: tuple[CitySeed, ...] = (
    CitySeed(
        "Goa", "Goa", 15.2993, 74.1240,
        ("Beachfront", "Villa", "Apartment", "Bungalow", "Cottage", "Loft", "Treehouse", "Dome"),
    ),
    CitySeed(
        "Jaipur", "Rajasthan", 26.9124, 75.7873,
        ("Heritage haveli", "Palace", "Villa", "Apartment", "Farmhouse", "Camping", "Bungalow", "Loft"),
    ),
    CitySeed(
        "Udaipur", "Rajasthan", 24.5854, 73.7125,
        ("Palace", "Heritage haveli", "Villa", "Houseboat", "Apartment", "Cottage", "Bungalow", "Farmhouse"),
    ),
    CitySeed(
        "Mumbai", "Maharashtra", 19.0760, 72.8777,
        ("Apartment", "Loft", "Beachfront", "Villa", "Bungalow", "Tiny home", "Houseboat", "Cottage"),
    ),
    CitySeed(
        "Bengaluru", "Karnataka", 12.9716, 77.5946,
        ("Apartment", "Loft", "Villa", "Bungalow", "Farmhouse", "Tiny home", "Cottage", "Treehouse"),
    ),
    CitySeed(
        "Manali", "Himachal Pradesh", 32.2396, 77.1887,
        ("Cabin", "Cottage", "Treehouse", "Camping", "Dome", "Tiny home", "Farmhouse", "Villa"),
    ),
    CitySeed(
        "Kochi", "Kerala", 9.9312, 76.2673,
        ("Houseboat", "Beachfront", "Villa", "Bungalow", "Heritage haveli", "Apartment", "Cottage", "Treehouse"),
    ),
    CitySeed(
        "Delhi", "Delhi", 28.6139, 77.2090,
        ("Apartment", "Loft", "Heritage haveli", "Villa", "Farmhouse", "Bungalow", "Palace", "Tiny home"),
    ),
    CitySeed(
        "Rishikesh", "Uttarakhand", 30.0869, 78.2676,
        ("Camping", "Cottage", "Treehouse", "Dome", "Cabin", "Farmhouse", "Tiny home", "Villa"),
    ),
    CitySeed(
        "Pondicherry", "Puducherry", 11.9416, 79.8083,
        ("Beachfront", "Villa", "Heritage haveli", "Bungalow", "Apartment", "Cottage", "Loft", "Dome"),
    ),
    CitySeed(
        "Darjeeling", "West Bengal", 27.0410, 88.2663,
        ("Cottage", "Cabin", "Bungalow", "Heritage haveli", "Farmhouse", "Tiny home", "Camping", "Treehouse"),
    ),
    CitySeed(
        "Shimla", "Himachal Pradesh", 31.1048, 77.1734,
        ("Cottage", "Cabin", "Bungalow", "Heritage haveli", "Apartment", "Villa", "Dome", "Camping"),
    ),
    CitySeed(
        "Ooty", "Tamil Nadu", 11.4102, 76.6950,
        ("Cottage", "Bungalow", "Farmhouse", "Cabin", "Treehouse", "Villa", "Tiny home", "Dome"),
    ),
    CitySeed(
        "Munnar", "Kerala", 10.0889, 77.0595,
        ("Treehouse", "Cottage", "Farmhouse", "Camping", "Dome", "Cabin", "Villa", "Bungalow"),
    ),
    CitySeed(
        "Coorg", "Karnataka", 12.4244, 75.7382,
        ("Farmhouse", "Cottage", "Treehouse", "Bungalow", "Villa", "Camping", "Tiny home", "Dome"),
    ),
    CitySeed(
        "Varanasi", "Uttar Pradesh", 25.3176, 82.9739,
        ("Heritage haveli", "Houseboat", "Apartment", "Palace", "Bungalow", "Loft", "Cottage", "Villa"),
    ),
    CitySeed(
        "Agra", "Uttar Pradesh", 27.1767, 78.0081,
        ("Heritage haveli", "Palace", "Apartment", "Villa", "Bungalow", "Farmhouse", "Loft", "Cottage"),
    ),
    CitySeed(
        "Hyderabad", "Telangana", 17.3850, 78.4867,
        ("Apartment", "Loft", "Palace", "Villa", "Bungalow", "Farmhouse", "Heritage haveli", "Tiny home"),
    ),
    CitySeed(
        "Leh", "Ladakh", 34.1526, 77.5771,
        ("Camping", "Dome", "Cottage", "Cabin", "Tiny home", "Heritage haveli", "Farmhouse", "Bungalow"),
    ),
)

# Home page "Destinations for you", in display order.
DESTINATION_SEEDS: tuple[DestinationSeed, ...] = (
    DestinationSeed("Goa", "Goa", "For beach lovers", "1582972236019-ea4af5ffe587"),
    DestinationSeed("Jaipur", "Rajasthan", "Top destination", "1524230507669-5ff97982bb5e"),
    DestinationSeed("Mumbai", "Maharashtra", "For city lovers", "1595658658481-d53d3f999875"),
    DestinationSeed("Bengaluru", "Karnataka", "For café hopping", "1596176530529-78163a4f7af2"),
    DestinationSeed("Udaipur", "Rajasthan", "For lakeside palaces", "1589901164570-f9de6556e1c1"),
    DestinationSeed("Manali", "Himachal Pradesh", "For nature lovers", "1597167231350-d057a45dc868"),
    DestinationSeed("Kochi", "Kerala", "For backwaters and seafood", "1645680149311-5a00ae5a2b2a"),
    DestinationSeed("Delhi", "Delhi", "For history buffs", "1587474260584-136574528ed5"),
    DestinationSeed("Rishikesh", "Uttarakhand", "For yoga and rafting", "1712510817140-917938f92e5b"),
    DestinationSeed("Pondicherry", "Puducherry", "For French Quarter charm", "1569157087866-f4a8e9250605"),
    DestinationSeed("Darjeeling", "West Bengal", "For tea gardens and views", "1545324367-8997ba3b801e"),
    DestinationSeed("Shimla", "Himachal Pradesh", "For colonial hill charm", "1597074866923-dc0589150358"),
    DestinationSeed("Ooty", "Tamil Nadu", "For toy trains and misty hills", "1707655315272-33a54a771068"),
    DestinationSeed("Munnar", "Kerala", "For tea plantations", "1491497895121-1334fc14d8c9"),
    DestinationSeed("Coorg", "Karnataka", "For coffee estates", "1710612198146-77512950a4b7"),
    DestinationSeed("Varanasi", "Uttar Pradesh", "For ghats and Ganga aarti", "1561359313-0639aad49ca6"),
    DestinationSeed("Agra", "Uttar Pradesh", "For the Taj Mahal", "1564507592333-c60657eea523"),
    DestinationSeed("Hyderabad", "Telangana", "For biryani and heritage", "1696941515998-d83f24967aca"),
    DestinationSeed("Leh", "Ladakh", "For high-altitude adventures", "1619837374214-f5b9eb80876d"),
)
