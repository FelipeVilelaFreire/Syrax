"""
Hotmart webhook payload parser.

Hotmart sends PURCHASE_* events. We care about PURCHASE_BILLET_PRINTED
(boleto generated, not paid) and PURCHASE_CANCELED / PURCHASE_CHARGEBACK
for cart-level abandonment.
"""


def parse(payload: dict) -> dict | None:
    """
    Returns a dict of Lead fields or None if the event should be ignored.
    """
    event = payload.get('event', '')

    actionable = {
        'PURCHASE_BILLET_PRINTED',
        'PURCHASE_CANCELED',
        'PURCHASE_PROTEST',
        'PURCHASE_CHARGEBACK',
    }
    if event not in actionable:
        return None

    abandon_map = {
        'PURCHASE_BILLET_PRINTED': 'boleto',
        'PURCHASE_CANCELED': 'cart',
        'PURCHASE_PROTEST': 'cart',
        'PURCHASE_CHARGEBACK': 'cart',
    }

    data = payload.get('data', {})
    buyer = data.get('buyer', {})
    product = data.get('product', {})
    purchase = data.get('purchase', {})

    phone_raw = buyer.get('checkout_phone', '') or buyer.get('phone', '')
    import re
    phone_digits = re.sub(r'\D', '', phone_raw)
    phone = f'+{phone_digits}' if phone_digits else ''

    price = purchase.get('original_offer_price', {})
    value = float(price.get('value', 0))

    return {
        'name': buyer.get('name', 'Desconhecido'),
        'phone': phone,
        'email': buyer.get('email', ''),
        'product_name': product.get('name', ''),
        'value': value,
        'abandon_type': abandon_map.get(event, 'cart'),
        'origin': 'hotmart',
    }
