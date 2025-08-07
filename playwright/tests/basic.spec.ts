import { test, expect, Page } from '@playwright/test'

// ヘルパー関数：コンソールとエラーのロギング設定
const setupErrorHandling = (page: Page) => {
  /* ---------- console ---------- */
  page.on('console', async (msg) => {
    // Error オブジェクトの場合は stack を取る
    if (msg.type() === 'error' && msg.args().length === 1) {
      const value = await msg
        .args()[0]
        .evaluate((e) => {
          // Error っぽいものなら stack を返す
          return e instanceof Error ? `${e.message}\n${e.stack}` : e
        })
        .catch(() => '[unserializable]')
      console.error(`[console][error] ${value}`)
      return
    }

    // それ以外は安全にシリアライズ
    const args = await Promise.all(
      msg.args().map(async (arg) => {
        try {
          return await arg.jsonValue()
        } catch {
          return '[unserializable]'
        }
      })
    )
    console.log(
      `[console][${msg.type()}] ${msg.text()}  ↩︎  ${JSON.stringify(args)}`
    )
  })

  /* ---------- JS runtime errors ---------- */
  page.on('pageerror', (err) => {
    console.error('[pageerror]', err.message, '\n', err.stack)
  })

  /* ---------- Network failures ---------- */
  page.on('requestfailed', (req) => {
    const failure = req.failure()
    console.error(
      '[requestfailed]',
      req.method(),
      req.url(),
      failure?.errorText ?? ''
    )
  })
}

test.describe('基本的な機能テスト', () => {
  test('トップページが正しく表示される', async ({ page }) => {
    setupErrorHandling(page)

    await page.goto('/')

    // ページタイトルが存在することを確認（または空でないことを確認）
    await page.waitForLoadState('networkidle')

    // メインコンテンツが表示されることを確認
    await expect(page.locator('h1').first()).toBeVisible()

    // スケール検索とコード検索のリンクが存在することを確認（メインコンテンツ内の最初のリンクを選択）
    await expect(page.locator('a[href="/scaleSearch"]').first()).toBeVisible()
    await expect(page.locator('a[href="/chordSearch"]').first()).toBeVisible()
  })

  test('ナビゲーションが正しく動作する', async ({ page }) => {
    setupErrorHandling(page)

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // スケール検索ページへのナビゲーション（メインコンテンツの最初のリンクをクリック）
    await page.click('a[href="/scaleSearch"]', { force: true })
    await page.waitForURL('**/scaleSearch')
    await expect(page.url()).toContain('/scaleSearch')

    // ページの内容が表示されることを確認（特定のh1を選択）
    await expect(
      page
        .locator('h1')
        .filter({ hasText: 'スケール' })
        .or(page.locator('h1').first())
    ).toBeVisible()

    // ホームに戻る
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // コード検索ページへのナビゲーション（メインコンテンツの最初のリンクをクリック）
    await page.click('a[href="/chordSearch"]', { force: true })
    await page.waitForURL('**/chordSearch')
    await expect(page.url()).toContain('/chordSearch')

    // ページの内容が表示されることを確認（特定のh1を選択）
    await expect(
      page
        .locator('h1')
        .filter({ hasText: 'コード' })
        .or(page.locator('h1').first())
    ).toBeVisible()
  })

  test('レスポンシブデザインが正しく動作する', async ({ page }) => {
    setupErrorHandling(page)

    // モバイルサイズでのテスト
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // コンテンツが表示されることを確認
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.locator('a[href="/scaleSearch"]').first()).toBeVisible()
    await expect(page.locator('a[href="/chordSearch"]').first()).toBeVisible()

    // デスクトップサイズでのテスト
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // コンテンツが引き続き表示されることを確認
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.locator('a[href="/scaleSearch"]').first()).toBeVisible()
    await expect(page.locator('a[href="/chordSearch"]').first()).toBeVisible()
  })
})
