from __future__ import annotations

from dataclasses import dataclass
from decimal import ROUND_HALF_UP, Decimal

# Mirrors `SERVICE_FEE_RATE` / `calculatePriceBreakdown` in the frontend.
SERVICE_FEE_RATE = Decimal("0.12")


@dataclass(frozen=True)
class PriceQuote:
    nights: int
    nightly_price: int
    lodging_total: int
    cleaning_fee: int
    service_fee: int
    total: int


def quote_stay(nightly_price: int, cleaning_fee: int, nights: int) -> PriceQuote:
    """nights × nightly price + cleaning fee + service fee on that subtotal (INR, whole rupees)."""
    lodging_total = nightly_price * nights
    service_fee = int(
        (Decimal(lodging_total + cleaning_fee) * SERVICE_FEE_RATE).quantize(
            Decimal("1"), ROUND_HALF_UP
        )
    )
    return PriceQuote(
        nights=nights,
        nightly_price=nightly_price,
        lodging_total=lodging_total,
        cleaning_fee=cleaning_fee,
        service_fee=service_fee,
        total=lodging_total + cleaning_fee + service_fee,
    )
