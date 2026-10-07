from app.models.listing import Listing
from app.utils.listing_slug import next_unique_slug, slugify_title


def test_slugify_title_normalizes_and_trims():
    assert slugify_title("  Beach Front   Villa!!  ") == "beach-front-villa"


def test_next_unique_slug_first_listing_gets_base(db, host_user):
    listing = Listing(
        host_id=host_user.id,
        title="Mountain Cabin",
        description="Test",
        property_type="Cabin",
        country="India",
        state="Himachal Pradesh",
        city="Manali",
        address="1 Ridge",
        latitude=32.0,
        longitude=77.0,
        price_per_night=4000,
        cleaning_fee=0,
        max_guests=2,
        bedrooms=1,
        beds=1,
        bathrooms=1,
    )
    db.add(listing)
    db.commit()
    assert listing.slug == "mountain-cabin"


def test_next_unique_slug_duplicate_gets_numeric_suffix(db, host_user):
    for title in ("Dup Home", "Dup Home"):
        db.add(
            Listing(
                host_id=host_user.id,
                title=title,
                description="Test",
                property_type="Apartment",
                country="India",
                state="Karnataka",
                city="Bengaluru",
                address="2 MG Road",
                latitude=12.97,
                longitude=77.59,
                price_per_night=2000,
                cleaning_fee=0,
                max_guests=2,
                bedrooms=1,
                beds=1,
                bathrooms=1,
            )
        )
        db.commit()
    from sqlalchemy import select

    slugs = db.scalars(select(Listing.slug).where(Listing.title == "Dup Home")).all()
    assert set(slugs) == {"dup-home", "dup-home-2"}
