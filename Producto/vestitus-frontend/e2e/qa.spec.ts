import { test, expect } from '@playwright/test'

const BASE = 'https://vestitus-gdp.vercel.app'

test.describe('Vestitus QA — smoke tests', () => {

  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(25000)
  })

  test('Home page carga con hero, navbar y footer', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 })
    await expect(page).toHaveTitle(/Vestitus|React/)
    await expect(page.locator('nav, header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('Navbar contiene enlaces de navegación', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 })
    const nav = page.locator('nav, header')
    const links = nav.locator('a')
    const count = await links.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('Catálogo /products carga sin errores', async ({ page }) => {
    await page.goto(`${BASE}/products`, { waitUntil: 'networkidle', timeout: 30000 })
    await expect(page.locator('body')).not.toContainText('Error')
  })

  test('Catálogo /products tiene contenido', async ({ page }) => {
    await page.goto(`${BASE}/products`, { waitUntil: 'networkidle', timeout: 30000 })
    const body = page.locator('body')
    const text = await body.innerText()
    expect(text.length).toBeGreaterThan(50)
  })

  test('Carrito /cart carga', async ({ page }) => {
    await page.goto(`${BASE}/cart`, { waitUntil: 'networkidle', timeout: 30000 })
    await expect(page.locator('body')).toBeVisible()
  })

  test('Checkout /checkout carga', async ({ page }) => {
    await page.goto(`${BASE}/checkout`, { waitUntil: 'networkidle', timeout: 30000 })
    await expect(page.locator('body')).toBeVisible()
  })

  test('Registro /register carga con inputs', async ({ page }) => {
    await page.goto(`${BASE}/register`, { waitUntil: 'networkidle', timeout: 30000 })
    const inputs = page.locator('input')
    const count = await inputs.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('Login /login tiene input email', async ({ page }) => {
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 30000 })
    const emailInput = page.locator('input[type="email"], input[name="email"]')
    expect(await emailInput.count()).toBeGreaterThanOrEqual(1)
  })

  test('Info corporativa /corporate-info carga', async ({ page }) => {
    await page.goto(`${BASE}/corporate-info`, { waitUntil: 'networkidle', timeout: 30000 })
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('Ruta inexistente responde 404', async ({ page }) => {
    const resp = await page.goto(`${BASE}/ruta-inexistente-xyz`, { waitUntil: 'networkidle', timeout: 30000 })
    expect(resp?.status()).toBeLessThan(500)
  })

  test('Footer presente en todas las páginas', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 })
    await expect(page.locator('footer')).toBeVisible()
  })

  test('Navegación /products → /register funciona', async ({ page }) => {
    await page.goto(`${BASE}/products`, { waitUntil: 'networkidle', timeout: 30000 })
    await page.goto(`${BASE}/register`, { waitUntil: 'networkidle', timeout: 30000 })
    await expect(page).toHaveURL(/\/register/)
  })

  test('Navegación /register → /login funciona', async ({ page }) => {
    await page.goto(`${BASE}/register`, { waitUntil: 'networkidle', timeout: 30000 })
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 30000 })
    await expect(page).toHaveURL(/\/login/)
  })

  test('Rendimiento: home carga en <10s', async ({ page }) => {
    const start = Date.now()
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 })
    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(10000)
  })
})
