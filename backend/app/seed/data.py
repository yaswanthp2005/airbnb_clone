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
    listing_count: int


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
    CitySeed("Goa", "Goa", 15.2993, 74.1240, 4),
    CitySeed("Jaipur", "Rajasthan", 26.9124, 75.7873, 4),
    CitySeed("Udaipur", "Rajasthan", 24.5854, 73.7125, 3),
    CitySeed("Mumbai", "Maharashtra", 19.0760, 72.8777, 4),
    CitySeed("Bengaluru", "Karnataka", 12.9716, 77.5946, 4),
    CitySeed("Manali", "Himachal Pradesh", 32.2396, 77.1887, 3),
    CitySeed("Kochi", "Kerala", 9.9312, 76.2673, 3),
    CitySeed("Delhi", "Delhi", 28.6139, 77.2090, 3),
    CitySeed("Rishikesh", "Uttarakhand", 30.0869, 78.2676, 3),
    CitySeed("Pondicherry", "Puducherry", 11.9416, 79.8083, 3),
    CitySeed("Darjeeling", "West Bengal", 27.0410, 88.2663, 2),
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
)
