# MyTeach — Müəllim və Şagird Platforması

MyTeach — şagirdlərin müəllim tapmaqda çətinlik çəkməsini aradan qaldıran **tam pulsuz** platforma. Şagirdlər fənn, sektor, məqsəd və şəhər üzrə müəllimləri asanlıqla tapırlar. Müəllimlər isə öz profillərini yaradaraq xidmətlərini təqdim edirlər.

> Platforma **TAM PULSUZDUR** — heç bir ödəniş sistemi yoxdur. Müəllimin qeyd etdiyi "qiymət" yalnız məlumatdır (saatlıq dərs haqqı göstəricisi).

Saytda ikon kitabxanası və emoji **istifadə olunmur** — bütün vizual elementlər (ulduz reytinqi, favori ürəyi, tik işarələri, chevron-lar) saf CSS ilə qurulub.

---

## Xüsusiyyətlər

### İstifadəçi rolları
| Rol | İmkanlar |
|---|---|
| **Qonaq** | Qeydiyyatsız müəllimlərə sərbəst baxış, filtrlər, axtarış |
| **Şagird** | Favorilərə saxlama, 5 ulduzlu reytinq + rəy yazma |
| **Müəllim** | Profil yaratma, diplom yükləmə, əlaqə üsullarını seçmə |
| **Admin** | Bütün sistemi idarə etmə, müəllimləri təsdiqləmə |

### Müəllim təsdiqi (2 mərhələli)
1. **Gmail təsdiqi** — qeydiyyatdan sonra linkə klik
2. **Admin panel təsdiqi** — admin diplomu və məlumatları yoxlayır

Təsdiqlənənə qədər müəllimin profili saytda **gizli** qalır.

### Kateqoriyalar
- **Fənn** — İngilis dili, Riyaziyyat, Azərbaycan dili və s. (12 əvvəlcədən yüklü)
- **Sektor** — Məktəb, Lisey, Kollec, Universitet
- **Məqsəd** — Buraxılış imtahanı, Magistratura hazırlığı, Danışıq dili və s.
- **Şəhər** — Bakı, Gəncə, Sumqayıt və s.

### Əlaqə sistemi
Müəllim profilində hansı əlaqə üsullarını göstərəcəyini **özü seçir**:
- WhatsApp (birbaşa yazışma — `wa.me` linki)
- Telefon (birbaşa zəng — `tel:` linki)
- E-poçt (`mailto:` linki)

Sayt vasitəçi olmur — **daxili çat sistemi yoxdur**.

### Dillər
Azərbaycan (əsas) • English • Русский — yuxarıdakı dil dəyişdirici ilə bütün UI tərcümə olunur.

### Admin panel
- Statistika: müəllim, şagird, gözləyən təsdiq, rəy sayı
- Gözləyən müəllim qeydiyyatları + diplom sənədinə baxış + Təsdiqlə / Rədd
- İstifadəçi idarəetməsi (blokla, blokdan çıxar, sil)
- Kateqoriya idarəetməsi (3 dildə əlavə et / redaktə et / sil)
- Rəylərin idarəsi (uyğunsuz rəyi silmək)

---

## Texnologiyalar

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** (shadcn/ui əsaslı komponentlər)
- **Prisma ORM** + **SQLite** (istənilən anada köçürülə bilər)
- **Zustand** — state idarəetmə
- Heç bir ödəniş / API açarı tələb olunmur

---

## Lokal quraşdırma

```bash
# 1. Repoyu klonla
git clone https://github.com/edalet1883/MyTeach.git
cd MyTeach

# 2. Asılılıqları quraşdır (npm və ya bun)
npm install

# 3. .env faylını hazırla
cp .env.example .env

# 4. Baza sxemasını yüklə + başlanğıc məlumatlar (kateqoriyalar, admin, demo)
npx prisma db push
npm run seed

# 5. Başlat
npm run dev
```

Sayt `http://localhost:3000` ünvanında işləyəcək.

### Demo hesablar

| Rol | E-poçt | Şifrə |
|---|---|---|
| Admin | `admin@myteach.az` | `admin123` |
| Şagird | `aysel@demo.az` | `student123` |
| Müəllim | `fidan@demo.az` | `teacher123` |

---

## Render-də yerləşdirmə (deploy)

Bu layihə **Render.com** üçün hazırdır (`render.yaml` Blueprint daxildir).

