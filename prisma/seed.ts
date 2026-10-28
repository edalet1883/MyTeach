/* MyTeach — başlanğıc məlumatları */
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const db = new PrismaClient()
const SECRET = 'myteach-dev-secret-key-2026'
const hash = (p: string) => crypto.createHash('sha256').update(p + SECRET).digest('hex')

async function main() {
  console.log('Seeding...')

  // ── Kateqoriyalar ──
  const subjectsData = [
    { nameAz: 'İngilis dili', nameEn: 'English', nameRu: 'Английский язык' },
    { nameAz: 'Riyaziyyat', nameEn: 'Mathematics', nameRu: 'Математика' },
    { nameAz: 'Azərbaycan dili', nameEn: 'Azerbaijani language', nameRu: 'Азербайджанский язык' },
    { nameAz: 'Fizika', nameEn: 'Physics', nameRu: 'Физика' },
    { nameAz: 'Kimya', nameEn: 'Chemistry', nameRu: 'Химия' },
    { nameAz: 'Biologiya', nameEn: 'Biology', nameRu: 'Биология' },
    { nameAz: 'Tarix', nameEn: 'History', nameRu: 'История' },
    { nameAz: 'Coğrafiya', nameEn: 'Geography', nameRu: 'География' },
    { nameAz: 'Rus dili', nameEn: 'Russian language', nameRu: 'Русский язык' },
    { nameAz: 'İnformatika', nameEn: 'Computer science', nameRu: 'Информатика' },
    { nameAz: 'Alman dili', nameEn: 'German', nameRu: 'Немецкий язык' },
    { nameAz: 'Türk dili', nameEn: 'Turkish', nameRu: 'Турецкий язык' },
    { nameAz: 'Fransız dili', nameEn: 'French', nameRu: 'Французский язык' },
  ]
  const sectorsData = [
    { nameAz: 'Məktəb', nameEn: 'School', nameRu: 'Школа' },
    { nameAz: 'Lisey', nameEn: 'Lyceum', nameRu: 'Лицей' },
    { nameAz: 'Kollec', nameEn: 'College', nameRu: 'Колледж' },
    { nameAz: 'Universitet', nameEn: 'University', nameRu: 'Университет' },
  ]
  const purposesData = [
    { nameAz: 'Buraxılış imtahanı', nameEn: 'Graduation exam', nameRu: 'Выпускной экзамен' },
    { nameAz: 'Magistratura hazırlığı', nameEn: 'Master’s preparation', nameRu: 'Подготовка в магистратуру' },
    { nameAz: 'Danışıq dili', nameEn: 'Speaking practice', nameRu: 'Разговорная речь' },
    { nameAz: 'Məktəb proqramı', nameEn: 'School curriculum', nameRu: 'Школьная программа' },
    { nameAz: 'Beynəlxalq imtahanlar', nameEn: 'International exams', nameRu: 'Международные экзамены' },
    { nameAz: 'Dövlət qulluğu imtahanı', nameEn: 'Civil service exam', nameRu: 'Госслужба экзамен' },
  ]
  const citiesData = [
    { nameAz: 'Bakı', nameEn: 'Baku', nameRu: 'Баку' },
    { nameAz: 'Gəncə', nameEn: 'Ganja', nameRu: 'Гянджа' },
    { nameAz: 'Sumqayıt', nameEn: 'Sumgait', nameRu: 'Сумгаит' },
    { nameAz: 'Mingəçevir', nameEn: 'Mingachevir', nameRu: 'Мингечевир' },
    { nameAz: 'Şəki', nameEn: 'Sheki', nameRu: 'Шеки' },
    { nameAz: 'Lənkəran', nameEn: 'Lankaran', nameRu: 'Ленкорань' },
    { nameAz: 'Naxçıvan', nameEn: 'Nakhchivan', nameRu: 'Нахчыван' },
  ]

  // Kateqoriyalar — idempotent (mövcud bazada yalnız əskiklər yaradılır)
  const subjects: Record<string, string> = {}
  for (const s of subjectsData) {
    const found = await db.subject.findFirst({ where: { nameAz: s.nameAz } })
    const c = found ?? (await db.subject.create({ data: s }))
    subjects[s.nameAz] = c.id
  }

  const teacherCount = await db.teacherProfile.count()
  if (teacherCount > 0) {
    console.log('Demo müəllimlər artıq mövcuddur — seed qismən atlanır.')
    await seedAdminOnly()
    return
  }

  const sectors: Record<string, string> = {}
  for (const s of sectorsData) {
    const found = await db.sector.findFirst({ where: { nameAz: s.nameAz } })
    const c = found ?? (await db.sector.create({ data: s }))
    sectors[s.nameAz] = c.id
  }
  const purposes: Record<string, string> = {}
  for (const p of purposesData) {
    const found = await db.purpose.findFirst({ where: { nameAz: p.nameAz } })
    const c = found ?? (await db.purpose.create({ data: p }))
    purposes[p.nameAz] = c.id
  }
  const cities: Record<string, string> = {}
  for (const c of citiesData) {
    const found = await db.city.findFirst({ where: { nameAz: c.nameAz } })
    const r = found ?? (await db.city.create({ data: c }))
    cities[c.nameAz] = r.id
  }

  await seedAdminOnly()

  // ── Demo şagirdlər ──
  const studentsData = [
    { name: 'Aysel', surname: 'Məmmədova', email: 'aysel@demo.az', phone: '+994501110011' },
    { name: 'Rəşad', surname: 'Əliyev', email: 'reshad@demo.az', phone: '+994501110022' },
    { name: 'Nurlan', surname: 'Həsənli', email: 'nurlan@demo.az', phone: '+994501110033' },
    { name: 'Leyla', surname: 'Quliyeva', email: 'leyla@demo.az', phone: '+994501110044' },
    { name: 'Ülvi', surname: 'Kərimov', email: 'ulvi@demo.az', phone: '+994501110055' },
    { name: 'Zəhra', surname: 'Verdiyeva', email: 'zahra@demo.az', phone: '+994501110066' },
    { name: 'Murad', surname: 'Səmədov', email: 'murad@demo.az', phone: '+994501110077' },
    { name: 'Ayxan', surname: 'Tağızadə', email: 'ayxan@demo.az', phone: '+994501110088' },
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
      name: 'Fidan', surname: 'Abdullayeva', email: 'fidan@demo.az', phone: '+994551111001',
      experienceYears: 8, pricePerHour: 25, subject: 'İngilis dili', sector: 'Universitet', purpose: 'Beynəlxalq imtahanlar', city: 'Bakı',
      bio: 'IELTS 8.5 balına malik təcrübəli ingilis dili müəllimiyəm. 8 ildir beynəlxalq imtahanlara hazırlaşıram. Dərslərim interaktiv metodika ilə keçirilir — qrammatika, danışıq və yazı bacarıqları ayrı-ayrı işlənir.',
      showWhatsapp: true, showPhone: true, showEmail: true,
      whatsapp: '+994551111001',
      reviews: [5, 5, 4, 5, 5],
    },
    {
      name: 'Elvin', surname: 'Rəhimov', email: 'elvin@demo.az', phone: '+994551111002',
      experienceYears: 12, pricePerHour: 30, subject: 'Riyaziyyat', sector: 'Lisey', purpose: 'Buraxılış imtahanı', city: 'Bakı',
      bio: '12 illik təcrübəyə malik riyaziyyat müəllimiyəm. Buraxılış və qəbul imtahanlarına hazırlıq üzrə yüzlərlə uğur hekayəsi. Mürəkkəb mövzuları sadə dillə izah etmək mənim istiqamətimdir.',
      showWhatsapp: true, showPhone: true, showEmail: false,
      whatsapp: '+994551111002',
      reviews: [5, 4, 5, 5],
    },
    {
      name: 'Günel', surname: 'İsmayılova', email: 'gunel@demo.az', phone: '+994551111003',
      experienceYears: 6, pricePerHour: 20, subject: 'Azərbaycan dili', sector: 'Məktəb', purpose: 'Buraxılış imtahanı', city: 'Sumqayıt',
      bio: 'Azərbaycan dili və ədəbiyyat müəllimiyəm. Buraxılış imtahanına hazırlıqda konkret nəticəyə yönəlmiş proqramla işləyirəm. Hər dərsdə sınaq yazıları və təhlil aparılır.',
      showWhatsapp: true, showPhone: false, showEmail: true,
      whatsapp: '+994551111003',
      reviews: [5, 5, 5],
    },
    {
      name: 'Kamran', surname: 'Cəfərov', email: 'kamran@demo.az', phone: '+994551111004',
      experienceYears: 10, pricePerHour: 28, subject: 'Fizika', sector: 'Universitet', purpose: 'Magistratura hazırlığı', city: 'Gəncə',
      bio: 'Fizika üzrə fəlsəfə doktoru. Magistratura hazırlığı və universitet kursları üzrə dərslər keçirirəm. Problem həll etmə metodikası ilə tələbələrimin 90%-i müvəffəqiyyət qazanıb.',
      showWhatsapp: false, showPhone: true, showEmail: true,
      reviews: [4, 5, 4],
    },
    {
      name: 'Səbinə', surname: 'Hüseynova', email: 'sabina@demo.az', phone: '+994551111005',
      experienceYears: 5, pricePerHour: 22, subject: 'İngilis dili', sector: 'Məktəb', purpose: 'Danışıq dili', city: 'Bakı',
      bio: 'Danışıq dili üzrə intensiv dərslər. Nerələrin qorxusunu aradan qaldırıram — hər dərs real ssenarilər üzərində qurulur. Uşaqlar və yeniyetmələr üçün xüsusi proqramlarım var.',
      showWhatsapp: true, showPhone: true, showEmail: false,
      whatsapp: '+994551111005',
      reviews: [5, 4],
    },
    {
      name: 'Orxan', surname: 'Mikayılov', email: 'orxan@demo.az', phone: '+994551111006',
      experienceYears: 15, pricePerHour: 35, subject: 'Kimya', sector: 'Lisey', purpose: 'Buraxılış imtahanı', city: 'Bakı',
      bio: '15 illik təcrübə, kimya üzrə metodikaçı. Təcrübəli eksperimentlərlə mövzuları vizuallaşdırıram. Buraxılış imtahanının bütün bölmələri üzrə systematik hazırlıq proqramım mövcuddur.',
      showWhatsapp: true, showPhone: false, showEmail: true,
      whatsapp: '+994551111006',
      reviews: [5, 5, 5, 4, 5],
    },
    {
      name: 'Nərmin', surname: 'Səfərova', email: 'nermin@demo.az', phone: '+994551111007',
      experienceYears: 7, pricePerHour: 18, subject: 'Rus dili', sector: 'Məktəb', purpose: 'Məktəb proqramı', city: 'Sumqayıt',
      bio: 'Rus dili müəllimiyəm. Məktəb proqramı ilə paralel olaraq danışıq və qrammatika bacarıqlarını inkişaf etdirirəm. Ev tapşırıqlarına sistemli yanaşma.',
      showWhatsapp: true, showPhone: true, showEmail: false,
      whatsapp: '+994551111007',
      reviews: [4, 4, 5],
    },
    {
      name: 'Tural', surname: 'Bəkirov', email: 'tural@demo.az', phone: '+994551111008',
      experienceYears: 9, pricePerHour: 26, subject: 'Tarix', sector: 'Universitet', purpose: 'Dövlət qulluğu imtahanı', city: 'Gəncə',
      bio: 'Tarix üzrə dosent. Dövlət qulluğu və magistratura imtahanlarına hazırlıq. Xronologiya və hadisələri yadda saxlamaq üçün xüsusi mnemotexnikalar tətbiq edirəm.',
      showWhatsapp: true, showPhone: true, showEmail: true,
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
      },
    })
    const profile = await db.teacherProfile.create({
      data: {
        userId: user.id,
        bio: td.bio,
        experienceYears: td.experienceYears,
        pricePerHour: td.pricePerHour,
        status: 'APPROVED',
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
      sectorId: sectors['Məktəb'],
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
