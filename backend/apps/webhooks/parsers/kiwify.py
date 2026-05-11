"""
Kiwify webhook payload parser.

Kiwify sends events for abandoned carts, unpaid Pix, and unpaid Boleto.
Expected payload fields vary by event type. We normalize to Lead fields.
"""


def parse(payload: dict) -> dict | None:
    """
    Returns a dict of Lead fields or None if the event should be ignored.
    """
    event = payload.get('order_status') or payload.get('event_type', '')

    # Events we act on
    actionable = {
        'waiting_payment',
        'abandoned_cart',
        'pix_expired',
        'boleto_expired',
    }
    if event not in actionable:
        return None

    abandon_map = {
        'waiting_payment': 'pix',
        'pix_expired': 'pix',
        'boleto_expired': 'boleto',
        'abandoned_cart': 'cart',
    }

    customer = payload.get('Customer', {})
    product = payload.get('Product', {})
    order = payload.get('Order', payload)

    phone_raw = customer.get('mobile', '') or customer.get('phone', '')
    import re
    phone_digits = re.sub(r'\D', '', phone_raw)
    phone = f'+{phone_digits}' if phone_digits else ''

    return {
        'name': customer.get('full_name', 'Desconhecido'),
        'phone': phone,
        'email': customer.get('email', ''),
        'product_name': product.get('name', order.get('product_name', '')),
        'value': float(order.get('amount', 0)) / 100,
        'abandon_type': abandon_map.get(event, 'cart'),
        'origin': 'kiwify',
    }