### Avtomatik (Blueprint ilə)
1. GitHub-da `edalet1883/MyTeach` reposunda kod olsun
2. [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**
3. `edalet1883/MyTeach` reposunu seçin → **Apply**
4. Render `render.yaml`-ə görə servisi qurur:
   - **Build:** `npm install && npm run build` (prisma generate + db push + seed + next build)
   - **Start:** `node .next/standalone/server.js`
   - **DATABASE_URL:** `file:./db/custom.db` (avtomatik təyin olunur)

### Öz domen: myteach.dpdns.org
1. Render Dashboard → `myteach` servisi → **Settings** → **Custom Domains** → **Add Custom Domain**
2. `myteach.dpdns.org` yazın və təsdiqləyin
3. dpdns.org DNS idarəetmə panelində **CNAME** qeydi əlavə edin:

   | Növ | Ad / Host | Dəyər / Target |
   |---|---|---|
   | CNAME | `myteach` (və ya `@`) | `myteach.onrender.com` |

   *(Render sizə dəqiq CNAME dəyərini Custom Domains bölməsində göstərir — həmin dəyəri köçürün. DNS yayılması 5–30 dəqiqə çəkə bilər.)*
4. Render sertifikatı (TLS) avtomatik yaradır.

### Qeydlər
- Render **free** planında fayl sistemi müvəqqətidir: hər deploy-da SQLite bazası sıfırdan seed olunur. Bəxş istifadəçi məlumatlarının qalıcı olması üçün Render-də ödənişli **Disk** əlavə edib `DATABASE_URL=file:/var/data/myteach.db` yazın, və ya PostgreSQL-ə keçid edin (`prisma/schema.prisma`-da `provider`-ı dəyişin).
- E-poçt göndərişi hazırda simulyasiya olunur (aşağıya baxın).

---

## E-poçt təsdiqi haqqında

Bu layihə demo rejimində **real e-poçt göndərmir**. Qeydiyyatdan sonra API təsdiq linkini (`/?verify=TOKEN`) qaytarır və sayt istifadəçiyə "Təsdiqlənmə linkini aç" düyməsi göstərir.

**Real Gmail göndərmək üçün** (production):
1. `nodemailer` quraşdırın: `npm install nodemailer`
2. `src/app/api/auth/register/route.ts` və `register-teacher/route.ts` fayllarında `verifyUrl` qaytaran yerdə e-poçt göndərmə əlavə edin:

```ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
})

await transporter.sendMail({
  from: process.env.GMAIL_USER,
  to: user.email,
  subject: 'MyTeach — təsdiqlənmə linki',
  html: `<a href="${baseUrl}/?verify=${verifyToken}">E-poçtunuzu təsdiqləyin</a>`,
})
```

3. `.env` faylında (və Render env var-larında) `GMAIL_USER` və `GMAIL_APP_PASSWORD` (Google App Password) təyin edin.

---

## Layihə strukturu

```
render.yaml                # Render Blueprint (deploy konfiqurasiyası)
.env.example              # Mühit dəyişənləri nümunəsi
prisma/schema.prisma      # User, TeacherProfile, Subject/Sector/Purpose/City, Review, Favorite
prisma/seed.ts            # Başlanğıc məlumatlar (kateqoriyalar, admin, demo müəllimlər)
src/lib/auth.ts           # Sessiya (HMAC token + httpOnly cookie), şifrə hash
src/lib/i18n.ts           # 3 dilli tərcümə lüğəti (AZ/EN/RU)
src/lib/store.ts          # Zustand store (view router, auth, dil, filtrlər)
src/app/api/
  auth/                   # register, register-teacher, login, verify, me, logout
  teachers/               # siyahı+filtrlər, [id] detallar, apply (öz profili)
  categories/             # bütün kateqoriyalar
  reviews/                # rəy yaz (yalnız şagird)
  favorites/              # favori toggle + siyahı
  my-reviews/             # şagirdin öz rəyləri
  admin/                  # stats, pending, teacher-action, users, categories, reviews
src/components/myteach/   # Header, Footer, TeacherCard, StarRating (saf CSS)
src/components/myteach/views/  # home, categories, teachers, teacher-detail,
                               # profile (kabinet), admin, auth, teacher-register, info
src/app/page.tsx          # SPA shell — bütün "tablar" burada yönləndirilir
```

---

## Təhlükəsizlik qeydləri (production üçün)

- Şifrələr SHA-256 + secret ilə hash-lənir — production-da `bcrypt`-ə keçmək tövsiyə olunur
- `AUTH_SECRET` dəyişkənini öz gizli açarınızla əvəz edin
- SQLite → PostgreSQL/MySQL-ə keçid üçün sadəcə `prisma/schema.prisma`-da `provider`-ı dəyişin
- Diplom faylları `public/uploads/diplomas/` qovluğunda saxlanılır — production-da S3/Cloudinary istifadə edin
