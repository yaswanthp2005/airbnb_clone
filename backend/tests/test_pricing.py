from app.services.pricing import quote_stay


def test_quote_stay_totals_and_service_fee():
    quote = quote_stay(nightly_price=3000, cleaning_fee=500, nights=3)
    assert quote.nights == 3
    assert quote.lodging_total == 9000
    assert quote.service_fee == int(round((9000 + 500) * 0.12))
    assert quote.total == quote.lodging_total + quote.cleaning_fee + quote.service_fee


def test_quote_stay_single_night():
    quote = quote_stay(nightly_price=1000, cleaning_fee=0, nights=1)
    assert quote.lodging_total == 1000
    assert quote.service_fee == 120
    assert quote.total == 1120
