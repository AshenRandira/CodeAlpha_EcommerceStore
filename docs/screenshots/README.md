# Screenshot Checklist

Store final submission screenshots in this folder.

Recommended screenshots:

1. Home page with the product listing
2. Product details page
3. Shopping cart
4. Checkout page
5. My Orders page
6. Order Details page
7. `docker compose ps` showing `web`, `api`, and `mongo` as healthy
8. Application running at `http://localhost:8080`
9. Docker logs or `docker stats --no-stream`

## Suggested File Names

```text
01-home-product-listing.png
02-product-details.png
03-cart.png
04-checkout.png
05-my-orders.png
06-order-details.png
07-docker-compose-healthy.png
08-localhost-8080.png
09-docker-monitoring.png
```

## Safety Rules

- Do not capture `server/.env`.
- Do not reveal passwords.
- Do not reveal JWT values.
- Do not reveal browser storage tokens.
- Do not reveal private email addresses unless using a dedicated test account.
- Keep terminal output focused on the project.
- Make sure the browser URL and important UI state are visible.
- Use consistent window sizing where practical.
