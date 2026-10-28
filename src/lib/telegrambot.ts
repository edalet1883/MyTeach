import path from 'path'
import { readFile } from 'fs/promises'
import { db } from '@/lib/db'

// ─────────────────────────────────────────────
//  MyTeach — Telegram bot inteqrasiyası
//  Müəllim Gmail təsdiqi edəndə adminin
//  Telegram-ına kart + diplom faylı göndərilir.
//  Hər hansı xəta olsa sayt dayanmır — yalnız
//  console-a yazılır (təhlükəsiz dizayn).
//  Əlavə paket (npm install) lazım deyil.
// ─────────────────────────────────────────────

interface InlineButton {
  text: string
  callback_data: string
}

interface InlineKeyboard {
  inline_keyboard: InlineButton[][]
}

interface TgResponse {
  ok: boolean
  description?: string
}

interface TeacherCard {
  id: string
  bio: string | null
  experienceYears: number
  pricePerHour: number
  diplomaUrl: string | null
  lessonFormats: string
  status: string
  user: { name: string; surname: string; email: string; phone: string }
  subject: { nameAz: string } | null
  city: { nameAz: string } | null
}

function tgApi(token: string, method: string): string {
  return `https://api.telegram.org/bot${token}/${method}`
}

async function tgCall(token: string, method: string, payload: Record<string, unknown>): Promise<TgResponse> {
  try {
    const res = await fetch(tgApi(token, method), {
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

function formatLessonFormats(f: string): string {
  if (f === 'ONLINE') return 'Online'
  if (f === 'IN_PERSON') return 'Üz-üzə'
  return 'Online + Üz-üzə'
}

function buildCaption(p: TeacherCard): string {
  const lines = [
    '🆕 YENİ MÜƏLLİM — MyTeach',
    '',
    `👤 Ad: ${p.user.name} ${p.user.surname}`,
    `📧 E-poçt: ${p.user.email}`,
    `📱 Telefon: ${p.user.phone}`,
    `📚 Fənn: ${p.subject?.nameAz ?? '—'}`,
    `🏙 Şəhər: ${p.city?.nameAz ?? '—'}`,
    `💼 Təcrübə: ${p.experienceYears} il`,
    `💰 Qiymət: ${p.pricePerHour} AZN/saat`,
    `🎓 Dərs forması: ${formatLessonFormats(p.lessonFormats)}`,
  ]
  if (p.bio) {
    const bio = p.bio.length > 200 ? p.bio.slice(0, 200) + '…' : p.bio
    lines.push(`📝 Qeyd: ${bio}`)
  }
  lines.push('', '⏳ Status: Admin təsdiqi gözləyir')
  return lines.join('\n').slice(0, 1000)
}

async function sendDiplomaFile(
  token: string,
  chatId: string,
  diplomaUrl: string,
  caption: string,
  keyboard: InlineKeyboard
): Promise<boolean> {
  try {
    const ext = (diplomaUrl.split('.').pop() || '').toLowerCase()
    const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)
    const mime =
      ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
      ext === 'png' ? 'image/png' :
      ext === 'webp' ? 'image/webp' :
      ext === 'gif' ? 'image/gif' :
      ext === 'pdf' ? 'application/pdf' : 'application/octet-stream'

    const absPath = path.join(process.cwd(), 'public', diplomaUrl.replace(/^\/+/, ''))
    const buffer = await readFile(absPath)

    const form = new FormData()
    form.append('chat_id', chatId)
    form.append('caption', caption)
    form.append('reply_markup', JSON.stringify(keyboard))
    const fileName = diplomaUrl.split('/').pop() || 'diploma'
    form.append(isImage ? 'photo' : 'document', new Blob([new Uint8Array(buffer)], { type: mime }), fileName)

    const method = isImage ? 'sendPhoto' : 'sendDocument'
    const res = await fetch(tgApi(token, method), { method: 'POST', body: form })
    const json = (await res.json()) as TgResponse
    if (!json.ok) console.error(`telegram ${method} failed:`, json.description)
    return json.ok
  } catch (e) {
    console.error('telegram sendDiplomaFile error', e)
    return false
  }
}

// Gmail təsdiqindən dərhal sonra çağırılır. userId = User.id
export async function notifyAdminNewTeacher(userId: string): Promise<void> {
  try {
    const token = (process.env.BOT_TOKEN || '').trim()
    const adminId = (process.env.ADMIN_TELEGRAM_ID || '').trim()
    if (!token || !adminId) {
      console.warn('telegram: BOT_TOKEN və ya ADMIN_TELEGRAM_ID yoxdur — bildiriş göndərilmədi')
      return
    }

    const profile = await db.teacherProfile.findUnique({
      where: { userId },
      include: { user: true, subject: true, city: true },
    })
    if (!profile) return

    const caption = buildCaption(profile)
    const keyboard: InlineKeyboard = {
      inline_keyboard: [[
        { text: '✅ Təsdiqlə', callback_data: `t:approve:${profile.id}` },
        { text: '❌ Rədd et', callback_data: `t:reject:${profile.id}` },
      ]],
    }

    let sent = false
    if (profile.diplomaUrl) {
      sent = await sendDiplomaFile(token, adminId, profile.diplomaUrl, caption, keyboard)
    }
    if (!sent) {
      await tgCall(token, 'sendMessage', { chat_id: adminId, text: caption, reply_markup: keyboard })
    }
  } catch (e) {
    console.error('telegram notifyAdminNewTeacher error', e)
  }
}
