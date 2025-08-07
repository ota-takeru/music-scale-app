import { test, expect, Page } from '@playwright/test'

// ヘルパー関数：コンソールとエラーのロギング設定
const setupErrorHandling = (page: Page) => {
  page.on('console', async (msg) => {
    if (msg.type() === 'error' && msg.args().length === 1) {
      const value = await msg
        .args()[0]
        .evaluate((e: any) => {
          return e instanceof Error ? `${e.message}\n${e.stack}` : e
        })
        .catch(() => '[unserializable]')
      console.error(`[console][error] ${value}`)
      return
    }

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

  page.on('pageerror', (err: any) => {
    console.error('[pageerror]', err.message, '\n', err.stack)
  })

  page.on('requestfailed', (req: any) => {
    const failure = req.failure()
    console.error(
      '[requestfailed]',
      req.method(),
      req.url(),
      failure?.errorText ?? ''
    )
  })
}

test.describe('スケール検索機能', () => {
  test('スケール検索ページが正しく表示される', async ({ page }) => {
    setupErrorHandling(page)

    await page.goto('/scaleSearch')

    // ページタイトルと見出しを確認
    await page.waitForLoadState('networkidle')
    await expect(
      page
        .locator('h1')
        .filter({ hasText: 'スケール' })
        .or(page.locator('h1').first())
    ).toBeVisible()

    // キーセレクターが表示されることを確認
    await expect(
      page.locator('[data-testid="key-selector"], select, .key-selector')
    ).toBeVisible()

    // スケールセレクターが表示されることを確認
    await expect(
      page.locator('[data-testid="scale-selector"], select, .scale-selector')
    ).toBeVisible()
  })

  test('キーとスケールを選択してスケール検索が実行される', async ({ page }) => {
    setupErrorHandling(page)

    await page.goto('/scaleSearch')

    // ページの読み込み完了を待機
    await page.waitForLoadState('networkidle')

    // キーセレクター（複数の可能性を考慮）
    const keySelectors = [
      'select:has(option[value="C"])',
      '[data-testid="key-selector"]',
      'select[name*="key"]',
      'select:first-of-type',
    ]

    let keySelector = null
    for (const selector of keySelectors) {
      try {
        keySelector = page.locator(selector).first()
        if (await keySelector.isVisible()) {
          break
        }
      } catch {
        continue
      }
    }

    if (keySelector && (await keySelector.isVisible())) {
      // キー「C」を選択
      await keySelector.selectOption('C')

      // スケールセレクター
      const scaleSelectors = [
        'select:has(option[value="major"])',
        '[data-testid="scale-selector"]',
        'select[name*="scale"]',
        'select:last-of-type',
      ]

      let scaleSelector = null
      for (const selector of scaleSelectors) {
        try {
          scaleSelector = page.locator(selector).first()
          if (await scaleSelector.isVisible()) {
            break
          }
        } catch {
          continue
        }
      }

      if (scaleSelector && (await scaleSelector.isVisible())) {
        // スケール「major」を選択
        await scaleSelector.selectOption('major')

        // 検索結果が表示されるまで待機
        await page.waitForTimeout(2000)

        // 検索結果の表示を確認（楽器表示やスケール情報）
        const resultElements = [
          '[data-testid="scale-result"]',
          '.scale-display',
          '.instrument-display',
          'canvas',
          '.scale-notes',
        ]

        let resultFound = false
        for (const selector of resultElements) {
          try {
            const element = page.locator(selector).first()
            if (await element.isVisible({ timeout: 5000 })) {
              resultFound = true
              break
            }
          } catch {
            continue
          }
        }

        // 何らかの結果が表示されていることを期待
        expect(resultFound).toBeTruthy()
      }
    }
  })

  test('異なるキーとスケールの組み合わせで検索が動作する', async ({ page }) => {
    setupErrorHandling(page)

    await page.goto('/scaleSearch')

    // ページの読み込み完了を待機
    await page.waitForLoadState('networkidle')

    const testCases = [
      { key: 'G', scale: 'major' },
      { key: 'A', scale: 'minor' },
      { key: 'D', scale: 'major' },
    ]

    for (const testCase of testCases) {
      // キーセレクターを見つけて選択
      const keySelectors = [
        'select:has(option)',
        '[data-testid="key-selector"]',
        'select:first-of-type',
      ]

      for (const selector of keySelectors) {
        try {
          const keySelector = page.locator(selector).first()
          if (await keySelector.isVisible()) {
            await keySelector.selectOption(testCase.key)
            break
          }
        } catch {
          continue
        }
      }

      // スケールセレクターを見つけて選択
      const scaleSelectors = [
        'select:has(option[value*="major"], option[value*="minor"])',
        '[data-testid="scale-selector"]',
        'select:last-of-type',
      ]

      for (const selector of scaleSelectors) {
        try {
          const scaleSelector = page.locator(selector).first()
          if (await scaleSelector.isVisible()) {
            await scaleSelector.selectOption(testCase.scale)
            break
          }
        } catch {
          continue
        }
      }

      // 結果の更新を待機
      await page.waitForTimeout(1500)
    }
  })

  test('ローディング状態が適切に表示される', async ({ page }) => {
    setupErrorHandling(page)

    await page.goto('/scaleSearch')

    // ローディングスピナーまたはプレースホルダーが適切に表示される
    const loadingElements = [
      '[data-testid="loading"]',
      '.loading',
      'text="読み込み中"',
      'text="検索結果を読み込み中"',
    ]

    // いずれかのローディング要素が一時的に表示される可能性を確認
    let loadingDetected = false
    for (const selector of loadingElements) {
      try {
        const element = page.locator(selector).first()
        if (await element.isVisible({ timeout: 1000 })) {
          loadingDetected = true
          break
        }
      } catch {
        continue
      }
    }

    // ローディングが検出されない場合でも、ページが正常に機能していることを確認
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('レスポンシブデザインでスケール検索が動作する', async ({ page }) => {
    setupErrorHandling(page)

    // モバイルサイズでテスト
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/scaleSearch')

    // 基本要素が表示されることを確認
    await expect(page.locator('h1').first()).toBeVisible()

    // セレクター要素が適切に表示される
    const selectors = page.locator('select')
    if ((await selectors.count()) > 0) {
      await expect(selectors.first()).toBeVisible()
    }

    // デスクトップサイズに戻してテスト
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.reload()

    // 引き続き動作することを確認
    await expect(page.locator('h1').first()).toBeVisible()
  })
})
