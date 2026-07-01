# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: qa.spec.ts >> Vestitus QA — smoke tests >> Registro /register carga con inputs
- Location: e2e\qa.spec.ts:48:3

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 1
Received:    0
```

# Page snapshot

```yaml
- main [ref=e3]:
  - paragraph [ref=e4]:
    - generic [ref=e5]:
      - strong [ref=e6]: "404"
      - text: ": NOT_FOUND"
    - generic [ref=e7]:
      - text: "Code:"
      - code [ref=e8]: "`NOT_FOUND`"
    - generic [ref=e9]:
      - text: "ID:"
      - code [ref=e10]: "`gru1::7wg9m-1782920924196-7b1df73dea07`"
  - link "Read our documentation to learn more about this error." [ref=e11] [cursor=pointer]:
    - /url: https://vercel.com/docs/errors/NOT_FOUND
    - generic [ref=e12]: Read our documentation to learn more about this error.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | 
  3  | const BASE = 'https://vestitus-gdp.vercel.app'
  4  | 
  5  | test.describe('Vestitus QA — smoke tests', () => {
  6  | 
  7  |   test.beforeEach(async ({ page }) => {
  8  |     page.setDefaultTimeout(25000)
  9  |   })
  10 | 
  11 |   test('Home page carga con hero, navbar y footer', async ({ page }) => {
  12 |     await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 })
  13 |     await expect(page).toHaveTitle(/Vestitus|React/)
  14 |     await expect(page.locator('nav, header')).toBeVisible()
  15 |     await expect(page.locator('footer')).toBeVisible()
  16 |   })
  17 | 
  18 |   test('Navbar contiene enlaces de navegación', async ({ page }) => {
  19 |     await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 })
  20 |     const nav = page.locator('nav, header')
  21 |     const links = nav.locator('a')
  22 |     const count = await links.count()
  23 |     expect(count).toBeGreaterThanOrEqual(2)
  24 |   })
  25 | 
  26 |   test('Catálogo /products carga sin errores', async ({ page }) => {
  27 |     await page.goto(`${BASE}/products`, { waitUntil: 'networkidle', timeout: 30000 })
  28 |     await expect(page.locator('body')).not.toContainText('Error')
  29 |   })
  30 | 
  31 |   test('Catálogo /products tiene contenido', async ({ page }) => {
  32 |     await page.goto(`${BASE}/products`, { waitUntil: 'networkidle', timeout: 30000 })
  33 |     const body = page.locator('body')
  34 |     const text = await body.innerText()
  35 |     expect(text.length).toBeGreaterThan(50)
  36 |   })
  37 | 
  38 |   test('Carrito /cart carga', async ({ page }) => {
  39 |     await page.goto(`${BASE}/cart`, { waitUntil: 'networkidle', timeout: 30000 })
  40 |     await expect(page.locator('body')).toBeVisible()
  41 |   })
  42 | 
  43 |   test('Checkout /checkout carga', async ({ page }) => {
  44 |     await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 30000 })
  45 |     await expect(page.locator('body')).toBeVisible()
  46 |   })
  47 | 
  48 |   test('Registro /register carga con inputs', async ({ page }) => {
  49 |     await page.goto(`${BASE}/register`, { waitUntil: 'networkidle', timeout: 30000 })
  50 |     const inputs = page.locator('input')
  51 |     const count = await inputs.count()
> 52 |     expect(count).toBeGreaterThanOrEqual(1)
     |                   ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
  53 |   })
  54 | 
  55 |   test('Login /login tiene input email', async ({ page }) => {
  56 |     await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 30000 })
  57 |     const emailInput = page.locator('input[type="email"], input[name="email"]')
  58 |     expect(await emailInput.count()).toBeGreaterThanOrEqual(1)
  59 |   })
  60 | 
  61 |   test('Info corporativa /corporate-info carga', async ({ page }) => {
  62 |     await page.goto(`${BASE}/corporate-info`, { waitUntil: 'networkidle', timeout: 30000 })
  63 |     const body = page.locator('body')
  64 |     await expect(body).toBeVisible()
  65 |   })
  66 | 
  67 |   test('Ruta inexistente responde 404', async ({ page }) => {
  68 |     const resp = await page.goto(`${BASE}/ruta-inexistente-xyz`, { waitUntil: 'networkidle', timeout: 30000 })
  69 |     expect(resp?.status()).toBeLessThan(500)
  70 |   })
  71 | 
  72 |   test('Footer presente en todas las páginas', async ({ page }) => {
  73 |     await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 })
  74 |     await expect(page.locator('footer')).toBeVisible()
  75 |   })
  76 | 
  77 |   test('Navegación /products → /register funciona', async ({ page }) => {
  78 |     await page.goto(`${BASE}/products`, { waitUntil: 'networkidle', timeout: 30000 })
  79 |     await page.goto(`${BASE}/register`, { waitUntil: 'networkidle', timeout: 30000 })
  80 |     await expect(page).toHaveURL(/\/register/)
  81 |   })
  82 | 
  83 |   test('Navegación /register → /login funciona', async ({ page }) => {
  84 |     await page.goto(`${BASE}/register`, { waitUntil: 'networkidle', timeout: 30000 })
  85 |     await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 30000 })
  86 |     await expect(page).toHaveURL(/\/login/)
  87 |   })
  88 | 
  89 |   test('Rendimiento: home carga en <10s', async ({ page }) => {
  90 |     const start = Date.now()
  91 |     await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 })
  92 |     const elapsed = Date.now() - start
  93 |     expect(elapsed).toBeLessThan(10000)
  94 |   })
  95 | })
  96 | 
```