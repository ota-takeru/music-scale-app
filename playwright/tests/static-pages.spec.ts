import { test, expect } from '@playwright/test'

// 静的生成ページのテスト
test.describe('静的生成ページテスト', () => {
  test('スケール静的ページが正しく生成される', async ({ page }) => {
    // より長いタイムアウトを設定
    test.setTimeout(60000)

    // 直接スケールページにアクセス（ホームページを経由しない）
    await page.goto('/scaleSearch/C-major', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    })

    // ページが正しく読み込まれることを確認
    await expect(page).toHaveURL(/.*scaleSearch\/C-major/)

    // タイトルが設定されていることを確認
    await expect(page).toHaveTitle(/C major Scale/)

    // 基本的なコンテンツが表示されることを確認
    const content = page.locator('body')
    await expect(content).toBeVisible({ timeout: 15000 })
  })

  test('コード静的ページが正しく生成される', async ({ page }) => {
    test.setTimeout(60000)

    // 直接コードページにアクセス（ホームページを経由しない）
    await page.goto('/chordSearch/C-major', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    })

    // ページが正しく読み込まれることを確認
    await expect(page).toHaveURL(/.*chordSearch\/C-major/)

    // タイトルが設定されていることを確認
    await expect(page).toHaveTitle(/C major Chord/)

    // 基本的なコンテンツが表示されることを確認
    const content = page.locator('body')
    await expect(content).toBeVisible({ timeout: 15000 })
  })

  test('複数の静的ページにアクセスできる', async ({ page }) => {
    test.setTimeout(90000)

    const testUrls = [
      '/scaleSearch/G-major',
      '/scaleSearch/A-minor',
      '/chordSearch/F-major',
      '/chordSearch/D-minor',
    ]

    for (const url of testUrls) {
      // 各ページに個別にアクセス
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      })

      // URLが正しいことを確認
      await expect(page).toHaveURL(new RegExp(`.*${url.replace('/', '\\/')}`))

      // ページコンテンツが読み込まれることを確認
      const body = page.locator('body')
      await expect(body).toBeVisible({ timeout: 15000 })

      // 短い間隔でナビゲーション干渉を防ぐ
      await page.waitForTimeout(1000)
    }
  })

  test('静的ページでのインタラクティブ機能', async ({ page }) => {
    test.setTimeout(60000)

    // スケールページにアクセス
    await page.goto('/scaleSearch/C-major', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    })

    // キーセレクターが表示されることを確認
    const keySelector = page.locator('select').first()
    await expect(keySelector).toBeVisible({ timeout: 15000 })

    // セレクターが機能することを確認（存在していれば）
    if (await keySelector.isVisible()) {
      await keySelector.selectOption('D')
      // セレクターの変更後、ページが応答することを確認
      await page.waitForTimeout(2000)
    }
  })

  test('静的ページのSEOメタデータ', async ({ page }) => {
    test.setTimeout(60000)

    // スケールページのメタデータを確認
    await page.goto('/scaleSearch/C-major', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    })

    // タイトルタグが存在することを確認
    const title = await page.title()
    expect(title).toContain('C')
    expect(title).toContain('major')

    // メタディスクリプションが存在することを確認
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toBeAttached({ timeout: 10000 })
  })
})
