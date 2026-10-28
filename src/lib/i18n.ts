'use client'

import { useApp, Lang } from '@/lib/store'

// ─────────────────────────────────────────────
//  MyTeach — 3 dilli tərcümə lüğəti
// ─────────────────────────────────────────────

export const dict = {
  // ── Naviqasiya / Header ──
  'nav.home': { az: 'Ana səhifə', en: 'Home', ru: 'Главная' },
  'nav.categories': { az: 'Kateqoriyalar', en: 'Categories', ru: 'Категории' },
  'nav.teachers': { az: 'Müəllimlər', en: 'Teachers', ru: 'Учителя' },
  'nav.howItWorks': { az: 'Necə işləyir?', en: 'How it works', ru: 'Как это работает' },
  'nav.faq': { az: 'FAQ', en: 'FAQ', ru: 'Вопросы' },
  'nav.about': { az: 'Haqqımızda', en: 'About us', ru: 'О нас' },
  'nav.contact': { az: 'Əlaqə', en: 'Contact', ru: 'Контакты' },
  'nav.adminPanel': { az: 'Admin panel', en: 'Admin panel', ru: 'Админ панель' },
  'nav.cabinet': { az: 'Şəxsi kabinet', en: 'My cabinet', ru: 'Личный кабинет' },
  'nav.login': { az: 'Daxil ol', en: 'Log in', ru: 'Войти' },
  'nav.register': { az: 'Qeydiyyat', en: 'Sign up', ru: 'Регистрация' },
  'nav.logout': { az: 'Çıxış', en: 'Log out', ru: 'Выйти' },
  'nav.tagline': { az: 'Müəllim və Şagird Platforması', en: 'Teacher & Student Platform', ru: 'Платформа для учителей и учеников' },

  // ── Hero / Ana səhifə ──
  'hero.badge': { az: 'Tam pulsuz platforma', en: '100% free platform', ru: 'Полностью бесплатная платформа' },
  'hero.title1': { az: 'Doğru müəllimi', en: 'Find the right', ru: 'Найдите нужного' },
  'hero.title2': { az: 'bir neçə saniyəyə tap', en: 'teacher in seconds', ru: 'учителя за секунды' },
  'hero.subtitle': {
    az: 'Fənn, sektor, məqsəd və şəhər üzrə təsdiqlənmiş müəllimləri asanlıqla tap. Qeydiyyat şərt deyil — dərhal axtarışa başla!',
    en: 'Easily find verified teachers by subject, sector, goal and city. No registration needed — start searching right away!',
    ru: 'Легко находите проверенных учителей по предмету, сектору, цели и городу. Регистрация не обязательна — начните поиск прямо сейчас!',
  },
  'hero.searchBtn': { az: 'Axtar', en: 'Search', ru: 'Найти' },
  'hero.allSubjects': { az: 'Bütün fənlər', en: 'All subjects', ru: 'Все предметы' },
  'hero.allCities': { az: 'Bütün şəhərlər', en: 'All cities', ru: 'Все города' },
  'hero.popularSearch': { az: 'Populyar:', en: 'Popular:', ru: 'Популярно:' },
  'hero.statTeachers': { az: 'Təsdiqlənmiş müəllim', en: 'Verified teachers', ru: 'Проверенных учителей' },
  'hero.statSubjects': { az: 'Fənn', en: 'Subjects', ru: 'Предметов' },
  'hero.statCities': { az: 'Şəhər', en: 'Cities', ru: 'Городов' },
  'hero.statFree': { az: 'Tam pulsuz', en: 'Completely free', ru: 'Полностью бесплатно' },

  // ── Kateqoriyalar ──
  'cat.subjects': { az: 'Fənn', en: 'Subject', ru: 'Предмет' },
  'cat.sectors': { az: 'Sektor', en: 'Sector', ru: 'Сектор' },
  'cat.purposes': { az: 'Məqsəd', en: 'Goal', ru: 'Цель' },
  'cat.cities': { az: 'Şəhər', en: 'City', ru: 'Город' },
  'cat.title': { az: 'Kateqoriyalar üzrə axtarış', en: 'Browse by category', ru: 'Поиск по категориям' },
  'cat.subtitle': {
    az: 'İstədiyin parametrə görə müəllimləri filtrlə — fənn, sektor, məqsəd və ya şəhər üzrə',
    en: 'Filter teachers by any parameter — subject, sector, goal or city',
    ru: 'Фильтруйте учителей по любому параметру — предмет, сектор, цель или город',
  },
  'cat.popularSubjects': { az: 'Populyar fənlər', en: 'Popular subjects', ru: 'Популярные предметы' },
  'cat.viewAll': { az: 'Hamısına bax', en: 'View all', ru: 'Смотреть все' },
  'cat.teachersCount': { az: 'müəllim', en: 'teachers', ru: 'учителей' },

  // ── Necə işləyir ──
  'how.title': { az: 'Necə işləyir?', en: 'How it works', ru: 'Как это работает' },
  'how.subtitle': {
    az: 'Cəmi 3 sadə addımla doğru müəllimi tap və birbaşa əlaqə saxla',
    en: 'Find the right teacher and contact directly in just 3 simple steps',
    ru: 'Найдите нужного учителя и свяжитесь напрямую всего за 3 простых шага',
  },
  'how.step1.title': { az: 'Axtar və filtrlə', en: 'Search & filter', ru: 'Ищите и фильтруйте' },
  'how.step1.desc': {
    az: 'Fənn, sektor, məqsəd və şəhər üzrə müəllimləri filtrlə. Qeydiyyat tələb olunmur — qonaq kimi də axtara bilərsən.',
    en: 'Filter teachers by subject, sector, goal and city. No registration required — search as a guest.',
    ru: 'Фильтруйте учителей по предмету, сектору, цели и городу. Регистрация не требуется — ищите как гость.',
  },
  'how.step2.title': { az: 'Profili araşdır', en: 'Explore profile', ru: 'Изучите профиль' },
  'how.step2.desc': {
    az: 'Təcrübə ili, saatlıq qiymət, təsdiqlənmiş diplom və başqa şagirdlərin reytləri ilə tanış ol.',
    en: 'Check experience, hourly price, verified diploma and reviews from other students.',
    ru: 'Ознакомьтесь с опытом, ценой за час, проверенным дипломом и отзывами других учеников.',
  },
  'how.step3.title': { az: 'Birbaşa əlaqə saxla', en: 'Contact directly', ru: 'Свяжитесь напрямую' },
  'how.step3.desc': {
    az: 'WhatsApp, telefon və ya e-poçt vasitəsilə birbaşa yaz — sayt vasitəçi olmur, daxili çat yoxdur.',
    en: 'Message directly via WhatsApp, phone or email — no middleman, no internal chat.',
    ru: 'Напишите напрямую через WhatsApp, телефон или почту — без посредников и внутреннего чата.',
  },
  'how.forTeachers': { az: 'Müəllimsiniz?', en: 'Are you a teacher?', ru: 'Вы учитель?' },
  'how.forTeachersDesc': {
    az: 'Profilini yarat, diplomunu yüklə, təsdiqlənməni gözlə və şagirdlərlə birbaşa əlaqə qur. Tam pulsuzdur!',
    en: 'Create your profile, upload your diploma, get verified and connect with students directly. Completely free!',
    ru: 'Создайте профиль, загрузите диплом, пройдите проверку и общайтесь с учениками напрямую. Полностью бесплатно!',
  },
  'how.becomeTeacher': { az: 'Müəllim kimi qeydiyyatdan keç', en: 'Register as a teacher', ru: 'Зарегистрироваться как учитель' },
  'how.teacherSteps': { az: 'Müəllim təsdiqi 2 mərhələli', en: 'Teacher verification has 2 stages', ru: 'Проверка учителя проходит в 2 этапа' },
  'how.stage1': { az: 'Gmail təsdiqi — linkə kliklə', en: 'Gmail verification — click the link', ru: 'Подтверждение Gmail — перейдите по ссылке' },
  'how.stage2': { az: 'Admin panel təsdiqi — diplom yoxlanır', en: 'Admin approval — diploma is checked', ru: 'Одобрение админом — проверка диплома' },

  // ── FAQ ──
  'faq.title': { az: 'Tez-tez verilən suallar', en: 'Frequently asked questions', ru: 'Часто задаваемые вопросы' },
  'faq.subtitle': {
    az: 'Platforma ilə bağlı ən çox soruşulan suallar və cavabları',
    en: 'Most common questions about the platform and their answers',
    ru: 'Самые частые вопросы о платформе и ответы на них',
  },
  'faq.q1': { az: 'Platforma həqiqətən pulsuzdur?', en: 'Is the platform really free?', ru: 'Платформа действительно бесплатная?' },
  'faq.a1': {
    az: 'Bəli! MyTeach tam pulsuzdur — heç bir ödəniş sistemi yoxdur. Müəllim qeydiyyatı, şagird qeydiyyatı, axtarış və əlaqə — hamısı tam pulsuzdur. Müəllimin göstərdiyi qiymət yalnız məlumatdır (saatlıq dərs haqqı göstəricisi), sayt heç bir komissiya almır.',
    en: 'Yes! MyTeach is completely free — there is no payment system at all. Teacher registration, student registration, search and contact — all free. The price shown by a teacher is informational only (hourly lesson rate indicator); the site takes no commission.',
    ru: 'Да! MyTeach полностью бесплатна — никакой системы оплаты нет. Регистрация учителя, регистрация ученика, поиск и связь — всё бесплатно. Цена, указанная учителем, носит информационный характер (показатель стоимости урока в час); сайт не берёт комиссию.',
  },
  'faq.q2': { az: 'Rəy yazmaq üçün qeydiyyat lazımdır?', en: 'Do I need to register to write a review?', ru: 'Нужна ли регистрация для отзыва?' },
  'faq.a2': {
    az: 'Qeydiyyatsız (qonaq kimi) müəllimlərə sərbəst baxa bilərsən. Rəy yazmaq və favorilərə saxlamaq kimi əlavə imkanlar üçün sadə şagird qeydiyyatı kifayətdir — ad, soyad, gmail və telefon.',
    en: 'As a guest you can freely browse teachers. To write reviews and save favorites, a simple student registration is enough — name, surname, gmail and phone.',
    ru: 'Как гость вы можете свободно просматривать учителей. Для отзывов и избранного достаточно простой регистрации ученика — имя, фамилия, gmail и телефон.',
  },
  'faq.q3': { az: 'Müəllim təsdiqi nə qədər vaxt aparır?', en: 'How long does teacher verification take?', ru: 'Сколько занимает проверка учителя?' },
  'faq.a3': {
    az: 'İki mərhələ var: 1) Gmail təsdiqi — qeydiyyatdan dərhal sonra linkə klikləyirsiniz; 2) Admin panel təsdiqi — admin diplomu və məlumatları yoxlayır. Təsdiqlənənə qədər profiliniz saytda gizli qalır.',
    en: 'There are two stages: 1) Gmail verification — click the link right after registration; 2) Admin approval — admin checks your diploma and details. Your profile stays hidden until approved.',
    ru: 'Есть два этапа: 1) Подтверждение Gmail — перейдите по ссылке сразу после регистрации; 2) Одобрение админом — администратор проверяет диплом и данные. Ваш профиль скрыт до одобрения.',
  },
  'faq.q4': { az: 'Müəllimlə necə əlaqə saxlayıram?', en: 'How do I contact a teacher?', ru: 'Как связаться с учителем?' },
  'faq.a4': {
    az: 'Müəllim profilində hansı əlaqə üsullarını göstərəcəyini özü seçir: WhatsApp, telefon və ya e-poçt. Düyməyə klikləyirsiniz və birbaşa yazırsınız — sayt vasitəçi olmur, daxili çat sistemi yoxdur.',
    en: 'The teacher chooses which contact methods to show: WhatsApp, phone or email. Click a button and message directly — no middleman, no internal chat.',
    ru: 'Учитель сам выбирает, какие способы связи показывать: WhatsApp, телефон или почта. Нажмите кнопку и напишите напрямую — без посредников и внутреннего чата.',
  },
  'faq.q5': { az: 'Hansı dillərdə sayt işləyir?', en: 'What languages does the site support?', ru: 'На каких языках работает сайт?' },
  'faq.a5': {
    az: 'Sayt 3 dilli-dir: Azərbaycan dili (əsas), English və Русский. Yuxarıdakı dil dəyişdiricidən istədiyi dili seçə bilərsiniz.',
    en: 'The site supports 3 languages: Azerbaijani (primary), English and Russian. You can pick your language from the switcher at the top.',
    ru: 'Сайт поддерживает 3 языка: азербайджанский (основной), английский и русский. Выберите язык в переключателе вверху.',
  },
  'faq.q6': { az: 'Favorilər nəyə lazımdır?', en: 'What are favorites for?', ru: 'Зачем нужно избранное?' },
  'faq.a6': {
    az: 'Bəyəndiyiniz müəllimləri ürək düyməsi ilə favorilərə əlavə edin — sonra şəxsi kabinetdən bir kliklə onlara qayıdın. Favorilər yalnız qeydiyyatlı şagirdlər üçündür.',
    en: 'Add teachers you like with the heart button and return to them with one click from your cabinet. Favorites are for registered students only.',
    ru: 'Добавляйте понравившихся учителей кнопкой-сердечком и возвращайтесь к ним в один клик из кабинета. Избранное доступно только зарегистрированным ученикам.',
  },

  // ── Haqqımızda ──
  'about.title': { az: 'Haqqımızda', en: 'About us', ru: 'О нас' },
  'about.p1': {
    az: 'MyTeach — şagirdlərin müəllim tapmaqda çətinlik çəkməsini aradan qaldıran platformadır. Biz inanırıq ki, hər şagird özünə uyğun, etibarlı və peşəkar müəllimi bir neçə kliklə tapa bilməlidir.',
    en: 'MyTeach is a platform that eliminates the difficulty of finding teachers. We believe every student should find a suitable, trusted and professional teacher in just a few clicks.',
    ru: 'MyTeach — платформа, которая устраняет трудности поиска учителей. Мы верим, что каждый ученик должен находить подходящего, надёжного и профессионального учителя всего за несколько кликов.',
  },
  'about.p2': {
    az: 'Şagirdlər fənn, sektor, məqsəd və şəhər üzrə müəllimləri asanlıqla tapırlar. Müəllimlər isə öz profillərini yaradaraq xidmətlərini geniş auditoriyaya təqdim edirlər — diplomu admin tərəfindən yoxlanılan yalnız real müəllimlər saytda görünür.',
    en: 'Students easily find teachers by subject, sector, goal and city. Teachers create their profiles and present their services to a wide audience — only real teachers with admin-verified diplomas appear on the site.',
    ru: 'Ученики легко находят учителей по предмету, сектору, цели и городу. Учителя создают профили и представляют свои услуги широкой аудитории — на сайте видны только реальные учителя с дипломами, проверенными администратором.',
  },
  'about.p3': {
    az: 'Platforma tam pulsuzdur — heç bir ödəniş sistemi yoxdur, komissiya yoxdur, gizli ödəniş yoxdur. Missiyamız sadədir: təhsilə çıxışı hər kəs üçün asanlaşdırmaq.',
    en: 'The platform is completely free — no payment system, no commission, no hidden fees. Our mission is simple: make access to education easy for everyone.',
    ru: 'Платформа полностью бесплатна — никакой оплаты, комиссии или скрытых платежей. Наша миссия проста: сделать доступ к образованию лёгким для каждого.',
  },
  'about.mission': { az: 'Missiyamız', en: 'Our mission', ru: 'Наша миссия' },
  'about.missionText': {
    az: 'Hər şagirdə doğru müəllimi tapmaqda kömək etmək, hər müəllimə şagird çatdırmaq — tam pulsuz şəkildə.',
    en: 'Help every student find the right teacher and every teacher reach students — completely free.',
    ru: 'Помочь каждому ученику найти нужного учителя, а каждому учителю — учеников — полностью бесплатно.',
  },
  'about.values': { az: 'Dəyərlərimiz', en: 'Our values', ru: 'Наши ценности' },
  'about.value1': { az: 'Pulsuzluq — ödənişsiz platforma', en: 'Free — no payments at all', ru: 'Бесплатно — без оплаты' },
  'about.value2': { az: 'Etibar — yoxlanmış diplomlar', en: 'Trust — verified diplomas', ru: 'Доверие — проверенные дипломы' },
  'about.value3': { az: 'Sadəlik — birbaşa əlaqə', en: 'Simplicity — direct contact', ru: 'Простота — прямая связь' },

  // ── Əlaqə ──
  'contact.title': { az: 'Əlaqə', en: 'Contact', ru: 'Контакты' },
  'contact.subtitle': {
    az: 'Sualınız var? Bizimlə əlaqə saxlayın — 24 saat içində cavab veririk',
    en: 'Have a question? Contact us — we reply within 24 hours',
    ru: 'Есть вопрос? Свяжитесь с нами — отвечаем в течение 24 часов',
  },
  'contact.email': { az: 'E-poçt', en: 'Email', ru: 'Эл. почта' },
  'contact.phone': { az: 'Telefon', en: 'Phone', ru: 'Телефон' },
  'contact.address': { az: 'Ünvan', en: 'Address', ru: 'Адрес' },
  'contact.addressValue': { az: 'Bakı, Azərbaycan', en: 'Baku, Azerbaijan', ru: 'Баку, Азербайджан' },
  'contact.hours': { az: 'İş saatları', en: 'Working hours', ru: 'Часы работы' },
  'contact.hoursValue': { az: 'Hər gün 09:00 – 20:00', en: 'Every day 09:00 – 20:00', ru: 'Каждый день 09:00 – 20:00' },
  'contact.whatsappCta': { az: 'WhatsApp ilə yaz', en: 'Message on WhatsApp', ru: 'Написать в WhatsApp' },
  'contact.formTitle': { az: 'Mesaj göndər', en: 'Send a message', ru: 'Отправить сообщение' },
  'contact.formName': { az: 'Adınız', en: 'Your name', ru: 'Ваше имя' },
  'contact.formEmail': { az: 'E-poçtunuz', en: 'Your email', ru: 'Ваш e-mail' },
  'contact.formMessage': { az: 'Mesajınız', en: 'Your message', ru: 'Ваше сообщение' },
  'contact.formSend': { az: 'Göndər', en: 'Send', ru: 'Отправить' },
  'contact.formSent': { az: 'Mesajınız göndərildi! Tezliklə cavablanacaq.', en: 'Your message has been sent! We will reply soon.', ru: 'Ваше сообщение отправлено! Мы скоро ответим.' },
  'contact.formNote': {
    az: 'Qeyd: bu demo formadır — mesaj birbaşa göndərilmir. Real əlaqə üçün yuxarıdakı e-poçt və WhatsApp düymələrindən istifadə edin.',
    en: 'Note: this is a demo form — the message is not actually sent. For real contact, use the email and WhatsApp buttons above.',
    ru: 'Примечание: это демо-форма — сообщение реально не отправляется. Для связи используйте кнопки почты и WhatsApp выше.',
  },

  // ── Müəllim kartı / siyahısı ──
  'tcard.hour': { az: '/saat', en: '/hour', ru: '/час' },
  'tcard.years': { az: 'il təcrübə', en: 'yrs experience', ru: 'лет опыта' },
  'tcard.viewProfile': { az: 'Profili gör', en: 'View profile', ru: 'Смотреть профиль' },
  'tcard.noReviews': { az: 'Rəy yoxdur', en: 'No reviews yet', ru: 'Отзывов нет' },
  'tcard.verified': { az: 'Təsdiqlənmiş', en: 'Verified', ru: 'Проверен' },
  'teachers.title': { az: 'Müəllimlər', en: 'Teachers', ru: 'Учителя' },
  'teachers.subtitle': {
    az: 'Filtrləri istifadə edərək özünə uyğun müəllimi tap',
    en: 'Use filters to find the teacher that fits you',
    ru: 'Используйте фильтры, чтобы найти подходящего учителя',
  },
  'teachers.found': { az: 'müəllim tapıldı', en: 'teachers found', ru: 'учителей найдено' },
  'teachers.filters': { az: 'Filtrlər', en: 'Filters', ru: 'Фильтры' },
  'teachers.clearFilters': { az: 'Filtrləri təmizlə', en: 'Clear filters', ru: 'Очистить фильтры' },
  'teachers.sort': { az: 'Sırala', en: 'Sort by', ru: 'Сортировка' },
  'teachers.sortRating': { az: 'Reytinqə görə', en: 'By rating', ru: 'По рейтингу' },
  'teachers.sortPriceAsc': { az: 'Qiymət: ucuzdan', en: 'Price: low to high', ru: 'Цена: сначала дешёвые' },
  'teachers.sortPriceDesc': { az: 'Qiymət: bahadan', en: 'Price: high to low', ru: 'Цена: сначала дорогие' },
  'teachers.sortExperience': { az: 'Təcrübəyə görə', en: 'By experience', ru: 'По опыту' },
  'teachers.minPrice': { az: 'Min qiymət', en: 'Min price', ru: 'Мин. цена' },
  'teachers.maxPrice': { az: 'Maks qiymət', en: 'Max price', ru: 'Макс. цена' },
  'teachers.searchPlaceholder': { az: 'Ad və ya xüsusiyyət axtar...', en: 'Search name or keyword...', ru: 'Поиск по имени или ключ. слову...' },
  'teachers.empty': { az: 'Bu filtrlərə uyğun müəllim tapılmadı', en: 'No teachers found for these filters', ru: 'По этим фильтрам учителей не найдено' },
  'teachers.emptyDesc': {
    az: 'Filtrləri dəyişib yenidən cəhd et və ya bütün müəllimlərə bax',
    en: 'Try changing the filters or browse all teachers',
    ru: 'Попробуйте изменить фильтры или просмотреть всех учителей',
  },
  'teachers.applyBtn': { az: 'Filtrlə', en: 'Apply', ru: 'Применить' },

  // ── Müəllim profili ──
  'tprof.about': { az: 'Haqqında', en: 'About', ru: 'О себе' },
  'tprof.experience': { az: 'Təcrübə', en: 'Experience', ru: 'Опыт' },
  'tprof.contact': { az: 'Əlaqə saxla', en: 'Contact', ru: 'Связаться' },
  'tprof.whatsapp': { az: 'WhatsApp', en: 'WhatsApp', ru: 'WhatsApp' },
  'tprof.call': { az: 'Zəng et', en: 'Call', ru: 'Позвонить' },
  'tprof.email': { az: 'E-poçt', en: 'Email', ru: 'Почта' },
  'tprof.reviews': { az: 'Rəylər', en: 'Reviews', ru: 'Отзывы' },
  'tprof.noReviews': { az: 'Hələ rəy yoxdur', en: 'No reviews yet', ru: 'Пока нет отзывов' },
  'tprof.noReviewsDesc': {
    az: 'Bu müəllim haqqında ilk rəyi sən yaz!',
    en: 'Be the first to review this teacher!',
    ru: 'Будьте первым, кто оставит отзыв об этом учителе!',
  },
  'tprof.writeReview': { az: 'Rəy yaz', en: 'Write a review', ru: 'Написать отзыв' },
  'tprof.loginToReview': { az: 'Rəy yazmaq üçün daxil ol', en: 'Log in to write a review', ru: 'Войдите, чтобы написать отзыв' },
  'tprof.yourRating': { az: 'Reytinqin', en: 'Your rating', ru: 'Ваша оценка' },
  'tprof.yourComment': { az: 'Şərhin', en: 'Your comment', ru: 'Ваш комментарий' },
  'tprof.submitReview': { az: 'Rəyi göndər', en: 'Submit review', ru: 'Отправить отзыв' },
  'tprof.reviewUpdated': { az: 'Rəyin qeydə alındı!', en: 'Review submitted!', ru: 'Отзыв сохранён!' },
  'tprof.ratingBreakdown': { az: 'Reytinq bölgüsü', en: 'Rating breakdown', ru: 'Распределение оценок' },
  'tprof.avgRating': { az: 'orta reytinq', en: 'average rating', ru: 'средний рейтинг' },
  'tprof.memberSince': { az: 'Platformada:', en: 'On platform since:', ru: 'На платформе с:' },
  'tprof.contactNote': {
    az: 'Əlaqə düymələri müəllimin özü tərəfindən seçilib — sayt vasitəçi olmur.',
    en: 'Contact buttons are chosen by the teacher — the site is not a middleman.',
    ru: 'Кнопки связи выбирает сам учитель — сайт не посредник.',
  },
  'tprof.backToList': { az: 'Müəllimlərə qayıt', en: 'Back to teachers', ru: 'Назад к учителям' },
  'tprof.notFound': { az: 'Müəllim tapılmadı', en: 'Teacher not found', ru: 'Учитель не найден' },
  'tprof.loginFirst': { az: 'Əvvəlcə daxil ol', en: 'Log in first', ru: 'Сначала войдите' },
  'tprof.reviewNote': { az: 'Bir müəllimə yalnız bir rəy yaza bilərsən — yenidən yazsan köhnə rəy yenilənir.', en: 'You can write only one review per teacher — writing again updates your old review.', ru: 'На одного учителя можно оставить один отзыв — повторная запись обновит старый.' },

  // ── Dərs forması ──
  'fmt.label': { az: 'Dərs forması', en: 'Lesson format', ru: 'Формат занятий' },
  'fmt.online': { az: 'Online', en: 'Online', ru: 'Онлайн' },
  'fmt.inPerson': { az: 'Üz-üzə', en: 'In person', ru: 'Лично' },
  'fmt.both': { az: 'Online + Üz-üzə', en: 'Online + In person', ru: 'Онлайн + Лично' },
  'fmt.any': { az: 'Hamısı', en: 'Any format', ru: 'Любой' },

  // ── Təsdiq nişanları ──
  'ver.teacher': { az: 'Təsdiqlənmiş müəllim', en: 'Verified teacher', ru: 'Проверенный учитель' },
  'ver.diplomaApproved': { az: 'Diplomu təsdiqlənib', en: 'Diploma verified', ru: 'Диплом подтверждён' },
  'ver.diplomaPending': { az: 'Diplom yoxlanılır', en: 'Diploma under review', ru: 'Диплом проверяется' },

  // ── Şikayət ──
  'report.button': { az: 'Şikayət et', en: 'Report', ru: 'Жалоба' },
  'report.title': { az: 'Müəllimə şikayət', en: 'Report teacher', ru: 'Жалоба на учителя' },
  'report.reason': { az: 'Səbəb', en: 'Reason', ru: 'Причина' },
  'report.reasonFake': { az: 'Yalançı / saxta profil', en: 'Fake profile', ru: 'Фейковый профиль' },
  'report.reasonPrice': { az: 'Elanla uyğunsuz ödəniş tələbi', en: 'Pricing differs from the listing', ru: 'Цена не соответствует объявлению' },
  'report.reasonOffensive': { az: 'Uyğunsuz məzmun və ya davranış', en: 'Inappropriate content or behavior', ru: 'Недопустимый контент или поведение' },
  'report.reasonOther': { az: 'Digər', en: 'Other', ru: 'Другое' },
  'report.comment': { az: 'Ətraflı izah (isteğe bağlı)', en: 'Details (optional)', ru: 'Подробности (необязательно)' },
  'report.submit': { az: 'Şikayəti göndər', en: 'Submit report', ru: 'Отправить жалобу' },
  'report.sent': { az: 'Şikayətin qeydə alındı — təşəkkürlər!', en: 'Report received — thank you!', ru: 'Жалоба принята — спасибо!' },
  'report.done': { az: 'Həll edildi', en: 'Resolved', ru: 'Решено' },
  'report.empty': { az: 'Açıq şikayət yoxdur', en: 'No open reports', ru: 'Нет открытых жалоб' },

  // ── Ödəniş təhlükəsizliyi ──
  'safety.title': { az: 'Ödənişi əvvəlcədən etməyin!', en: 'Do not pay in advance!', ru: 'Не платите вперёд!' },
  'safety.text': {
    az: 'MyTeach ödənişlərə vasitəçilik etmir. Müəllimi yaxşı yoxla, ilk dərsi keçir və yalnız sonra irəli ödəniş et — zərərçəkən olma.',
    en: 'MyTeach does not handle payments. Check the teacher carefully, take the first lesson, and only then pay ahead — stay safe.',
    ru: 'MyTeach не участвует в оплатах. Проверьте учителя, проведите первый урок и только потом платите вперёд — будьте осторожны.',
  },

  // ── Rəylər ──
  'rev.anonymous': { az: 'Anonim', en: 'Anonymous', ru: 'Аноним' },

  // ── Qeydiyyat / Login ──
  'auth.loginTitle': { az: 'Daxil ol', en: 'Log in', ru: 'Вход' },
  'auth.loginSubtitle': { az: 'Hesabına daxil ol — favorilər və rəylər səni gözləyir', en: 'Log in to your account — favorites and reviews await', ru: 'Войдите в аккаунт — избранное и отзывы ждут вас' },
  'auth.studentRegTitle': { az: 'Şagird qeydiyyatı', en: 'Student registration', ru: 'Регистрация ученика' },
  'auth.studentRegSubtitle': { az: 'Sadə qeydiyyat — favori saxla, rəy yaz', en: 'Simple registration — save favorites, write reviews', ru: 'Простая регистрация — сохраняйте избранное, пишите отзывы' },
  'auth.name': { az: 'Ad', en: 'First name', ru: 'Имя' },
  'auth.surname': { az: 'Soyad', en: 'Surname', ru: 'Фамилия' },
  'auth.email': { az: 'Gmail ünvanı', en: 'Gmail address', ru: 'Gmail адрес' },
  'auth.phone': { az: 'Telefon nömrəsi', en: 'Phone number', ru: 'Номер телефона' },
  'auth.password': { az: 'Şifrə', en: 'Password', ru: 'Пароль' },
  'auth.loginBtn': { az: 'Daxil ol', en: 'Log in', ru: 'Войти' },
  'auth.registerBtn': { az: 'Qeydiyyatdan keç', en: 'Register', ru: 'Зарегистрироваться' },
  'auth.noAccount': { az: 'Hesabın yoxdur?', en: "Don't have an account?", ru: 'Нет аккаунта?' },
  'auth.haveAccount': { az: 'Hesabın var?', en: 'Already have an account?', ru: 'Уже есть аккаунт?' },
  'auth.registerStudent': { az: 'Şagird kimi qeydiyyat', en: 'Register as student', ru: 'Регистрация как ученик' },
  'auth.registerTeacher': { az: 'Müəllim kimi qeydiyyat', en: 'Register as teacher', ru: 'Регистрация как учитель' },
  'auth.welcomeBack': { az: 'Xoş gəlmisiniz!', en: 'Welcome back!', ru: 'С возвращением!' },
  'auth.welcome': { az: 'Qeydiyyat tamamlandı!', en: 'Registration complete!', ru: 'Регистрация завершена!' },
  'auth.verifyDialog': { az: 'Gmail təsdiqi', en: 'Gmail verification', ru: 'Подтверждение Gmail' },
  'auth.verifyDialogText': {
    az: 'Gmail ünvanına təsdiqlənmə linki göndərildi. Demo mühitində real e-poçt göndərilmir — aşağıdakı düymə ilə təsdiqləyə bilərsən.',
    en: 'A verification link has been sent to your Gmail. In this demo no real email is sent — you can verify with the button below.',
    ru: 'Ссылка для подтверждения отправлена на ваш Gmail. В демо-режиме письмо реально не отправляется — подтвердите кнопкой ниже.',
  },
  'auth.openVerifyLink': { az: 'Təsdiqlənmə linkini aç', en: 'Open verification link', ru: 'Открыть ссылку подтверждения' },
  'auth.later': { az: 'Sonra', en: 'Later', ru: 'Позже' },
  'auth.phoneHint': { az: 'Məs: +994 50 123 45 67', en: 'E.g.: +994 50 123 45 67', ru: 'Напр.: +994 50 123 45 67' },
  'auth.googleHint': { az: 'Qeydiyyat üçün Gmail ünvanından istifadə et', en: 'Use a Gmail address to register', ru: 'Для регистрации используйте Gmail адрес' },

  // ── Müəllim qeydiyyatı ──
  'treg.title': { az: 'Müəllim qeydiyyatı', en: 'Teacher registration', ru: 'Регистрация учителя' },
  'treg.subtitle': {
    az: 'Profilini yarat, diplomunu yüklə — təsdiqləndikdən sonra şagirdlər səni tapacaq. Tam pulsuzdur!',
    en: 'Create your profile, upload your diploma — students will find you after verification. Completely free!',
    ru: 'Создайте профиль, загрузите диплом — после проверки ученики вас найдут. Полностью бесплатно!',
  },
  'treg.sectionPersonal': { az: 'Şəxsi məlumatlar', en: 'Personal information', ru: 'Личные данные' },
  'treg.sectionProfessional': { az: 'Peşəkar məlumatlar', en: 'Professional information', ru: 'Профессиональные данные' },
  'treg.sectionContactPref': { az: 'Əlaqə üsulları', en: 'Contact methods', ru: 'Способы связи' },
  'treg.diploma': { az: 'Diplom (sənəd / şəkil)', en: 'Diploma (document / image)', ru: 'Диплом (документ / фото)' },
  'treg.diplomaHint': { az: 'PDF, JPG və ya PNG — maksimum 5MB. Admin tərəfindən yoxlanır.', en: 'PDF, JPG or PNG — max 5MB. Checked by admin.', ru: 'PDF, JPG или PNG — макс. 5MB. Проверяется админом.' },
  'treg.experience': { az: 'Təcrübə ili', en: 'Years of experience', ru: 'Стаж (лет)' },
  'treg.experienceHint': { az: 'Neçə ildir müəllimlik edirsən?', en: 'How many years have you been teaching?', ru: 'Сколько лет вы преподаёте?' },
  'treg.price': { az: 'Qiymət (saatlıq, AZN)', en: 'Price (hourly, AZN)', ru: 'Цена (за час, AZN)' },
  'treg.priceHint': { az: 'Yalnız məlumat göstəricisidir — sayt ödəniş almır', en: 'Informational only — the site takes no payment', ru: 'Только информационно — сайт не берёт оплату' },
  'treg.bio': { az: 'Özün haqqında', en: 'About yourself', ru: 'О себе' },
  'treg.bioPlaceholder': {
    az: 'Təcrübən, metodikan, nailiyyətlərin haqqında qısa yaz...',
    en: 'Briefly write about your experience, methods, achievements...',
    ru: 'Кратко напишите о своём опыте, методах, достижениях...',
  },
  'treg.subject': { az: 'Fənn *', en: 'Subject *', ru: 'Предмет *' },
  'treg.sector': { az: 'Sektor', en: 'Sector', ru: 'Сектор' },
  'treg.purpose': { az: 'Məqsəd', en: 'Goal', ru: 'Цель' },
  'treg.city': { az: 'Şəhər *', en: 'City *', ru: 'Город *' },
  'treg.contactPrefHint': {
    az: 'Hansı əlaqə üsullarını göstərmək istəyirsən? Birini, bir neçəsini və ya hamısını seçə bilərsən.',
    en: 'Which contact methods do you want to show? Choose one, several or all.',
    ru: 'Какие способы связи показывать? Выберите один, несколько или все.',
  },
  'treg.showWhatsapp': { az: 'WhatsApp göstər', en: 'Show WhatsApp', ru: 'Показать WhatsApp' },
  'treg.showPhone': { az: 'Telefon göstər', en: 'Show phone', ru: 'Показать телефон' },
  'treg.showEmail': { az: 'E-poçt göstər', en: 'Show email', ru: 'Показать почту' },
  'treg.whatsappNumber': { az: 'WhatsApp nömrəsi', en: 'WhatsApp number', ru: 'Номер WhatsApp' },
  'treg.submit': { az: 'Qeydiyyatı tamamla', en: 'Complete registration', ru: 'Завершить регистрацию' },
  'treg.submitting': { az: 'Göndərilir...', en: 'Submitting...', ru: 'Отправка...' },
  'treg.success': { az: 'Müraciətin qeydə alındı!', en: 'Application received!', ru: 'Заявка принята!' },
  'treg.successDesc': {
    az: 'Gmail təsdiqindən sonra admin panelində profili yoxlanılacaq. Təsdiqlənənə qədər profilin gizli qalır.',
    en: 'After Gmail verification, admin will check your profile. It stays hidden until approved.',
    ru: 'После подтверждения Gmail администратор проверит ваш профиль. Он скрыт до одобрения.',
  },
  'treg.selectPlaceholder': { az: 'Seç...', en: 'Select...', ru: 'Выберите...' },
  'treg.fileSelected': { az: 'Fayl seçildi', en: 'File selected', ru: 'Файл выбран' },
  'treg.chooseFile': { az: 'Diplomu yüklə', en: 'Upload diploma', ru: 'Загрузить диплом' },

  // ── Şəxsi kabinet ──
  'cab.title': { az: 'Şəxsi kabinet', en: 'My cabinet', ru: 'Личный кабинет' },
  'cab.student': { az: 'Şagird', en: 'Student', ru: 'Ученик' },
  'cab.teacher': { az: 'Müəllim', en: 'Teacher', ru: 'Учитель' },
  'cab.admin': { az: 'Admin', en: 'Admin', ru: 'Администратор' },
  'cab.guest': { az: 'Qonaq', en: 'Guest', ru: 'Гость' },
  'cab.loginRequired': { az: 'Daxil olun', en: 'Please log in', ru: 'Требуется вход' },
  'cab.loginRequiredDesc': {
    az: 'Şəxsi kabinetə daxil olmaq üçün hesabına giriş et',
    en: 'Log in to your account to access the cabinet',
    ru: 'Войдите в свой аккаунт для доступа к кабинету',
  },
  'cab.myInfo': { az: 'Məlumatlarım', en: 'My info', ru: 'Мои данные' },
  'cab.myFavorites': { az: 'Favorilərim', en: 'My favorites', ru: 'Моё избранное' },
  'cab.myReviews': { az: 'Rəylərim', en: 'My reviews', ru: 'Мои отзывы' },
  'cab.noFavorites': { az: 'Favori yoxdur', en: 'No favorites yet', ru: 'Пока нет избранного' },
  'cab.noFavoritesDesc': {
    az: 'Müəllim kartlarındakı ürək düyməsi ilə favorilərə əlavə et',
    en: 'Add teachers to favorites with the heart button on cards',
    ru: 'Добавляйте учителей в избранное кнопкой-сердечком',
  },
  'cab.browseTeachers': { az: 'Müəllimlərə bax', en: 'Browse teachers', ru: 'Смотреть учителей' },
  'cab.noReviewsYet': { az: 'Hələ rəy yazmamısan', en: "You haven't written any reviews yet", ru: 'Вы ещё не написали отзывов' },
  'cab.emailVerified': { az: 'E-poçt təsdiqlənib', en: 'Email verified', ru: 'Почта подтверждена' },
  'cab.emailNotVerified': { az: 'E-poçt təsdiqlənməyib', en: 'Email not verified', ru: 'Почта не подтверждена' },
  'cab.resendVerify': { az: 'Təsdiq linkini göstər', en: 'Show verification link', ru: 'Показать ссылку подтверждения' },
  'cab.editProfile': { az: 'Profili redaktə et', en: 'Edit profile', ru: 'Редактировать профиль' },
  'cab.save': { az: 'Yadda saxla', en: 'Save', ru: 'Сохранить' },
  'cab.saved': { az: 'Yadda saxlanıldı!', en: 'Saved!', ru: 'Сохранено!' },
  'cab.cancel': { az: 'Ləğv et', en: 'Cancel', ru: 'Отмена' },
  'cab.newPassword': { az: 'Yeni şifrə (istəyə bağlı)', en: 'New password (optional)', ru: 'Новый пароль (необязательно)' },

  // ── Müəllim statusu ──
  'tstat.title': { az: 'Müəllim profili statusu', en: 'Teacher profile status', ru: 'Статус профиля учителя' },
  'tstat.step1': { az: 'Qeydiyyat', en: 'Registration', ru: 'Регистрация' },
  'tstat.step2': { az: 'Gmail təsdiqi', en: 'Gmail verification', ru: 'Подтверждение Gmail' },
  'tstat.step3': { az: 'Admin təsdiqi', en: 'Admin approval', ru: 'Одобрение админа' },
  'tstat.step4': { az: 'Saytda görünür', en: 'Visible on site', ru: 'Виден на сайте' },
  'tstat.PENDING': { az: 'Gmail təsdiqi gözlənilir', en: 'Waiting for Gmail verification', ru: 'Ожидает подтверждения Gmail' },
  'tstat.WAITING_ADMIN': { az: 'Admin təsdiqi gözlənilir', en: 'Waiting for admin approval', ru: 'Ожидает одобрения админа' },
  'tstat.APPROVED': { az: 'Təsdiqlənib — profili saytda görünür', en: 'Approved — profile is visible', ru: 'Одобрен — профиль виден' },
  'tstat.REJECTED': { az: 'Rədd edilib — məlumatları yeniləyib yenidən göndər', en: 'Rejected — update your info and resubmit', ru: 'Отклонён — обновите данные и отправьте снова' },
  'tstat.pendingNote': {
    az: 'Təsdiqlənənə qədər profilin saytda gizli qalır. Admin diplomu və məlumatları yoxlayır.',
    en: 'Your profile stays hidden until approved. Admin checks your diploma and details.',
    ru: 'Ваш профиль скрыт до одобрения. Администратор проверяет диплом и данные.',
  },
  'tstat.noProfile': { az: 'Müəllim profili tapılmadı', en: 'Teacher profile not found', ru: 'Профиль учителя не найден' },

  // ── Admin panel ──
  'adm.title': { az: 'Admin panel', en: 'Admin panel', ru: 'Админ панель' },
  'adm.subtitle': { az: 'Sistemi idarə et — müəllimləri təsdiqlə, istifadəçiləri idarə et', en: 'Manage the system — approve teachers, manage users', ru: 'Управляйте системой — одобряйте учителей, управляйте пользователями' },
  'adm.noAccess': { az: 'Giriş qadağandır', en: 'Access denied', ru: 'Доступ запрещён' },
  'adm.noAccessDesc': { az: 'Bu bölmə yalnız adminlər üçündür', en: 'This section is for admins only', ru: 'Этот раздел только для администраторов' },
  'adm.statTeachers': { az: 'Təsdiqlənmiş müəllim', en: 'Approved teachers', ru: 'Одобренные учителя' },
  'adm.statStudents': { az: 'Şagird', en: 'Students', ru: 'Ученики' },
  'adm.statPending': { az: 'Gözləyən təsdiq', en: 'Pending approvals', ru: 'Ожидают одобрения' },
  'adm.statReviews': { az: 'Rəy', en: 'Reviews', ru: 'Отзывы' },
  'adm.tabPending': { az: 'Gözləyən müəllimlər', en: 'Pending teachers', ru: 'Ожидающие учителя' },
  'adm.tabUsers': { az: 'İstifadəçilər', en: 'Users', ru: 'Пользователи' },
  'adm.tabCategories': { az: 'Kateqoriyalar', en: 'Categories', ru: 'Категории' },
  'adm.tabReviews': { az: 'Rəylər', en: 'Reviews', ru: 'Отзывы' },
  'adm.tabReports': { az: 'Şikayətlər', en: 'Reports', ru: 'Жалобы' },
  'adm.approve': { az: 'Təsdiqlə', en: 'Approve', ru: 'Одобрить' },
  'adm.reject': { az: 'Rədd et', en: 'Reject', ru: 'Отклонить' },
  'adm.viewDiploma': { az: 'Diploma bax', en: 'View diploma', ru: 'Посмотреть диплом' },
  'adm.noDiploma': { az: 'Diplom yüklənməyib', en: 'No diploma uploaded', ru: 'Диплом не загружен' },
  'adm.noPending': { az: 'Gözləyən müraciət yoxdur', en: 'No pending applications', ru: 'Нет ожидающих заявок' },
  'adm.noPendingDesc': { az: 'Bütün müəllim müraciətləri işlənib', en: 'All teacher applications are processed', ru: 'Все заявки учителей обработаны' },
  'adm.block': { az: 'Blokla', en: 'Block', ru: 'Заблокировать' },
  'adm.unblock': { az: 'Blokdan çıxar', en: 'Unblock', ru: 'Разблокировать' },
  'adm.delete': { az: 'Sil', en: 'Delete', ru: 'Удалить' },
  'adm.edit': { az: 'Dəyiş', en: 'Edit', ru: 'Изменить' },
  'adm.blocked': { az: 'Bloklanıb', en: 'Blocked', ru: 'Заблокирован' },
  'adm.active': { az: 'Aktiv', en: 'Active', ru: 'Активен' },
  'adm.addCategory': { az: 'Kateqoriya əlavə et', en: 'Add category', ru: 'Добавить категорию' },
  'adm.editCategory': { az: 'Redaktə et', en: 'Edit', ru: 'Редактировать' },
  'adm.nameAz': { az: 'Ad (AZ)', en: 'Name (AZ)', ru: 'Название (AZ)' },
  'adm.nameEn': { az: 'Ad (EN)', en: 'Name (EN)', ru: 'Название (EN)' },
  'adm.nameRu': { az: 'Ad (RU)', en: 'Name (RU)', ru: 'Название (RU)' },
  'adm.addBtn': { az: 'Əlavə et', en: 'Add', ru: 'Добавить' },
  'adm.deleteCategoryWarn': { az: 'İstifadə olunan kateqoriya silinə bilməz', en: 'A category in use cannot be deleted', ru: 'Используемую категорию нельзя удалить' },
  'adm.deleteReviewConfirm': { az: 'Bu rəyi silmək istədiyinizə əminsiniz?', en: 'Are you sure you want to delete this review?', ru: 'Вы уверены, что хотите удалить этот отзыв?' },
  'adm.status': { az: 'Status', en: 'Status', ru: 'Статус' },
  'adm.role': { az: 'Rol', en: 'Role', ru: 'Роль' },
  'adm.joined': { az: 'Qeydiyyat tarixi', en: 'Joined', ru: 'Дата регистрации' },
  'adm.actions': { az: 'Əməliyyatlar', en: 'Actions', ru: 'Действия' },
  'adm.PENDING': { az: 'Gmail gözləyir', en: 'Waiting Gmail', ru: 'Ждёт Gmail' },
  'adm.WAITING_ADMIN': { az: 'Admin təsdiqi gözləyir', en: 'Waiting admin', ru: 'Ждёт админа' },
  'adm.APPROVED': { az: 'Təsdiqlənib', en: 'Approved', ru: 'Одобрен' },
  'adm.REJECTED': { az: 'Rədd edilib', en: 'Rejected', ru: 'Отклонён' },
  'adm.experienceCol': { az: 'Təcrübə', en: 'Experience', ru: 'Опыт' },
  'adm.priceCol': { az: 'Qiymət', en: 'Price', ru: 'Цена' },
  'adm.done': { az: 'Hazırdır!', en: 'Done!', ru: 'Готово!' },

  // ── Footer ──
  'footer.description': {
    az: 'Şagirdlər doğru müəllimi tapır, müəllimlər şagirdlərlə birbaşa əlaqə qurur. Tam pulsuz platforma.',
    en: 'Students find the right teacher, teachers connect with students directly. Completely free platform.',
    ru: 'Ученики находят нужного учителя, учителя связываются с учениками напрямую. Полностью бесплатная платформа.',
  },
  'footer.pages': { az: 'Səhifələr', en: 'Pages', ru: 'Страницы' },
  'footer.categories': { az: 'Kateqoriyalar', en: 'Categories', ru: 'Категории' },
  'footer.forTeachers': { az: 'Müəllimlər üçün', en: 'For teachers', ru: 'Для учителей' },
  'footer.becomeTeacher': { az: 'Müəllim kimi qeydiyyat', en: 'Register as teacher', ru: 'Стать учителем' },
  'footer.howItWorks': { az: 'Necə işləyir?', en: 'How it works', ru: 'Как это работает' },
  'footer.free': { az: 'Tam pulsuzdur — ödəniş sistemi yoxdur', en: 'Completely free — no payment system', ru: 'Полностью бесплатно — без оплаты' },
  'footer.copyright': { az: 'Bütün hüquqlar qorunur', en: 'All rights reserved', ru: 'Все права защищены' },
  'footer.contact': { az: 'Əlaqə', en: 'Contact', ru: 'Контакты' },
  'footer.info': { az: 'İnformasiya', en: 'Information', ru: 'Информация' },

  // ── Ümumi ──
  'common.loading': { az: 'Yüklənir...', en: 'Loading...', ru: 'Загрузка...' },
  'common.error': { az: 'Xəta baş verdi', en: 'An error occurred', ru: 'Произошла ошибка' },
  'common.retry': { az: 'Yenidən cəhd et', en: 'Retry', ru: 'Попробовать снова' },
  'common.close': { az: 'Bağla', en: 'Close', ru: 'Закрыть' },
  'common.save': { az: 'Yadda saxla', en: 'Save', ru: 'Сохранить' },
  'common.cancel': { az: 'Ləğv et', en: 'Cancel', ru: 'Отмена' },
  'common.confirm': { az: 'Təsdiqlə', en: 'Confirm', ru: 'Подтвердить' },
  'common.required': { az: 'mütləqdir', en: 'required', ru: 'обязательно' },
  'common.browseTeachers': { az: 'Müəllimlərə bax', en: 'Browse teachers', ru: 'Смотреть учителей' },
  'common.browseCategories': { az: 'Kateqoriyalara bax', en: 'Browse categories', ru: 'Смотреть категории' },
  'common.all': { az: 'Hamısı', en: 'All', ru: 'Все' },
  'common.of': { az: '/', en: 'of', ru: 'из' },
  'common.showMore': { az: 'Daha çox', en: 'Show more', ru: 'Показать больше' },

  // ── Toast mesajları ──
  'toast.loginSuccess': { az: 'Uğurla daxil oldunuz!', en: 'Logged in successfully!', ru: 'Вход выполнен!' },
  'toast.logoutSuccess': { az: 'Çıxış edildi', en: 'Logged out', ru: 'Вы вышли' },
  'toast.verifySuccess': { az: 'E-poçt uğurla təsdiqləndi!', en: 'Email verified successfully!', ru: 'Почта успешно подтверждена!' },
  'toast.verifyFail': { az: 'Təsdiq alınmadı — link etibarsızdır', en: 'Verification failed — invalid link', ru: 'Не удалось подтвердить — ссылка недействительна' },
  'toast.favoriteAdded': { az: 'Favorilərə əlavə olundu', en: 'Added to favorites', ru: 'Добавлено в избранное' },
  'toast.favoriteRemoved': { az: 'Favorilərdən silindi', en: 'Removed from favorites', ru: 'Удалено из избранного' },
  'toast.loginForFavorites': { az: 'Favorilər üçün əvvəlcə daxil ol', en: 'Log in first to use favorites', ru: 'Для избранного сначала войдите' },
  'toast.contactCopied': { az: 'Əlaqə məlumatı kopyalandı', en: 'Contact info copied', ru: 'Контакт скопирован' },
} as const

export type DictKey = keyof typeof dict

export function useT() {
  const lang = useApp((s) => s.lang)
  return (key: DictKey): string => {
    const entry = dict[key]
    return entry ? entry[lang as Lang] ?? entry.az : key
  }
}

export function getCategoryName(
  cat: { nameAz: string; nameEn: string; nameRu: string } | null | undefined,
  lang: Lang
): string {
  if (!cat) return ''
  if (lang === 'en') return cat.nameEn
  if (lang === 'ru') return cat.nameRu
  return cat.nameAz
}
