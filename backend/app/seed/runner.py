from __future__ import annotations

import random
from datetime import date, datetime, time, timedelta, timezone
from decimal import Decimal
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models import (
    Amenity,
    Booking,
    Listing,
    ListingAmenity,
    ListingPhoto,
    Review,
    User,
    WishlistItem,
)
from app.seed.constants import (
    AMENITY_DEFINITIONS,
    DEMO_PASSWORD,
    PROPERTY_TYPES,
    REVIEW_COMMENTS,
    SEED_PHOTO_URLS,
)
from app.seed.data import CITY_SEEDS, SEED_USERS
from app.services.pricing import quote_stay

REVIEW_POSTED_HOUR = 10
RNG = random.Random(42)


def _booking_total(nightly_price: int, nights: int, cleaning_fee: int) -> tuple[int, int, int]:
    quote = quote_stay(nightly_price, cleaning_fee, nights)
    return quote.service_fee, quote.total, quote.lodging_total


def _years_ago(moment: datetime, years: int) -> datetime:
    try:
        return moment.replace(year=moment.year - years)
    except ValueError:  # 29 Feb in a non-leap target year
        return moment.replace(year=moment.year - years, day=28)


def _listing_description(
    property_type: str, city: str, state: str, host_first_name: str, bedrooms: int, max_guests: int
) -> str:
    article = "an" if property_type[0].lower() in "aeiou" else "a"
    return "\n\n".join(
        (
            f"Stay in {article} {property_type.lower()} hosted by {host_first_name} in {city}, {state}. "
            f"Enjoy Indian hospitality with modern comforts, great for families and small groups.",
            f"The space\n{bedrooms} bedroom(s) with fresh linen, a bright living area and a "
            f"well-stocked kitchen for home-cooked meals. Sleeps up to {max_guests} guests.",
            "Guest access\nThe whole place is yours, including the outdoor seating area. "
            "Self check-in with a smart lock, any time after 2 pm.",
            f"Other things to note\nThe neighbourhood is quiet after 10 pm. Local markets, "
            f"cafés and the best of {city} are a short drive away; {host_first_name} is happy "
            f"to share recommendations.",
        )
    )


