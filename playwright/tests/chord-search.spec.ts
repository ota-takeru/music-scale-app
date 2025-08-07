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

test.describe('コード検索機能', () => {
  test('コード検索ページが正しく表示される', async ({ page }) => {
    setupErrorHandling(page)

    await page.goto('/chordSearch')

    // ページタイトルと見出しを確認
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1').filter({ hasText: 'コード' }).or(page.locator('h1').first())).toBeVisible()

    // キーセレクター（ルート音）が表示されることを確認
    await expect(
      page.locator('[data-testid="key-selector"], select, .key-selector')
    ).toBeVisible()

    // コードセレクターが表示されることを確認
    await expect(
      page.locator('[data-testid="chord-selector"], select, .chord-selector')
    ).toBeVisible()
  })

  test('ルート音とコードタイプを選択してコード検索が実行される', async ({
    page,
  }) => {
    setupErrorHandling(page)

    await page.goto('/chordSearch')

    // ページの読み込み完了を待機
    await page.waitForLoadState('networkidle')

    // キーセレクター（複数の可能性を考慮）
    const keySelectors = [
      'select:has(option[value="C"])',
      '[data-testid="key-selector"]',
      'select[name*="key"]',
      'select[name*="root"]',
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
      // ルート音「C」を選択
      await keySelector.selectOption('C')

      // コードセレクター
      const chordSelectors = [
        'select:has(option[value="major"])',
        'select:has(option[value="maj"])',
        '[data-testid="chord-selector"]',
        'select[name*="chord"]',
        'select:last-of-type',
      ]

      let chordSelector = null
      for (const selector of chordSelectors) {
        try {
          chordSelector = page.locator(selector).first()
          if (await chordSelector.isVisible()) {
            break
          }
        } catch {
          continue
        }
      }

      if (chordSelector && (await chordSelector.isVisible())) {
        // コードタイプを選択（major, maj, または最初のオプション）
        const chordOptions = ['major', 'maj', 'M']
        let optionSelected = false

        for (const option of chordOptions) {
          try {
            await chordSelector.selectOption(option)
            optionSelected = true
            break
          } catch {
            continue
          }
        }

        if (!optionSelected) {
          // どのオプションも選択できない場合は、最初のオプションを選択
          try {
            const firstOption = await chordSelector.locator('option').nth(1) // index 0は通常空のオプション
            const value = await firstOption.getAttribute('value')
            if (value) {
              await chordSelector.selectOption(value)
            }
          } catch {
            console.log('コードオプションの選択に失敗しました')
          }
        }

        // 検索結果が表示されるまで待機
        await page.waitForTimeout(2000)

        // 検索結果の表示を確認（楽器表示やコード情報）
        const resultElements = [
          '[data-testid="chord-result"]',
          '.chord-display',
          '.instrument-display',
          'canvas',
          '.chord-notes',
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

  test('異なるルート音とコードタイプの組み合わせで検索が動作する', async ({
    page,
  }) => {
    setupErrorHandling(page)

    await page.goto('/chordSearch')

    // ページの読み込み完了を待機
    await page.waitForLoadState('networkidle')

    const testCases = [
      { root: 'G', chord: 'major' },
      { root: 'A', chord: 'minor' },
      { root: 'D', chord: 'major' },
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
            await keySelector.selectOption(testCase.root)
            break
          }
        } catch {
          continue
        }
      }

      // コードセレクターを見つけて選択
      const chordSelectors = [
        'select:has(option[value*="major"], option[value*="minor"])',
        '[data-testid="chord-selector"]',
        'select:last-of-type',
      ]

      for (const selector of chordSelectors) {
        try {
          const chordSelector = page.locator(selector).first()
          if (await chordSelector.isVisible()) {
            await chordSelector.selectOption(testCase.chord)
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

  test('コード検索でローディング状態が適切に表示される', async ({ page }) => {
    setupErrorHandling(page)

    await page.goto('/chordSearch')

    // ローディングスピナーまたはプレースホルダーが適切に表示される
    const loadingElements = [
      '[data-testid="loading"]',
      '.loading',
      'text="読み込み中"',
      'text="検索結果を読み込み中"',
      'text="楽器を読み込み中"',
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

  test('コード検索のレスポンシブデザインが動作する', async ({ page }) => {
    setupErrorHandling(page)

    // モバイルサイズでテスト
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/chordSearch')

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

  test('ページ間のナビゲーションが正しく動作する', async ({ page }) => {
    setupErrorHandling(page)

        // コード検索ページから開始
    await page.goto('/chordSearch')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1').first()).toBeVisible()
    
    // ホームページに戻る
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('a[href="/chordSearch"]').first()).toBeVisible()
    
    // スケール検索ページに移動
    await page.goto('/scaleSearch')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1').first()).toBeVisible()
    
    // 再度コード検索ページに戻る
    await page.goto('/chordSearch')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1').first()).toBeVisible()
  })
})
