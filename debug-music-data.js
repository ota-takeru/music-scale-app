const { chromium } = require('playwright')

;(async () => {
  console.log('🐛 音楽データのデバッグを開始...')

  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()

  // コンソールメッセージを監視
  page.on('console', (msg) => {
    console.log('📱 ブラウザコンソール:', msg.text())
  })

  try {
    await page.goto('http://localhost:3000/scaleSearch')
    await page.waitForLoadState('networkidle')

    // キーとスケールを選択
    const keySelector = page.locator('select').first()
    if (await keySelector.isVisible()) {
      await keySelector.selectOption('C')
      console.log('🎵 キー選択: C')
    }

    const scaleSelector = page.locator('select').last()
    if (await scaleSelector.isVisible()) {
      await scaleSelector.selectOption('major')
      console.log('🎼 スケール選択: major')
    }

    // 少し待機
    await page.waitForTimeout(5000)

    // musicDataの内容を確認
    const musicDataInfo = await page.evaluate(() => {
      // Reactの内部Stateにアクセスするためのハック
      const instrumentDisplay =
        document.querySelector('[data-testid="instrument-display"]') ||
        document.querySelector('div[class*="InstrumentDisplay"]') ||
        document.querySelector('div').parentElement

      if (instrumentDisplay) {
        const reactFiber = Object.keys(instrumentDisplay).find(
          (key) =>
            key.startsWith('__reactInternalInstance') ||
            key.startsWith('__reactFiber')
        )
        if (reactFiber) {
          // React内部からStateを取得しようとする（不安定）
          return 'React state access attempted'
        }
      }

      return 'No React state found'
    })

    console.log('🔍 React State情報:', musicDataInfo)

    // ピアノコンテナの状態を確認
    const pianoContainerText = await page
      .locator('.piano-container')
      .textContent()
      .catch(() => 'Not found')
    console.log('🎹 ピアノコンテナテキスト:', pianoContainerText)

    // LocalStorage/SessionStorageの確認
    const storageInfo = await page.evaluate(() => {
      return {
        localStorage: Object.keys(localStorage).map((key) => ({
          key,
          value: localStorage.getItem(key),
        })),
        sessionStorage: Object.keys(sessionStorage).map((key) => ({
          key,
          value: sessionStorage.getItem(key),
        })),
      }
    })

    console.log('💾 ストレージ情報:', JSON.stringify(storageInfo, null, 2))

    // ネットワークリクエストを監視
    const networkRequests = []
    page.on('response', (response) => {
      if (response.url().includes('key') || response.url().includes('scale')) {
        networkRequests.push({
          url: response.url(),
          status: response.status(),
          contentType: response.headers()['content-type'],
        })
      }
    })

    // もう一度スケール選択をトリガー
    await scaleSelector.selectOption('minor')
    await page.waitForTimeout(2000)
    await scaleSelector.selectOption('major')
    await page.waitForTimeout(3000)

    console.log('🌐 ネットワークリクエスト:', networkRequests)

    // 最終的なpianoコンテナの状態
    const finalPianoState = await page
      .locator('.piano-container')
      .textContent()
      .catch(() => 'Not found')
    console.log('🎹 最終ピアノ状態:', finalPianoState)

    const hasVisibleKeys = await page.locator('.white-key, .black-key').count()
    console.log('🎼 表示されているキー数:', hasVisibleKeys)

    console.log('✅ デバッグ完了！')
  } catch (error) {
    console.error('❌ エラー発生:', error.message)
  }

  await browser.close()
})()
