'use client'

import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

// ログの引数の型定義
type LogArg = string | number | boolean | object | null | undefined

// ファイル情報の型定義
interface FileInfo {
  filePath: string
}

// デバッグ設定
const settings = {
  // ログレベルフィルター (すべてのログを送信する場合は空配列)
  logLevelFilter: [] as Array<'log' | 'info' | 'warn' | 'error'>,
  // ローカルコンソールにも出力するか
  enableLocalOutput: true,
  // サーバーにログを送信するか
  enableServerOutput: true,
  // デバッグモード (余分な情報を出力)
  debug: false, // デバッグを一時的に有効化
}

// グローバル変数
let socketInstance: Socket | null = null
const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
}

// スタックトレースからファイル情報を抽出する関数
const getFileInfo = (): FileInfo => {
  try {
    const err = new Error()
    const stackLines = err.stack?.split('\n') || []

    // デバッグモードの場合、スタックトレース全体を表示
    if (settings.debug && originalConsole.log) {
      originalConsole.log('Full stack trace:', stackLines)
    }

    // スタックトレースから必要な行を見つける
    let targetLine = ''

    // 通常は3~5行目以降にアプリケーションコードの呼び出し元がある
    // Next.jsの開発環境では深い階層になることがある
    for (let i = 3; i < Math.min(15, stackLines.length); i++) {
      const line = stackLines[i]
      // ライブラリや内部コードは除外
      if (
        !line.includes('BrowserLogger.tsx') &&
        !line.includes('node_modules/') &&
        !line.includes('<anonymous>') &&
        !line.includes('Function.') &&
        !line.includes('react-refresh') &&
        !line.includes('eval at') &&
        (line.includes('src/') ||
          line.includes('.tsx') ||
          line.includes('.jsx') ||
          line.includes('.ts') ||
          line.includes('.js'))
      ) {
        targetLine = line
        break
      }
    }

    // 最後の手段として、どの行も適切でなければ最初のアプリケーションコードの行を使う
    if (!targetLine) {
      for (let i = 3; i < stackLines.length; i++) {
        const line = stackLines[i]
        if (
          (line.includes('webpack-internal:') || line.includes('webpack://')) &&
          (line.includes('src/') || line.includes('./src/'))
        ) {
          targetLine = line
          break
        }
      }
    }

    if (!targetLine && stackLines.length > 3) {
      // どうしても見つからない場合は3行目を使用
      targetLine = stackLines[3]
    }

    if (settings.debug && originalConsole.log) {
      originalConsole.log('Selected stack trace line:', targetLine)
    }

    if (!targetLine) {
      return { filePath: '不明' }
    }

    // さまざまなブラウザのスタックトレース形式に対応
    let filePath = '不明'

    // Next.jsのwebpack-internal形式に特に対応
    // webpack-internal:///./src/components/file.tsx
    // または webpack://ai-word-wolf/./src/components/file.tsx
    if (
      targetLine.includes('webpack-internal:') ||
      targetLine.includes('webpack://')
    ) {
      // src/から始まるパスを抽出
      const srcMatch = targetLine.match(
        /(?:webpack-internal:|webpack:\/\/[^/]*\/)(?:\.\/)?(.+?)(?:[:?]|$)/
      )
      if (srcMatch && srcMatch[1]) {
        filePath = srcMatch[1]

        // もし抽出したパスにsrc/が含まれていれば、そこから始まるパスを使用
        const srcPathMatch = filePath.match(/(src\/.+?)(?:[:?]|$)/)
        if (srcPathMatch) {
          filePath = srcPathMatch[1]
        }

        return { filePath }
      }
    }

    // その他の形式に対応する正規表現
    const patterns = [
      // Chrome形式 - at Name (path:line:col)
      /at\s+(?:[^()]+\s+)?\(?([^:)]+):/,
      // Firefox形式 - Name@path:line:col
      /(?:[@])([^:]+):/,
      // 一般形式
      /([^:\s]+):/,
    ]

    for (const pattern of patterns) {
      const match = targetLine.match(pattern)
      if (match) {
        const fullPath = match[1] || '不明'

        // プロジェクトルートからの相対パスを抽出
        const srcMatch = fullPath.match(/(src\/.*?)(?:[:?]|$)/)
        if (srcMatch) {
          filePath = srcMatch[1]
        } else {
          // src/が見つからない場合は、ファイル名のみを抽出
          const fileNameMatch = fullPath.match(/([^/\\]+\.(js|ts|jsx|tsx))$/)
          if (fileNameMatch) {
            filePath = fileNameMatch[1]
          } else {
            // 最後の手段として、最も意味のある部分を取得
            filePath = fullPath.split(/[/\\]/).pop() || fullPath
          }
        }

        break
      }
    }

    return { filePath }
  } catch (error) {
    if (settings.debug && originalConsole.log) {
      originalConsole.log('Error getting file info:', String(error))
    }
    return { filePath: '不明' }
  }
}

