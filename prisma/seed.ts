/* MyTeach — başlanğıc məlumatları */
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { subjectsData, citiesData } from './data'

const db = new PrismaClient()
const SECRET = 'myteach-dev-secret-key-2026'
const hash = (p: string) => crypto.createHash('sha256').update(p + SECRET).digest('hex')

async function main() {
  console.log('Seeding...')

  // ── Kateqoriyalar ──
  // subjectsData və citiesData prisma/data.ts-dən (tutor.az əsaslı tam siyahı) — syncGroup artıq category sahəsini də sinxron edir
  const sectorsData = [
    { nameAz: 'Uşaq bağçası', nameEn: 'Preschool', nameRu: 'Детский сад' },
    { nameAz: 'İbtidai', nameEn: 'Primary school', nameRu: 'Начальная школа' },
    { nameAz: '9 illik', nameEn: '9-year school', nameRu: '9-летняя школа' },
    { nameAz: '11 illik', nameEn: '11-year school', nameRu: '11-летняя школа' },
    { nameAz: 'Universitet', nameEn: 'University', nameRu: 'Университет' },
    { nameAz: 'Magistratura', nameEn: "Master's", nameRu: 'Магистратура' },
    { nameAz: 'Doktorantura', nameEn: 'Doctoral studies', nameRu: 'Докторантура' },
  ]
  const purposesData = [
    { nameAz: 'Buraxılış imtahanı', nameEn: 'Graduation exam', nameRu: 'Выпускной экзамен' },
    { nameAz: 'Magistratura hazırlığı', nameEn: 'Master’s preparation', nameRu: 'Подготовка в магистратуру' },
    { nameAz: 'Danışıq dili', nameEn: 'Speaking practice', nameRu: 'Разговорная речь' },
    { nameAz: 'Məktəb proqramı', nameEn: 'School curriculum', nameRu: 'Школьная программа' },
    { nameAz: 'Beynəlxalq imtahanlar', nameEn: 'International exams', nameRu: 'Международные экзамены' },
    { nameAz: 'Dövlət qulluğu imtahanı', nameEn: 'Civil service exam', nameRu: 'Госслужба экзамен' },
  ]
  // citiesData prisma/data.ts-dən import olunur (tutor.az əsaslı 25 şəhər)

  // ── Kateqoriyaların sinxronizasiyası — HƏR deployda işə düşür (demo müəllim olsa belə) ──
  // Baza köhnə/yarımçıq adlarla qalsa belə, kanonik 3 dilli siyahıya gətirilir.
  async function syncGroup(
    table: 'subject' | 'sector' | 'purpose' | 'city',
    list: { nameAz: string; nameEn: string; nameRu: string; category?: string }[],
  ): Promise<Record<string, string>> {
    const model = db[table] as unknown as {
      findFirst(args: { where: { nameAz: string } }): Promise<{ id: string; nameEn: string; nameRu: string; category?: string | null } | null>
      create(args: { data: Record<string, unknown> }): Promise<{ id: string }>
      update(args: { where: { id: string }; data: Record<string, unknown> }): Promise<unknown>
      deleteMany(args: { where: { nameAz: { notIn: string[] } } }): Promise<unknown>
    }
    const ids: Record<string, string> = {}
    for (const item of list) {
      const extra = table === 'subject' ? { category: item.category ?? 'other' } : {}
      const found = await model.findFirst({ where: { nameAz: item.nameAz } })
      if (found) {
        if (found.nameEn !== item.nameEn || found.nameRu !== item.nameRu || (table === 'subject' && found.category !== (item.category ?? 'other'))) {
          await model.update({ where: { id: found.id }, data: { nameEn: item.nameEn, nameRu: item.nameRu, ...extra } })
        }
        ids[item.nameAz] = found.id
      } else {
        const c = await model.create({ data: { ...item, ...extra } })
        ids[item.nameAz] = c.id
      }
    }
    try {
      await model.deleteMany({ where: { nameAz: { notIn: list.map((i) => i.nameAz) } } })
    } catch {
      // İstifadə olunur (FK) — saxlanılır
    }
    return ids
  }

  const subjects = await syncGroup('subject', subjectsData)
  const sectors = await syncGroup('sector', sectorsData)
  const purposes = await syncGroup('purpose', purposesData)
  const cities = await syncGroup('city', citiesData)

  // ── Köhnə sektor adlarından kanonik bölmələrə bir dəfəlik köçürmə (idempotent) ──
  const legacySectorMap: Record<string, string> = {
    'Məktəb': '11 illik',
    'Lisey': '11 illik',
    'Kollec': 'Universitet',
    'Baxçaya qədər': 'Uşaq bağçası',
    'Dil': 'Universitet',
    'IELTS': 'Universitet',
  }
  for (const [oldName, newName] of Object.entries(legacySectorMap)) {
    const targetId = sectors[newName]
    if (!targetId) continue
    const old = await db.sector.findFirst({ where: { nameAz: oldName } }).catch(() => null)
    if (!old || old.id === targetId) continue
    try {
      await db.teacherProfile.updateMany({ where: { sectorId: old.id }, data: { sectorId: targetId } })
      await db.sector.delete({ where: { id: old.id } })
    } catch {
      // saxlanılır
    }
  }

  const teacherCount = await db.teacherProfile.count()
  if (teacherCount > 0) {
    console.log('Demo müəllimlər artıq mövcuddur — seed qismən atlanır.')
    // Köhnə demo profilləri yeni sahələrlə tamamla (idempotent)
    const legacy = await db.teacherProfile.findMany({
      where: { diplomaUrl: null },
      orderBy: { createdAt: 'asc' },
    })
    const cycle = ['BOTH', 'ONLINE', 'IN_PERSON']
    for (let i = 0; i < legacy.length; i++) {
      await db.teacherProfile.update({
        where: { id: legacy[i].id },
        data: {
          diplomaUrl: '/uploads/diplomas/demo-diploma.pdf',
          lessonFormats: cycle[i % cycle.length],
        },
      })
    }
    await seedAdminOnly()
    return
  }

  await seedAdminOnly()

  // ── Demo şagirdlər ──
  const studentsData = [
    { name: 'Aysel', surname: 'Məmmədova', email: 'aysel@demo.az', phone: '+994501110011', gender: 'FEMALE', age: 16 },
    { name: 'Rəşad', surname: 'Əliyev', email: 'reshad@demo.az', phone: '+994501110022', gender: 'MALE', age: 17 },
    { name: 'Nurlan', surname: 'Həsənli', email: 'nurlan@demo.az', phone: '+994501110033', gender: 'MALE', age: 19 },
    { name: 'Leyla', surname: 'Quliyeva', email: 'leyla@demo.az', phone: '+994501110044', gender: 'FEMALE', age: 15 },
    { name: 'Ülvi', surname: 'Kərimov', email: 'ulvi@demo.az', phone: '+994501110055', gender: 'MALE', age: 23 },
    { name: 'Zəhra', surname: 'Verdiyeva', email: 'zahra@demo.az', phone: '+994501110066', gender: 'FEMALE', age: 14 },
    { name: 'Murad', surname: 'Səmədov', email: 'murad@demo.az', phone: '+994501110077', gender: 'MALE', age: 18 },
    { name: 'Ayxan', surname: 'Tağızadə', email: 'ayxan@demo.az', phone: '+994501110088', gender: 'MALE', age: 20 },
  ]
  const studentIds: string[] = []
  for (const s of studentsData) {
    const u = await db.user.create({
      data: { ...s, password: hash('student123'), role: 'STUDENT', emailVerified: true },
    })
    studentIds.push(u.id)
  }

  // ── Demo müəllimlər (təsdiqlənmiş) ──
  const teachersData = [
    {
      name: 'Fidan', surname: 'Abdullayeva', email: 'fidan@demo.az', phone: '+994551111001', gender: 'FEMALE', age: 32,
      experienceYears: 8, pricePerHour: 25, pricePeriod: 'HOUR', subject: 'İngilis dili', sector: 'Universitet', purpose: 'Beynəlxalq imtahanlar', city: 'Bakı',
      isVip: true, groupLessons: true, groupPrice: 15,
      bio: 'IELTS 8.5 balına malik təcrübəli ingilis dili müəllimiyəm. 8 ildir beynəlxalq imtahanlara hazırlaşıram. Dərslərim interaktiv metodika ilə keçirilir — qrammatika, danışıq və yazı bacarıqları ayrı-ayrı işlənir.',
      showWhatsapp: true, showPhone: true, showEmail: true,
      lessonFormats: 'BOTH',
      whatsapp: '+994551111001',
      reviews: [5, 5, 4, 5, 5],
    },
    {
      name: 'Elvin', surname: 'Rəhimov', email: 'elvin@demo.az', phone: '+994551111002', gender: 'MALE', age: 41,
      experienceYears: 12, pricePerHour: 30, pricePeriod: 'HOUR', subject: 'Riyaziyyat', sector: '11 illik', purpose: 'Buraxılış imtahanı', city: 'Bakı',
      bio: '12 illik təcrübəyə malik riyaziyyat müəllimiyəm. Buraxılış və qəbul imtahanlarına hazırlıq üzrə yüzlərlə uğur hekayəsi. Mürəkkəb mövzuları sadə dillə izah etmək mənim istiqamətimdir.',
      showWhatsapp: true, showPhone: true, showEmail: false,
      lessonFormats: 'IN_PERSON',
      whatsapp: '+994551111002',
      reviews: [5, 4, 5, 5],
    },
    {
      name: 'Günel', surname: 'İsmayılova', email: 'gunel@demo.az', phone: '+994551111003', gender: 'FEMALE', age: 29,
      experienceYears: 6, pricePerHour: 20, pricePeriod: 'HOUR', subject: 'Azərbaycan dili', sector: '9 illik', purpose: 'Buraxılış imtahanı', city: 'Sumqayıt',
      bio: 'Azərbaycan dili və ədəbiyyat müəllimiyəm. Buraxılış imtahanına hazırlıqda konkret nəticəyə yönəlmiş proqramla işləyirəm. Hər dərsdə sınaq yazıları və təhlil aparılır.',
      showWhatsapp: true, showPhone: false, showEmail: true,
      lessonFormats: 'BOTH',
      whatsapp: '+994551111003',
      reviews: [5, 5, 5],
    },
    {
      name: 'Kamran', surname: 'Cəfərov', email: 'kamran@demo.az', phone: '+994551111004', gender: 'MALE', age: 45,
      experienceYears: 10, pricePerHour: 500, pricePeriod: 'MONTH', subject: 'Fizika', sector: 'Universitet', purpose: 'Magistratura hazırlığı', city: 'Gəncə',
      bio: 'Fizika üzrə fəlsəfə doktoru. Magistratura hazırlığı və universitet kursları üzrə dərslər keçirirəm. Problem həll etmə metodikası ilə tələbələrimin 90%-i müvəffəqiyyət qazanıb.',
      showWhatsapp: false, showPhone: true, showEmail: true,
      lessonFormats: 'ONLINE',
      reviews: [4, 5, 4],
    },
    {
      name: 'Səbinə', surname: 'Hüseynova', email: 'sabina@demo.az', phone: '+994551111005', gender: 'FEMALE', age: 26,
      experienceYears: 5, pricePerHour: 22, pricePeriod: 'HOUR', subject: 'İngilis dili', sector: '9 illik', purpose: 'Danışıq dili', city: 'Bakı',
      groupLessons: true, groupPrice: 12,
      bio: 'Danışıq dili üzrə intensiv dərslər. Nerələrin qorxusunu aradan qaldırıram — hər dərs real ssenarilər üzərində qurulur. Uşaqlar və yeniyetmələr üçün xüsusi proqramlarım var.',
      showWhatsapp: true, showPhone: true, showEmail: false,
      lessonFormats: 'ONLINE',
      whatsapp: '+994551111005',
      reviews: [5, 4],
    },
    {
      name: 'Orxan', surname: 'Mikayılov', email: 'orxan@demo.az', phone: '+994551111006', gender: 'MALE', age: 38,
      experienceYears: 15, pricePerHour: 35, pricePeriod: 'HOUR', subject: 'Kimya', sector: '11 illik', purpose: 'Buraxılış imtahanı', city: 'Bakı',
      isVip: true,
      bio: '15 illik təcrübə, kimya üzrə metodikaçı. Təcrübəli eksperimentlərlə mövzuları vizuallaşdırıram. Buraxılış imtahanının bütün bölmələri üzrə systematik hazırlıq proqramım mövcuddur.',
      showWhatsapp: true, showPhone: false, showEmail: true,
      lessonFormats: 'IN_PERSON',
      whatsapp: '+994551111006',
      reviews: [5, 5, 5, 4, 5],
    },
    {
      name: 'Nərmin', surname: 'Səfərova', email: 'nermin@demo.az', phone: '+994551111007', gender: 'FEMALE', age: 31,
      experienceYears: 7, pricePerHour: 18, pricePeriod: 'HOUR', subject: 'Rus dili', sector: 'İbtidai', purpose: 'Məktəb proqramı', city: 'Sumqayıt',
      bio: 'Rus dili müəllimiyəm. Məktəb proqramı ilə paralel olaraq danışıq və qrammatika bacarıqlarını inkişaf etdirirəm. Ev tapşırıqlarına sistemli yanaşma.',
      showWhatsapp: true, showPhone: true, showEmail: false,
      lessonFormats: 'BOTH',
      whatsapp: '+994551111007',
      reviews: [4, 4, 5],
    },
    {
      name: 'Tural', surname: 'Bəkirov', email: 'tural@demo.az', phone: '+994551111008', gender: 'MALE', age: 52,
      experienceYears: 9, pricePerHour: 4800, pricePeriod: 'YEAR', subject: 'Tarix', sector: 'Doktorantura', purpose: 'Dövlət qulluğu imtahanı', city: 'Gəncə',
      bio: 'Tarix üzrə dosent. Dövlət qulluğu və magistratura imtahanlarına hazırlıq. Xronologiya və hadisələri yadda saxlamaq üçün xüsusi mnemotexnikalar tətbiq edirəm.',
      showWhatsapp: true, showPhone: true, showEmail: true,
      lessonFormats: 'BOTH',
      whatsapp: '+994551111008',
      reviews: [5, 4, 4],
    },
  ]

  let si = 0
  for (const td of teachersData) {
    const user = await db.user.create({
      data: {
        name: td.name, surname: td.surname, email: td.email, phone: td.phone,
        password: hash('teacher123'), role: 'TEACHER', emailVerified: true,
        gender: td.gender ?? null, age: td.age ?? null,
      },
    })
    const profile = await db.teacherProfile.create({
      data: {
        userId: user.id,
        bio: td.bio,
        experienceYears: td.experienceYears,
        pricePerHour: td.pricePerHour,
        pricePeriod: td.pricePeriod ?? 'HOUR',
        status: 'APPROVED',
        diplomaUrl: '/uploads/diplomas/demo-diploma.pdf',
        lessonFormats: td.lessonFormats ?? 'BOTH',
        isVip: td.isVip ?? false,
        groupLessons: td.groupLessons ?? false,
        groupPrice: td.groupPrice ?? null,
        subjectId: subjects[td.subject],
        sectorId: sectors[td.sector],
        purposeId: purposes[td.purpose],
        cityId: cities[td.city],
        whatsapp: td.whatsapp ?? null,
        phoneContact: td.phone,
        emailContact: td.email,
        showWhatsapp: td.showWhatsapp,
        showPhone: td.showPhone,
        showEmail: td.showEmail,
      },
    })
    // Rəylər
    for (const rating of td.reviews) {
      const studentId = studentIds[si % studentIds.length]
      si++
      await db.review.create({
        data: {
          teacherId: profile.id,
          studentId,
          rating,
          comment:
            rating >= 5
              ? 'Əla müəllimdir! Mövzuları çox aydın izah edir, nəticəni qısa müddətdə gördüm. Hər kəsə tövsiyə edirəm.'
              : rating === 4
                ? 'Dərslər məhsuldardır, müəllim peşəkardır. Qiymət-keyfiyyət nisbəti əlverişlidir.'
                : 'Normal dərslərdir, amma gözlədiyimdən biraz fərqli idi.',
        },
      })
    }
  }

  // ── Gözləyən müəllim (admin panel testi üçün) ──
  const pendingUser = await db.user.create({
    data: {
      name: 'Zaur', surname: 'Xəlilov', email: 'zaur@demo.az', phone: '+994551111009',
      password: hash('teacher123'), role: 'TEACHER', emailVerified: true,
    },
  })
  await db.teacherProfile.create({
    data: {
      userId: pendingUser.id,
      bio: 'İnformatika müəllimiyəm. Proqramlaşdırma (Python, C++) və məktəb informatika kursları üzrə dərslər keçirirəm. Diplomum əlavə olunub, təsdiq gözləyirəm.',
      experienceYears: 4,
      pricePerHour: 24,
      status: 'WAITING_ADMIN',
      subjectId: subjects['İnformatika'],
      sectorId: sectors['11 illik'],
      purposeId: purposes['Məktəb proqramı'],
      cityId: cities['Bakı'],
      whatsapp: '+994551111009',
      phoneContact: '+994551111009',
      emailContact: 'zaur@demo.az',
      showWhatsapp: true,
      showPhone: true,
      showEmail: false,
    },
  })

  console.log('Seed tamamlandı!')
  console.log('Admin: admin@myteach.az / admin123')
  console.log('Shagird: aysel@demo.az / student123')
  console.log('Muellim: fidan@demo.az / teacher123')
}

async function seedAdminOnly() {
  const adminExists = await db.user.findUnique({ where: { email: 'admin@myteach.az' } })
  if (!adminExists) {
    const SECRET = 'myteach-dev-secret-key-2026'
    const hash = (p: string) => crypto.createHash('sha256').update(p + SECRET).digest('hex')
    await db.user.create({
      data: {
        name: 'Admin',
        surname: 'MyTeach',
        email: 'admin@myteach.az',
        phone: '+994500000000',
        password: hash('admin123'),
        role: 'ADMIN',
        emailVerified: true,
      },
    })
    console.log('Admin yaradıldı: admin@myteach.az / admin123')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
