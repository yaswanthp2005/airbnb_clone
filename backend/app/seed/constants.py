from __future__ import annotations

"""Seed constants (demo credentials documented in repo README)."""

DEMO_PASSWORD = "Demo@12345"
DEMO_GUEST_EMAIL = "guest@demo.in"


def unsplash_url(photo_id: str) -> str:
    return f"https://images.unsplash.com/photo-{photo_id}?w=1200&q=80"


# Each listing gets 6–8 photos from its type's set, rotated so listings of the same type lead with
# different photos. Sets must not share photos, so every type's "Browse by type" cover is distinct.
PROPERTY_TYPE_PHOTO_IDS: dict[str, tuple[str, ...]] = {
    "Villa": (
        "1613977257365-aaae5a9817ff",
        "1596178067639-5c6e68aea6dc",
        "1594479125841-ff7800c6afcc",
        "1544984243-ec57ea16fe25",
        "1670589953903-b4e2f17a70a9",
        "1512917774080-9991f1c4c750",
        "1675657144361-98ae33e6b6f9",
        "1543489822-c49534f3271f",
        "1613553474179-e1eda3ea5734",
        "1661069543196-9712dc126a91",
    ),
    "Apartment": (
        "1522708323590-d24dbb6b0267",
        "1628592102751-ba83b0314276",
        "1589834390005-5d4fb9bf3d32",
        "1560448204-e02f11c3d0e2",
        "1502672260266-1c1ef2d93688",
        "1613575831056-0acd5da8f085",
        "1733547369416-75eb36fb8437",
        "1665249934445-1de680641f50",
        "1757924461488-ef9ad0670978",
        "1689043528099-2ba014dd7c64",
    ),
    "Cabin": (
        "1510798831971-661eb04b3739",
        "1475087542963-13ab5e611954",
        "1595521624992-48a59aef95e3",
        "1688184510272-d287551e2b73",
        "1575403071235-5dcd06cbf169",
        "1610486870542-70d0062d150f",
        "1570793005386-840846445fed",
        "1680703486830-1b5af60635d7",
        "1631756964162-25c8c07579b5",
        "1664369058082-ee8e36028106",
    ),
    "Houseboat": (
        "1602216056096-3b40cc0c9944",
        "1755547944443-3bb7114e2b1f",
        "1609828913552-f9138ed9e42d",
        "1689151945034-5b654586b628",
        "1661174607003-d9d36388c916",
        "1593693411515-c20261bcad6e",
        "1593693401060-9fc28cf9e368",
        "1634141693341-9d51836aa188",
        "1720445821834-1db9c765cb82",
        "1593693397690-362cb9666fc2",
    ),
    "Treehouse": (
        "1550934482-7904d33d1b54",
        "1618767689160-da3fb810aad7",
        "1604004218771-05c55db4f9f4",
        "1587913696806-280ef35f1e19",
        "1709869837747-cd22da367fdb",
        "1663788923461-f8e7112a3540",
        "1633830902223-727413dfad8f",
        "1763300855109-c04633f07cab",
        "1761782797823-2b555af8a226",
        "1761798607954-5ca1646afebe",
    ),
    "Beachfront": (
        "1499793983690-e29da59ef1c2",
        "1517541866997-ea18e32ea9e9",
        "1721369483526-62f48a00b949",
        "1595832880577-a84565468640",
        "1528913775512-624d24b27b96",
        "1604348825621-22800b6ed16d",
        "1544442540-68589bbc2b5d",
        "1598924957326-0446ac30341e",
        "1612448962608-ab2d7a969987",
        "1628214457196-676766da086e",
    ),
    "Farmhouse": (
        "1720631882065-ec1329796714",
        "1592212671488-700bb9a101e1",
        "1596753365498-2d23bbfcbc24",
        "1600210491892-03d54c0aaf87",
        "1714402582129-7c363203367e",
        "1444858291040-58f756a3bdd6",
        "1517817500400-c961b0488325",
        "1600493505371-f2f6153dbb29",
        "1754415266974-404a215e6c62",
        "1623195372033-cef888fd5a42",
    ),
    "Heritage haveli": (
        "1629725053305-9bb7886f9545",
        "1682414181897-b2369acbb3c8",
        "1682414181248-8b0d51289e88",
        "1682414181819-7e02418135a4",
        "1582998451055-5ce52763e246",
        "1682414181308-400ec8176833",
        "1682414180825-c0df1934387f",
        "1682414181847-fdc2db29d315",
        "1630986431591-67c879f930e1",
        "1682414181306-989d16258984",
    ),
    "Camping": (
        "1657903567141-c3d4aa36c8f8",
        "1714326029322-fcc1464df757",
        "1632367294096-4e77d53c4ae9",
        "1731082627921-77d00a9e5ab7",
        "1657903567170-1781df4fa6cb",
        "1504280390367-361c6d9f38f4",
        "1510312305653-8ed496efae75",
        "1537905569824-f89f14cceb68",
        "1628087235616-4e146afcd061",
        "1633805159007-8e198bbcc931",
    ),
    "Cottage": (
        "1598228723793-52759bba239c",
        "1604601638406-edc29b54dcf7",
        "1590354893781-90ed27ce7ce9",
        "1587913560680-7f8187bf9634",
        "1611602132416-da2045990f76",
        "1588880331179-bc9b93a8cb5e",
        "1480074568708-e7b720bb3f09",
        "1595877244574-e90ce41ce089",
        "1509764986935-841accffc894",
        "1593195150568-34b786c41b91",
    ),
    "Bungalow": (
        "1654535095187-769ba364ad7a",
        "1642667670006-6b3059ccf96d",
        "1595688411274-81540916dbe6",
        "1635572915609-652975f7f7a8",
        "1711114378455-b1f479d94a19",
        "1571168538867-ad36fe110cc4",
        "1653569511862-8a0320ae66cc",
        "1631566768468-1857b2aaac03",
        "1744311971549-9c529b60b98a",
        "1610569244414-5e7453a447a8",
    ),
    "Loft": (
        "1505873242700-f289a29e1e0f",
        "1619989753008-0191bbaf23a6",
        "1783990349147-906f62b882c1",
        "1560440021-33f9b867899d",
        "1738748444659-f8975b12ce57",
        "1617817643768-8855fc457e3a",
        "1619989652700-9984844cb0ea",
        "1507149833265-60c372daea22",
        "1592928302636-c83cf1e1c887",
        "1668438712649-ffd85f756de5",
    ),
    "Tiny home": (
        "1668015642451-a3bb11afb441",
        "1692897990597-66575345d11f",
        "1626290131022-4e5a5e167173",
        "1605272058466-5988743ff1db",
        "1595525101922-d7febbdd796d",
        "1697462247934-47afc5541494",
        "1541004995602-b3e898709909",
        "1734599505101-66d53bd36927",
        "1759398430338-8057876edf61",
        "1780884864607-8601237e4b22",
    ),
    "Dome": (
        "1756441891002-40cc3c276d4b",
        "1778996370429-83a5d1e13ef8",
        "1774013710036-982f187dfe38",
        "1778996370088-0cd89fce96c1",
        "1783696521772-e3ba2c4ef0b5",
        "1760687618915-74b499fa5c30",
        "1676776292778-2ad713ec39f3",
        "1641569618527-68e26db76db0",
        "1676776293065-491f727ca415",
        "1676776293236-f37e51cf1c3c",
    ),
    "Palace": (
        "1589352254486-4e1587272ea4",
        "1524228529766-4d7fe5dc55ca",
        "1523544261025-3159599b1fc3",
        "1622194162759-fe017668971b",
        "1659126574791-13313aa424bd",
        "1665376620694-fc0c4bab7294",
        "1655516433028-9e0e1599cf8b",
        "1642675742313-35f2ebad5018",
        "1665910690884-e33a1ffb7bf9",
        "1599778022144-a35ed12f24a1",
    ),
}


LISTING_PHOTO_COUNT_RANGE = (6, 8)


def property_type_photo_urls(property_type: str, rotation: int, count: int) -> list[str]:
    photo_ids = PROPERTY_TYPE_PHOTO_IDS[property_type]
    start = rotation % len(photo_ids)
    rotated = photo_ids[start:] + photo_ids[:start]
    return [unsplash_url(photo_id) for photo_id in rotated[:count]]


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

# Amenities that only make sense in some places, so each search shows its own set.
COAST_AMENITIES = frozenset({"Sea view", "Beach access"})
HILL_AMENITIES = frozenset({"Mountain view", "Fireplace"})
BUILDING_AMENITIES = frozenset({"Elevator", "Gym"})
BUILDING_PROPERTY_TYPES = frozenset({"Apartment", "Loft", "Palace"})
LISTING_AMENITY_COUNT_RANGE = (8, 12)

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