// サーバーにログを送信する関数
const sendToServer = (
  level: 'log' | 'info' | 'warn' | 'error',
  args: LogArg[]
) => {
  if (!settings.enableServerOutput) return

  if (
    settings.logLevelFilter.length > 0 &&
    !settings.logLevelFilter.includes(level)
  ) {
    return
  }

  try {
    // ファイル情報を取得
    const fileInfo = getFileInfo()

    // フォーマット文字列(%s, %d, %o, %O, %jなど)を処理
    let formattedArgs: LogArg[] = [...args]

    if (typeof args[0] === 'string' && args[0].includes('%')) {
      const format = args[0]
      const values = args.slice(1)
      let formattedMessage = format

      // 簡易的なフォーマット処理
      let valueIndex = 0
      formattedMessage = formattedMessage.replace(/%[sidjoO]/g, () => {
        if (valueIndex < values.length) {
          const value = values[valueIndex++]
          return String(value)
        }
        return '%?' // 対応する値がない場合
      })

      formattedArgs = [formattedMessage, ...values.slice(valueIndex)]
    }

    // 循環参照を安全に処理するためのJSON変換
    const safeArgs = formattedArgs.map((arg) => {
      if (arg === undefined) return 'undefined'
      if (arg === null) return null

      // オブジェクトの場合は循環参照を処理
      if (typeof arg === 'object') {
        try {
          // WeakSetを使って既に処理したオブジェクトを追跡
          const seen = new WeakSet()
          const safeObj = JSON.parse(
            JSON.stringify(arg, (key, value) => {
              // 循環参照のチェック
              if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                  return '[Circular Reference]'
                }
                seen.add(value)
              }
              return value
            })
          )
          return safeObj
        } catch {
          return String(arg)
        }
      }

      return arg
    })

    // ページのURLを取得
    const url = window.location.pathname

    // ログデータを作成
    const logData = {
      level,
      args: safeArgs,
      url,
      timestamp: new Date().toISOString(),
      fileInfo, // ファイル情報を追加
    }

    // サーバーにログを送信
    if (socketInstance && socketInstance.connected) {
      socketInstance.emit('browser-log', logData)
    } else {
      // 接続がまだ確立していない場合はログをバッファリング
      logBuffer.push({
        level,
        args: safeArgs,
        url,
        timestamp: logData.timestamp,
        fileInfo,
      })
    }
  } catch (error) {
    if (String(error) == 'ReferenceError: window is not defined') {
      return
    }
    originalConsole.log(`BrowserLogger: ログ送信エラー: ${String(error)}`)
  }
}

// ログをバッファリングするための配列
const logBuffer: Array<{
  level: 'log' | 'info' | 'warn' | 'error'
  args: unknown[]
  url: string
  timestamp: string
  fileInfo?: { filePath: string }
}> = []

// モジュール初期化時にコンソールをオーバーライド
console.log = function (...args: LogArg[]) {
  if (settings.enableLocalOutput) {
    originalConsole.log(...args)
  }
  sendToServer('log', args)
}

console.info = function (...args: LogArg[]) {
  if (settings.enableLocalOutput) {
    originalConsole.info(...args)
  }
  sendToServer('info', args)
}

console.warn = function (...args: LogArg[]) {
  if (settings.enableLocalOutput) {
    originalConsole.warn(...args)
  }
  sendToServer('warn', args)
}

console.error = function (...args: LogArg[]) {
  if (settings.enableLocalOutput) {
    originalConsole.error(...args)
  }
  sendToServer('error', args)
}

// Reactコンポーネント部分（Socket.IO接続管理）
const BrowserLogger = () => {
  useEffect(() => {
    try {
      // Socket.IOクライアントを初期化
      const socket = io('http://localhost:3001', {
        path: '/socket.io',
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        transports: ['websocket'],
      })

      socket.on('connect', () => {
        originalConsole.log('BrowserLogger: Socket.IOサーバーに接続しました')

        // バッファに貯めていたログを送信
        if (logBuffer.length > 0) {
          logBuffer.forEach((log) => {
            socket.emit('browser-log', log)
          })
          // バッファをクリア
          logBuffer.length = 0
        }
      })

      socket.on('connect_error', (err) => {
        originalConsole.log(
          `BrowserLogger: Socket.IO接続エラー: ${String(err)}`
        )
      })

      // グローバル変数にsocketを保存
      socketInstance = socket
    } catch (error) {
      originalConsole.log(`BrowserLogger: セットアップエラー: ${String(error)}`)
    }

    // クリーンアップ関数
    return () => {
      if (socketInstance) {
        socketInstance.disconnect()
        socketInstance = null
      }
    }
  }, [])

  return null
}

export default BrowserLogger
