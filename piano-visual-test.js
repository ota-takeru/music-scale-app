const { chromium } = require('playwright')
const fs = require('fs')

;(async () => {
  console.log('🎹 ピアノスタイリング確認テストを開始...')

  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()

  try {
    // 開発サーバーにアクセス
    await page.goto('http://localhost:3000/scaleSearch')
    await page.waitForLoadState('networkidle')

    // ページタイトルを確認
    const title = await page.title()
    console.log('📄 ページタイトル:', title)

    // h1要素を確認
    const h1Text = await page
      .locator('h1')
      .filter({ hasText: 'スケール' })
      .textContent()
    console.log('🎯 スケール検索タイトル:', h1Text)

    // キーセレクターでCを選択
    const keySelector = page.locator('select').first()
    if (await keySelector.isVisible()) {
      await keySelector.selectOption('C')
      console.log('🎵 キー選択: C')
    }

    // スケールセレクターでmajorを選択
    const scaleSelector = page.locator('select').last()
    if (await scaleSelector.isVisible()) {
      await scaleSelector.selectOption('major')
      console.log('🎼 スケール選択: major')
    }

    // 少し待機してピアノが表示されるのを確認
    await page.waitForTimeout(3000)

    // ピアノ関連の要素を確認
    const pianoContainer = page.locator('.piano-container')
    const whiteKeys = page.locator('.white-key')
    const blackKeys = page.locator('.black-key')

    console.log('🎹 ピアノコンテナ表示:', await pianoContainer.isVisible())
    console.log('⚪ 白鍵数:', await whiteKeys.count())
    console.log('⚫ 黒鍵数:', await blackKeys.count())

    // 白鍵のサイズとスタイルを確認
    if ((await whiteKeys.count()) > 0) {
      const firstWhiteKey = whiteKeys.first()
      const box = await firstWhiteKey.boundingBox()
      const computedStyle = await firstWhiteKey.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return {
          width: style.width,
          height: style.height,
          backgroundColor: style.backgroundColor,
          border: style.border,
          borderRadius: style.borderRadius,
        }
      })
      console.log('⚪ 白鍵サイズ:', box)
      console.log('⚪ 白鍵スタイル:', computedStyle)
    }

    // 黒鍵のスタイルを確認
    if ((await blackKeys.count()) > 0) {
      const firstBlackKey = blackKeys.first()
      const box = await firstBlackKey.boundingBox()
      const computedStyle = await firstBlackKey.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return {
          width: style.width,
          height: style.height,
          backgroundColor: style.backgroundColor,
          position: style.position,
          zIndex: style.zIndex,
        }
      })
      console.log('⚫ 黒鍵サイズ:', box)
      console.log('⚫ 黒鍵スタイル:', computedStyle)
    }

    // スクリーンショットを撮影
    await page.screenshot({
      path: 'piano-screenshot.png',
      fullPage: true,
    })
    console.log('📸 スクリーンショット保存: piano-screenshot.png')

    // 白鍵をクリックしてインタラクションをテスト
    if ((await whiteKeys.count()) > 0) {
      const cKey = whiteKeys.first()
      await cKey.click()
      await page.waitForTimeout(500)

      // クリック後のスタイル変化を確認
      const clickedStyle = await cKey.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return {
          backgroundColor: style.backgroundColor,
          dataDown: el.getAttribute('data-down'),
        }
      })
      console.log('🎯 クリック後の白鍵スタイル:', clickedStyle)

      // インタラクション後のスクリーンショット
      await page.screenshot({
        path: 'piano-interaction-screenshot.png',
        fullPage: true,
      })
      console.log(
        '📸 インタラクション後スクリーンショット: piano-interaction-screenshot.png'
      )
    }

    console.log('✅ ピアノスタイリング確認完了！')
  } catch (error) {
    console.error('❌ エラー発生:', error.message)
  }

  await browser.close()
})()
