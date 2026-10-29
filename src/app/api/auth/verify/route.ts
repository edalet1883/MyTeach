import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ─────────────────────────────────────────────
//  MyTeach — Telegram webhook
//  Adminin ✅/❌ düymə kliklərini qəbul edir
//  və bazada müəllimin statusunu dəyişir.
//  Qorunma:
//   1) Telegram gizli açarı (secret_token)
//   2) Yalnız adminin Telegram ID-si
//   3) Status axını yoxlanılır (WAITING_ADMIN)
// ─────────────────────────────────────────────

export const dynamic = 'force-dynamic'

interface InlineKeyboard {
  inline_keyboard: { text: string; callback_data: string }[][]
}

interface TgCallbackQuery {
  id: string
  from: { id: number; username?: string }
  data?: string
  message?: {
    message_id: number
    chat: { id: number }
    text?: string
    caption?: string
    photo?: unknown[]
    document?: { file_id: string } | null
  }
}

interface TgUpdate {
  callback_query?: TgCallbackQuery
}

interface TgResponse {
  ok: boolean
  description?: string
}

async function tgCall(token: string, method: string, payload: Record<string, unknown>): Promise<TgResponse> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return (await res.json()) as TgResponse
  } catch (e) {
    console.error(`telegram ${method} error`, e)
    return { ok: false }
  }
}

async function answerCallback(token: string, callbackId: string, text: string): Promise<void> {
  await tgCall(token, 'answerCallbackQuery', { callback_query_id: callbackId, text, show_alert: false })
}

async function markCardAsProcessed(token: string, cq: TgCallbackQuery, approved: boolean): Promise<void> {
  const msg = cq.message
  if (!msg) return
  const isMedia = Array.isArray(msg.photo) || !!msg.document
  const time = new Date().toLocaleString('az-AZ', { timeZone: 'Asia/Baku' })
  const line = approved ? `✅ TƏSDİQLƏNDİ — ${time}` : `❌ RƏDD EDİLDİ — ${time}`
  const old = String(msg.caption ?? msg.text ?? '')
  const next = old.includes('⏳ Status:')
    ? old.replace('⏳ Status: Admin təsdiqi gözləyir', line)
    : `${old}\n\n${line}`

  await tgCall(token, isMedia ? 'editMessageCaption' : 'editMessageText', {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    [isMedia ? 'caption' : 'text']: next,
    reply_markup: { inline_keyboard: [] } as InlineKeyboard,
  })
}

export async function POST(req: NextRequest) {
  try {
    // 1) Gizli açar yoxlaması — bu ünvana yalnız Telegram yaza bilər
    const secret = (process.env.TELEGRAM_WEBHOOK_SECRET || '').trim()
    if (secret) {
      const header = req.headers.get('x-telegram-bot-api-secret-token') || ''
      if (header !== secret) {
        return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
      }
    }

    const token = (process.env.BOT_TOKEN || '').trim()
    if (!token) return NextResponse.json({ ok: true })

    const update = (await req.json()) as TgUpdate
    const cq = update.callback_query
    if (!cq) return NextResponse.json({ ok: true })

    // 2) Yalnız adminin özü düymələrə basa bilər
    const adminId = (process.env.ADMIN_TELEGRAM_ID || '').trim()
    if (!adminId || String(cq.from.id) !== adminId) {
      await answerCallback(token, cq.id, '⛔ İcazə yoxdur')
      return NextResponse.json({ ok: true })
    }

    // 3) Format: t:approve:<id> və ya t:reject:<id>
    const m = String(cq.data || '').match(/^t:(approve|reject):([a-zA-Z0-9_-]+)$/)
    if (!m) {
      await answerCallback(token, cq.id, 'Yanlış sorğu')
      return NextResponse.json({ ok: true })
    }
    const approved = m[1] === 'approve'
    const profileId = m[2]

    const profile = await db.teacherProfile.findUnique({ where: { id: profileId } })

    if (!profile) {
      await answerCallback(token, cq.id, '⚠️ Müəllim tapılmadı')
    } else if (profile.status !== 'WAITING_ADMIN') {
      const why =
        profile.status === 'APPROVED' ? 'Bu müəllim artıq təsdiqlənib' :
        profile.status === 'REJECTED' ? 'Bu müəllim artıq rədd edilib' :
        'Bu profil hələ emala hazır deyil'
      await answerCallback(token, cq.id, why)
    } else {
      await db.teacherProfile.update({
        where: { id: profileId },
        data: { status: approved ? 'APPROVED' : 'REJECTED' },
      })
      await answerCallback(token, cq.id, approved ? '✅ Müəllim təsdiqləndi' : '❌ Müəllim rədd edildi')
      await markCardAsProcessed(token, cq, approved)
      console.log(`telegram: müəllim ${approved ? 'TƏSDİQLƏNDİ' : 'RƏDD EDİLDİ'} — ${profileId}`)
    }

    // Telegram-a həmişə 200 qaytarırıq (yenidən göndərmələrin qarşısını almaq üçün)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('telegram webhook error', e)
    return NextResponse.json({ ok: true })
  }
}