def run_seed(db: Session) -> None:
    existing_users = db.scalar(select(func.count()).select_from(User))
    if existing_users and existing_users > 0:
        return

    password_hash = hash_password(DEMO_PASSWORD)
    users_by_email: dict[str, User] = {}

    for seed_user in SEED_USERS:
        user = User(
            name=seed_user.name,
            email=seed_user.email,
            password_hash=password_hash,
            avatar_url=seed_user.avatar_url,
            bio=seed_user.bio,
            created_at=_years_ago(datetime.now(timezone.utc), seed_user.joined_years_ago),
        )
        db.add(user)
        users_by_email[seed_user.email] = user

    db.flush()

    hosts = [users_by_email[u.email] for u in SEED_USERS if u.is_host]
    guests = [users_by_email[u.email] for u in SEED_USERS if not u.is_host]
    demo_guest = users_by_email["guest@demo.in"]
    booking_guests = [g for g in guests if g.id != demo_guest.id]

    amenities: list[Amenity] = []
    for name, icon in AMENITY_DEFINITIONS:
        amenity = Amenity(name=name, icon=icon)
        db.add(amenity)
        amenities.append(amenity)
    db.flush()

    listings: list[Listing] = []
    listing_index = 0
    for city_seed in CITY_SEEDS:
        for local_idx in range(city_seed.listing_count):
            property_type = PROPERTY_TYPES[listing_index % len(PROPERTY_TYPES)]
            host = hosts[listing_index % len(hosts)]
            price = RNG.randint(15, 500) * 100  # ₹1,500 – ₹50,000 in steps; cap at 25000
            price = min(price, 25000)
            price = max(price, 1500)
            cleaning = RNG.choice([0, 500, 750, 1000, 1500])
            lat_jitter = RNG.uniform(-0.08, 0.08)
            lng_jitter = RNG.uniform(-0.08, 0.08)
            bedrooms = RNG.randint(1, 4)
            beds = max(bedrooms, RNG.randint(1, 5))
            bathrooms = RNG.randint(1, 3)
            max_guests = RNG.randint(2, 10)

            title = f"{property_type} in {city_seed.city} — {local_idx + 1}"
            description = _listing_description(
                property_type,
                city_seed.city,
                city_seed.state,
                host.name.split()[0],
                bedrooms,
                max_guests,
            )

            listing = Listing(
                host_id=host.id,
                title=title,
                description=description,
                property_type=property_type,
                country="India",
                state=city_seed.state,
                city=city_seed.city,
                address=f"{RNG.randint(1, 120)} {city_seed.city} Heritage Lane",
                latitude=round(city_seed.latitude + lat_jitter, 6),
                longitude=round(city_seed.longitude + lng_jitter, 6),
                price_per_night=price,
                cleaning_fee=cleaning,
                max_guests=max_guests,
                bedrooms=bedrooms,
                beds=beds,
                bathrooms=bathrooms,
                rating_avg=Decimal("0.00"),
                review_count=0,
            )
            db.add(listing)
            db.flush()

            for position, url in enumerate(SEED_PHOTO_URLS):
                db.add(
                    ListingPhoto(listing_id=listing.id, url=url, position=position)
                )

            amenity_count = RNG.randint(8, 12)
            chosen_amenities = RNG.sample(amenities, k=amenity_count)
            for amenity in chosen_amenities:
                db.add(
                    ListingAmenity(listing_id=listing.id, amenity_id=amenity.id)
                )

            listings.append(listing)
            listing_index += 1

    db.flush()

    today = date.today()

    for idx, listing in enumerate(listings):
        review_count = RNG.randint(4, 12)
        ratings: list[int] = []

        for review_idx in range(review_count):
            guest = booking_guests[review_idx % len(booking_guests)]
            nights = RNG.randint(2, 6)
            check_in = today - timedelta(days=RNG.randint(30, 400))
            check_out = check_in + timedelta(days=nights)
            service_fee, total_price, _ = _booking_total(
                listing.price_per_night, nights, listing.cleaning_fee
            )

            booking = Booking(
                listing_id=listing.id,
                guest_id=guest.id,
                check_in=check_in,
                check_out=check_out,
                guests=min(listing.max_guests, RNG.randint(1, 4)),
                nightly_price=listing.price_per_night,
                cleaning_fee=listing.cleaning_fee,
                service_fee=service_fee,
                total_price=total_price,
                status="confirmed",
            )
            db.add(booking)
            db.flush()

            rating = RNG.choices(
                population=[3, 4, 4, 4, 5, 5, 5],
                k=1,
            )[0]
            ratings.append(rating)

            db.add(
                Review(
                    listing_id=listing.id,
                    booking_id=booking.id,
                    guest_id=guest.id,
                    rating=rating,
                    comment=REVIEW_COMMENTS[(idx + review_idx) % len(REVIEW_COMMENTS)],
                    created_at=datetime.combine(
                        check_out + timedelta(days=1),
                        time(REVIEW_POSTED_HOUR),
                        tzinfo=timezone.utc,
                    ),
                )
            )
        if ratings:
            listing.review_count = len(ratings)
            listing.rating_avg = Decimal(str(round(sum(ratings) / len(ratings), 2)))

        if idx == 0:
            nights = 3
            check_in = today - timedelta(days=20)
            check_out = check_in + timedelta(days=nights)
            service_fee, total_price, _ = _booking_total(
                listing.price_per_night, nights, listing.cleaning_fee
            )
            db.add(
                Booking(
                listing_id=listing.id,
                guest_id=demo_guest.id,
                check_in=check_in,
                check_out=check_out,
                guests=2,
                nightly_price=listing.price_per_night,
                cleaning_fee=listing.cleaning_fee,
                service_fee=service_fee,
                total_price=total_price,
                status="confirmed",
                )
            )

        if idx < 8:
            nights = RNG.randint(2, 5)
            check_in = today + timedelta(days=RNG.randint(7, 90))
            check_out = check_in + timedelta(days=nights)
            guest = booking_guests[idx % len(booking_guests)]
            service_fee, total_price, _ = _booking_total(
                listing.price_per_night, nights, listing.cleaning_fee
            )
            db.add(
                Booking(
                    listing_id=listing.id,
                    guest_id=guest.id,
                    check_in=check_in,
                    check_out=check_out,
                    guests=min(listing.max_guests, RNG.randint(1, 3)),
                    nightly_price=listing.price_per_night,
                    cleaning_fee=listing.cleaning_fee,
                    service_fee=service_fee,
                    total_price=total_price,
                    status="confirmed",
                )
            )

        if idx % 5 == 0:
            nights = RNG.randint(1, 4)
            check_in = today - timedelta(days=RNG.randint(5, 25))
            check_out = check_in + timedelta(days=nights)
            if check_out >= today:
                check_out = today - timedelta(days=1)
                check_in = check_out - timedelta(days=nights)
            guest = booking_guests[(idx + 1) % len(booking_guests)]
            service_fee, total_price, _ = _booking_total(
                listing.price_per_night, nights, listing.cleaning_fee
            )
            db.add(
                Booking(
                    listing_id=listing.id,
                    guest_id=guest.id,
                    check_in=check_in,
                    check_out=check_out,
                    guests=2,
                    nightly_price=listing.price_per_night,
                    cleaning_fee=listing.cleaning_fee,
                    service_fee=service_fee,
                    total_price=total_price,
                    status="cancelled" if idx % 10 == 0 else "confirmed",
                )
            )

    for guest_idx, guest in enumerate(guests):
        sample_listings = RNG.sample(listings, k=6)
        for listing in sample_listings:
            db.add(WishlistItem(user_id=guest.id, listing_id=listing.id))

    db.commit()
