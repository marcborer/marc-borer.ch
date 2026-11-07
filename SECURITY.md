# Security

## Reporting a vulnerability

Email **mb@marc-borer.ch** with "Security" in the subject. Please don't open a public issue for it. German or English.

Please include:

- the URL or file affected
- what an attacker could do, and how to reproduce it
- your name or handle, if you would like to be credited

Please keep the issue private until it is fixed.

## Scope

In scope:

- the website [marc-borer.ch](https://marc-borer.ch), a static site served by Cloudflare Workers
- its response headers (`public/_headers`: Content-Security-Policy, HSTS, caching)
- this repository, its build (`scripts/`) and its GitHub Actions workflow

Out of scope:

- **Attestree**: report to security@attestree.com, as listed in [attestree.com/.well-known/security.txt](https://attestree.com/.well-known/security.txt)
- the platforms the site runs on (Cloudflare, GitHub): report to them directly
- missing best-practice headers, or reports from automated scanners, without a concrete way to exploit them
- denial-of-service and social-engineering attacks

The same contact is published at [marc-borer.ch/.well-known/security.txt](https://marc-borer.ch/.well-known/security.txt) (RFC 9116).
