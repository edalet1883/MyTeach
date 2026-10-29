import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// ─────────────────────────────────────────────
//  MyTeach — Telegram webhook
//  Adminin Telegram-dakı "✅ Təsdiqlə / ❌ Rədd et"
//  düymələrini emal edir (callback_query).
//  Təhlükəsizlik: X-Telegram-Bot-Api-Secret-Token
//  başlığı TELEGRAM_WEBHOOK_SECRET ilə yoxlanılır —
//  bu başlıq olmasa heç kəs statusu dəyişə bilməz.
// ─────────────────────────────────────────────

function tgApi(token: string, method: string): string {
  return `https://api.telegram.org/bot${token}/${method}`
}

async function tgCall(token: string, method: string, payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(tgApi(token, method), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = (await res.json()) as { ok: boolean; description?: string }
    if (!json.ok) console.error(`telegram ${method} failed:`, json.description)
    return json.ok
  } catch (e) {
    console.error(`telegram ${method} error`, e)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1) Secret token yoxlaması — yalnız Telegram bu başlığı göndərir
    const secret = (process.env.TELEGRAM_WEBHOOK_SECRET || '').trim()
    if (secret) {
      const header = req.headers.get('x-telegram-bot-api-secret-token')
      if (header !== secret) {
        return NextResponse.json({ ok: false }, { status: 403 })
      }
    }

    const token = (process.env.BOT_TOKEN || '').trim()
    if (!token) {
      return NextResponse.json({ ok: true }) // bot konfiq edilməyibsə sukutla ötür
    }

    const update = await req.json()

    // 2) Yalnız callback_query maraqlandırır
    const cb = update?.callback_query
    const data: string | undefined = cb?.data
    if (!cb || typeof data !== 'string') {
      return NextResponse.json({ ok: true })
    }

    const isApprove = data.startsWith('t:approve:')
    const isReject = data.startsWith('t:reject:')
    if (!isApprove && !isReject) {
      await tgCall(token, 'answerCallbackQuery', { callback_query_id: cb.id })
      return NextResponse.json({ ok: true })
    }

    // 3) Chat id yoxlaması — yalnız adminin chat-i qəbul olunur
    const adminId = (process.env.ADMIN_TELEGRAM_ID || '').trim()
    const fromChatId = String(cb?.from?.id ?? '')
    if (adminId && fromChatId !== adminId) {
      await tgCall(token, 'answerCallbackQuery', {
        callback_query_id: cb.id,
        text: 'Bu əməliyyat üçün icazəniz yoxdur',
        show_alert: true,
      })
      return NextResponse.json({ ok: true })
    }

    // 4) Statusu yenilə (admin panel ilə eyni məntiq)
    const teacherId = data.slice('t:approve:'.length)
    const status = isApprove ? 'APPROVED' : 'REJECTED'

    const existing = await db.teacherProfile.findUnique({ where: { id: teacherId } })
    if (!existing) {
      await tgCall(token, 'answerCallbackQuery', {
        callback_query_id: cb.id,
        text: 'Müəllim tapılmadı',
        show_alert: true,
      })
      return NextResponse.json({ ok: true })
    }

    await db.teacherProfile.update({ where: { id: teacherId }, data: { status } })

    // 5) Adminə geri bildiriş — düymələri silib status mesajı göndər
    const profile = await db.teacherProfile.findUnique({
      where: { id: teacherId },
      include: { user: true },
    })
    const fullName = profile ? `${profile.user.name} ${profile.user.surname}` : 'Müəllim'

    await tgCall(token, 'answerCallbackQuery', {
      callback_query_id: cb.id,
      text: isApprove ? `${fullName} təsdiqləndi` : `${fullName} rədd edildi`,
    })

    const messageId = cb?.message?.message_id
    const chatId = cb?.message?.chat?.id
    if (messageId && chatId) {
      await tgCall(token, 'editMessageReplyMarkup', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: { inline_keyboard: [] },
      })
      await tgCall(token, 'sendMessage', {
        chat_id: chatId,
        text: isApprove
          ? `✅ ${fullName} TƏSDİQLƏNDİ — profili saytda görünür.`
          : `❌ ${fullName} RƏDD EDİLDİ — profili saytda görünmür.`,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('telegram webhook error', e)
    // Telegram 2xx gözləyir — xəta olsa təkrar göndərməsin
    return NextResponse.json({ ok: true })
  }
}
