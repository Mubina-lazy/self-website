const SUPABASE_URL = 'https://abllpxqkyqebtawzwtrd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFibGxweHFreXFlYnRhd3p3dHJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyOTc4NTYsImV4cCI6MjA5Njg3Mzg1Nn0.5mEXCmxz2-QBSGuL3dodLNOesVTivAexo9yUIkihmVc';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const CHALLENGES = [
  { day:  1, icon: '🌸', title: 'Shukrona',      desc: 'Bugun hayotingda 3 ta yaxshi narsani yoz' },
  { day:  2, icon: '💧', title: 'Suv',            desc: 'Kamida 8 stakan suv ich' },
  { day:  3, icon: '🧘', title: 'Meditatsiya',    desc: '10 daqiqa jim o\'tir, faqat nafas ol' },
  { day:  4, icon: '📚', title: 'Kitob',          desc: '20 daqiqa kitob o\'qi' },
  { day:  5, icon: '🌿', title: 'Sayr',           desc: '15 daqiqa tashqarida sayr qil' },
  { day:  6, icon: '📵', title: 'Detox',          desc: '1 soat telefonsiz o\'tir' },
  { day:  7, icon: '🍳', title: 'Yangi taom',     desc: 'Yangi retsept bo\'yicha taom pishir' },
  { day:  8, icon: '💌', title: 'Do\'st',          desc: 'Uzoq ko\'rmagan do\'stingga xabar yoz' },
  { day:  9, icon: '✍️', title: 'Yangi so\'z',    desc: 'Yangi so\'z o\'rgan va kunida ishlatib ko\'r' },
  { day: 10, icon: '📋', title: 'Reja',           desc: 'Ertangi kunning rejasini yoz' },
  { day: 11, icon: '💝', title: 'O\'zingni sev',  desc: '5 ta yaxshi fazilatingni yoz' },
  { day: 12, icon: '🧹', title: 'Tartib',         desc: 'Xonangning bir burchagini tartibga keltir' },
  { day: 13, icon: '🎨', title: 'Ijod',           desc: 'Rasm chiz, qo\'shiq ayt yoki she\'r yoz' },
  { day: 14, icon: '🤝', title: 'Yaxshilik',      desc: 'Birovga kutilmagan yaxshilik qil' },
  { day: 15, icon: '🎉', title: 'Yarim yo\'l!',   desc: '15 kun o\'tdi — o\'zingni tabriklash vaqti' },
  { day: 16, icon: '🌅', title: 'Erta tur',       desc: 'Odatdagidan 30 daqiqa ertaroq tur' },
  { day: 17, icon: '🏃', title: 'Harakat',        desc: '15 daqiqa jismoniy faoliyat: yugur, raqs, o\'yna' },
  { day: 18, icon: '🔍', title: 'Yangi janr',     desc: 'Hech o\'qimagan janrdagi kitob tanlap ko\'r' },
  { day: 19, icon: '🎙️', title: 'Podcast',       desc: 'Rivojlanish haqidagi podcast tinglang' },
  { day: 20, icon: '🌟', title: 'Maqsad',         desc: '1 oylik maqsadingni yoz va tasavvur qil' },
  { day: 21, icon: '🥗', title: 'Sog\'lom ovqat', desc: 'Bugun faqat uyda tayyorlangan taom ye' },
  { day: 22, icon: '💡', title: 'Yangi mahorat',  desc: 'YouTube dan yangi bir narsa o\'rgan' },
  { day: 23, icon: '📓', title: 'Jurnal',         desc: 'Bugungi his-tuyg\'ularingni batafsil yoz' },
  { day: 24, icon: '✨', title: 'Ilhom',          desc: 'Seni ilhomlantirgan odamga maqtov yoz' },
  { day: 25, icon: '☀️', title: 'Tabiat',         desc: '30 daqiqa tashqarida o\'tir, osmonga qara' },
  { day: 26, icon: '🎵', title: 'Musiqa',         desc: 'Sevimli qo\'shig\'ingga to\'liq quloq sol' },
  { day: 27, icon: '🕊️', title: 'Kechirish',     desc: 'Birovni yoki o\'zingni yurakdan kechir' },
  { day: 28, icon: '🌷', title: 'Yordam',         desc: 'Oila yoki do\'stingga kutilmagan joyda yordam ber' },
  { day: 29, icon: '📷', title: 'Xotira',         desc: 'Eng baxtli xotirangni yoz yoki rasmga ol' },
  { day: 30, icon: '🏆', title: 'BARAKALLA!',     desc: '30 kunlik challengeni yakladingiz! Siz ajoyibsiz 🌸' },
];

// ═══════════════════════════════════════════════
// INSPIRATION POOL — 3-4 responses per mood×topic
// ═══════════════════════════════════════════════
const INSP_POOL = {
  happy: {
    self: [
      { e:'🌸', t:'Bugun sen porlab turibsan — bu yorug\'lik sen ichingdan chiqyapti! O\'zingni bugungi holatingda sevib, bu energiyani atrofingga ham tarqat. Sening tabassuming birovning kunini o\'zgartirishi mumkin.', p:'Bugun o\'zingda nima yoqadi? 3 ta yozing.' },
      { e:'💫', t:'Baxtli bo\'lish — bu senga loyiq! Ko\'pchilik uni qidiradi, sen esa hozir his qilayapsan. Bu lahzani to\'liq qabul qil. O\'zing bilan faxrlan — sen buni yutib oldingiz.', p:'"Bugun men o\'zimni ... his qilayapman, chunki..." — deb yozing.' },
      { e:'🦋', t:'Har kuni eng yaxshi versiyangga aylanyapsan — bugun shu yo\'ldasan. Baxtli ekanligingda ham o\'sish davom etadi. Sen — har kuni yangilanayotgan chiroyli odam.', p:'Bir yil oldingizdan qanday o\'zgarib ketganingizni yozing.' },
      { e:'🌺', t:'Kichik narsalarda ham baxt topish — bu katta mahorat. Sen uni egallagan odam. Bugun shu ko\'zlar bilan dunyon qanchalik go\'zal ekanini ko\'r.', p:'Bugun eng kichik, lekin sevimli narsangni yozing.' },
    ],
    goals: [
      { e:'🚀', t:'Baxtli paytlarda kuch ko\'payadi — ayni vaqti! Shu energiya bilan bitta muhim qadam qo\'y. Katta maqsadlar ham bitta qadamdan boshlanadi.', p:'Eng muhim maqsadingizga bugun nima qila olasiz?' },
      { e:'🌟', t:'Orzularingni hozir ko\'z oldingga keltirib ko\'r — ular shucha uzoq emas. Baxtli kayfiyat — maqsadga eng katta ko\'prik. Bugun bitta konkret qadam yoz.', p:'"5 yildan keyin qanday hayot istayapman?" — yozing.' },
      { e:'🎯', t:'Sen bugun quvonchda ekansan — bu tasodif emas. Sen to\'g\'ri yo\'ldasan. Maqsadlaring seni kutmoqda, va sen ular tomon yuryapsan.', p:'Hozirgi maqsadingga qancha yaqinlashganingni baholab ko\'r (1-10).' },
    ],
    hard: [
      { e:'💪', t:'Quvonchda ham o\'tgan qiyinchiliklar bor — ular seni shu yerga olib keldi. Bugungi baxtingni his qil va bilgi: sen qiyin kunlarni ham yengib o\'tgansan.', p:'Qaysi qiyinchilik seni eng ko\'p kuchaytirdi?' },
      { e:'🌈', t:'Yomg\'irdan keyin kamalak chiqadi — bugun sen o\'sha kamalaksan. Boshqa birov uchun ham bu yo\'l mavjud. Sening o\'tmishin — kimgadir ilhom bo\'lishi mumkin.', p:'"Men qiyin kunlarda o\'zimga nima deyman?" — yozing.' },
      { e:'✨', t:'Baxtning qadri — qiyinchilikni bilgan odam uchun eng katta. Sen ikkalasini bilasan. Bu seni chuqurroq va kuchliroq qiladi.', p:'Bugun nimadan minnatdorsiz? 5 ta yozing.' },
    ],
    creative: [
      { e:'🎨', t:'Baxtli vaqtlarda ijod eng go\'zal hosilini beradi! Qo\'lingga bo\'yoq yoki qalam ol. Bugungi kayfiyatingni rang bilan ifodala — hech qanday qoida yo\'q.', p:'Bugungi kayfiyatingni qaysi rang tasvirlaydi? Nima uchun?' },
      { e:'🎵', t:'Quvonch — eng yaxshi ijodiy energiya! Biror kuy xirgoyi qil, rasm chiz yoki she\'r yoz. Bu lahzani san\'atga aylantirib qo\'y.', p:'Agar bugungi kayfiyating qo\'shiq bo\'lsa, uning sarlavhasi nima bo\'lardi?' },
      { e:'🌸', t:'Sening ijodiy potensialingga chek yo\'q — bugun uni ochib tashlash vaqti! Baxtli ko\'ngil — har bir yaratilishda iz qoldiradi.', p:'Qaysi ijodiy narsani uzoq vaqtdan beri qilmoqchi edingiz?' },
    ],
    relation: [
      { e:'💕', t:'Baxtli ekanligingda atrofingizdagilarga mehr ulash! Birovga "sen menga muhimsan" demak — bu eng katta sovg\'a. Kim bugun shu so\'zni eshitishi kerak?', p:'Bugun kimga rahmat yoki mehr bildirasiz?' },
      { e:'🌷', t:'Sevgi — ulashilganda ko\'payadi. Sen bugun boshqalarga yorug\'lik ulasha olasan. Atrofingdagi odamlar sening baxtingni his qilsin.', p:'Seni sevadigan odamlar haqida bir narsa yozing.' },
      { e:'🤗', t:'Munosabatlar — baxtli paytlarda mustahkamlanadi. Bugun birov bilan chinakam suhbatlash, telefonni qo\'y va ko\'zlarga qara.', p:'Kimni eng ko\'p sog\'inayapsiz?' },
    ],
  },

  sad: {
    self: [
      { e:'🫂', t:'Tushkun bo\'lish — insoniy, kuchsizlik emas. O\'zingga nisbatan mehribon bo\'l — xuddi eng yaqin do\'stingga muomala qilganday. Bu his o\'tadi, sen esa qolasan.', p:'"Hozir o\'zimga nima kerak?" — yozing.' },
      { e:'🌙', t:'Ba\'zan kayfiyat tushib ketadi — bu organizming dam olish so\'rashi. O\'zingga vaqt ber. Yig\'lasang yig\'la, yotib dam olsang ol. Bu — zaiflik emas, davoni.', p:'Hozir o\'zing uchun eng yaxshi narsa nima ekan?' },
      { e:'🕊️', t:'Sen bu his qilayotgan og\'irlikning o\'ziga yarasha sababi bor. O\'zingni bu og\'irlik uchun ayblamagin. Hamma tushkun bo\'ladi — sen ularning barchasidan yaxshiroq ko\'tarayapsan.', p:'"O\'zim haqida nima o\'ylayman?" — 3 ta yaxshi narsa yozing.' },
      { e:'💙', t:'Kayfiyat tushganda dunyoqarash qorayadi — lekin bu haqiqat emas. Sen haqiqatdan ko\'ra qiyinroq vaqtda turgan odamsan. Buyon bo\'l — yorug\'lik bor.', p:'"Bu his qachon o\'tadi?" — o\'zingga yozing.' },
    ],
    goals: [
      { e:'🌱', t:'Tushkun paytlarda maqsadlar uzoq ko\'rinadi — bu ko\'zning hiylasi. Faqat bugun uchun bitta kichik narsa qil. Katta o\'zgarish kichik kunlardan tuziladi.', p:'1 ta juda kichik, hozir bajara oladigan narsa yozing.' },
      { e:'🌧️', t:'Ekinlar yomg\'irda ham o\'sadi. Sen ham hozir o\'syapsan — sezmagan bo\'lsang ham. Maqsadlaring seni kutmoqda, shoshma.', p:'Qaysi maqsad hozir eng muhim ko\'rinayapti?' },
      { e:'🔮', t:'Hozir hamma narsa qiyin — bu normal. Lekin kelajak sen tasavvur qilayotganday qorong\'i emas. Bitta qadam yetarli, faqat bitta.', p:'"Yaxshi bo\'lganda nima qilmoqchiman?" — yozing.' },
    ],
    hard: [
      { e:'🌊', t:'Qiyin to\'lqinlar o\'tadi — dengiz har doim tinchiydi. Hozir to\'lqin ichida bo\'lsang ham, qirg\'oq bor. Nafas ol, suzib boraver.', p:'Hozir seni eng ko\'p qiynayotgan narsa nima?' },
      { e:'☁️', t:'Bulutli kunlar abadiy emas. Sen allaqachon ko\'p og\'ir kunlarni o\'tkazgansiz — bu ham o\'tadi. Bugungi og\'irlikni erta sizni kuchaytiradi.', p:'O\'tkazgan qiyin kunlardan qaysi biridan kuch olasiz?' },
      { e:'🫶', t:'Yig\'lash — kuchlilik. Hissiyotlarni his qilish — sog\'lom. O\'zingga ruxsat ber — his qilishga, og\'rishga, lekin aytib ham qo\'y: "Men bu ham o\'tadi".', p:'"Bu qiyinchilikdan nima o\'rganaman?" — yozing.' },
    ],
    creative: [
      { e:'🎭', t:'Eng chuqur ijod — og\'riqdan tug\'iladi. Hissiyotlaringni chiqarib tashlang: she\'r, rasm, yoki faqat qog\'ozga so\'zlar. Baholash kerak emas — to\'kib soling.', p:'Hozirgi his-tuyg\'ularingni bir ranggda ifodalasangiz qanday rang?' },
      { e:'🖤', t:'Qora ranglarning o\'z go\'zalligi bor. Hozir his qilayotgan narsangni san\'atga aylantir. Bu — eng kuchli terapiya.', p:'Rasm chizing — nima bo\'lsa ham. Keyin unga nom bering.' },
      { e:'📝', t:'Og\'riq — eng yaxshi yozuvchi. Hozirgi his-tuyg\'ularingni yozing — tartibsiz, to\'g\'ri, shafqatsiz. Keyin o\'qib ko\'ring — qanchalik jasur ekansiz.', p:'Hozirgi his-tuyg\'ularingni to\'g\'ridan-to\'g\'ri yozing.' },
    ],
    relation: [
      { e:'🤝', t:'Yolg\'iz his qilsangiz — bu his haqiqiy, lekin haqiqat emas. Birov sizni o\'ylayapti. Bugun bitta odamga qo\'ng\'iroq qiling — hatto qisqa bo\'lsa ham.', p:'Kim bilan suhbatlashsangiz yaxshi his qilasiz?' },
      { e:'💌', t:'Munosabatlar ba\'zan og\'ir bo\'ladi. Lekin samimiy bir so\'z ko\'p narsani o\'zgartiradi. Ichingizda saqlagan narsani — yozib qo\'ying avval.', p:'Kimga aytmoqchi bo\'lgan narsangiz bor? Yozing.' },
      { e:'🫂', t:'Hamma ham ba\'zan yolg\'iz his qiladi — bu insoniy. Lekin o\'zingizni yopib qo\'ymang. Birov sizni kutmoqda, siz bilmasangiz ham.', p:'"Kim meni haqiqatan tushunadi?" — deb yozing.' },
    ],
  },

  strong: {
    self: [
      { e:'🦁', t:'Bu kuchni his qilyapsan — demak u hamma vaqt ichingda bor edi! Siz o\'z hayotingizning qahramonisiz. Bugun shu kuchni biron muhim ishga yo\'naltiringchi.', p:'Bugun o\'zingdan faxrlanishingizga sabab bo\'lgan narsa yozing.' },
      { e:'⚡', t:'Kuchli ekanligingizda ham o\'zimizni sinab ko\'ring! Hozir siz uchun imkonsiz narsa yo\'q. Uzoq vaqt qo\'rqib turgan ishingizni bugun boshlang.', p:'"Agar muvaffaqiyat kafolatlangan bo\'lganda nima qilardim?" — yozing.' },
      { e:'🔥', t:'Bu energiya — sovg\'a. Uni isrof qilmang. Hozir siz uchun biror katta qaror qabul qilish vaqti — siz tayyor.', p:'Qaysi qarorni uzoq vaqtdan beri kechiktirayapsiz?' },
    ],
    goals: [
      { e:'🏔️', t:'Kuchli paytlarda tog\'lar qo\'zg\'aladi! Eng katta orzuingizni esga oling — bugun unga bir muhim qadam qo\'ying. Ertaga emas, bugun.', p:'Eng katta orzuyingizni 3 qadamga bo\'ling.' },
      { e:'🎯', t:'Siz hozir maqsadga eng yaqin joydasiz. Bu energiyani yo\'qotmang — harakat qiling! Qaysi bitta ish bugun eng katta farq yaratadi?', p:'Bugun bajarilsa, hayotingiz o\'zgaradigan bir ish yozing.' },
      { e:'🚀', t:'Kuch + maqsad = hayot o\'zgaradi. Siz ikkalasiga egasiz hozir. Bu kombinatsiya nadir — qo\'ldan bermang.', p:'"Bu oy nima erishmoqchiman?" — aniq yozing.' },
    ],
    hard: [
      { e:'🛡️', t:'Qiyinchiliklar seni shunday kuchaytirdi. Har bir muammo — trenirovka edi. Hozir sen ishlatib o\'rganilgan kuch — haqiqiy kuch.', p:'Eng qiyin sinovingiz — sizni qanday o\'zgartirdi?' },
      { e:'💎', t:'Olmoslar bosim ostida yaratiladi. Sen — olmossan. Hozirgi qiyinchiligingga bosh ko\'tarib qara — sen uni yengasiz.', p:'"Qiyinchilik meni kuchaytiradi, chunki..." — yozing.' },
      { e:'🌊', t:'To\'lqin qanchalik katta bo\'lsa, suzuvchi shuncha kuchayadi. Siz qiyinchiliklar to\'lqinida suzib o\'rgangan odamsiz. Bu — tengsiz tajriba.', p:'Hozirgi muammoning ichida qanday imkoniyat yashiringan?' },
    ],
    creative: [
      { e:'🎨', t:'Kuchli paytlarda ijod — portlaydi! Hozir biror narsani yarating: rasm, she\'r, musiqa. Bu kuch to\'lqini ijodingizga eng chiroyli ranglarni beradi.', p:'Qaysi ijodiy loyihani shu kuch bilan yakunlaysiz?' },
      { e:'🖌️', t:'Ijod qilmoq — kuch ishlatmoq. Siz bugun kuchlisiz — demak bugun yaratasiz. O\'zingizni cheklamang, barcha g\'oyangizni chiqarib tashlang.', p:'Agar vaqt va resurs chegarasi bo\'lmasa, nima yaratasiz?' },
      { e:'✨', t:'Kuchli odamlar eng jasur ijodiy qarorlar qiladi. Bugun biror narsani yarating va uni boshqalarga ko\'rsating — bahosi yo\'q!', p:'Kimga ko\'rsatishdan qo\'rqqan ijodiy ishingiz bormi?' },
    ],
    relation: [
      { e:'🌟', t:'Kuchli odamlar atrofidagilarni ko\'taradi. Bugun kimnidir ko\'taring — biror so\'z, biror yordam. Kuch — ulashilganda ko\'payadi.', p:'Kim hozir sizning qo\'llab-quvvatlashingizga muhtoj?' },
      { e:'🤲', t:'Siz bugun birovning hayotini o\'zgartira olasiz — hatto bilmasangiz ham. Biror yaxshilik qiling — kichkina bo\'lsa ham.', p:'Bugun kimga kutilmagan yaxshilik qilasiz?' },
      { e:'💪', t:'Munosabatlarda ham kuch ko\'rsatish vaqti. Uzoq vaqtdan beri aytolmagan narsangiz bormi? Bugun aytish vaqti keldi.', p:'Kimga aytmoqchi bo\'lgan muhim narsangiz bor?' },
    ],
  },

  anxious: {
    self: [
      { e:'🌿', t:'Nafas oling. Hozir, shu daqiqada — siz xavfsiz. Xavotir ko\'pincha kelajak haqidagi fikr — haqiqat emas. Hozirga qayting: siz bu yerdasiz, va bu yetarli.', p:'Atrofingizdagi 5 ta narsani yozing — ko\'rib turganlaringizni.' },
      { e:'🍃', t:'Xavotir — siz muhim narsalarga qayg\'uyotganingiz belgisi. Bu yaxshi. Lekin nafas oling — hamma narsa bir vaqtda hal bo\'lishi shart emas.', p:'3 marta chuqur nafas oling, so\'ng: "Hozir nima his qilyapman?" yozing.' },
      { e:'🫶', t:'O\'zingizga nisbatan yumshoq bo\'ling — siz hammasi yaxshi bo\'lishini xohlayapsiz, bu sevgi belgisi. Lekin siz ham xatolik qilishingiz mumkin — va bu normal.', p:'"O\'zimdan nimani talab qilyapman? Bu real ekanmi?" — yozing.' },
    ],
    goals: [
      { e:'🐾', t:'Maqsadlar ba\'zan katta ko\'rinadi — bu ko\'zning hiylasi. Ularni kichraytiring. Bugun faqat bitta, eng kichik qadamni qo\'ying. Shuncha yetarli.', p:'Eng katta maqsadingizni 10 ta kichik qadamga bo\'ling.' },
      { e:'🌱', t:'Tezlash kerak emas. O\'simliklar ham shoshmasdan o\'sadi. Siz ham o\'z vaqtingizda yetib borasiz — bu musobaqa emas.', p:'"O\'zimga qancha vaqt beraman?" — yozing.' },
      { e:'🧭', t:'Xavotirli paytlarda faqat keyingi qadamni ko\'r — butun yo\'lni emas. Kompas to\'liq xaritani bilmaydi, lekin yo\'nalishni ko\'rsatadi.', p:'Bugungi bitta, kichik qadamingiz nima?' },
    ],
    hard: [
      { e:'🌧️', t:'Xavotirlar ro\'yxatini yozing — hammasini. Qog\'ozda ko\'rsangiz, bosh ichidagi kabi katta bo\'lmaydi. Keyin qaysi biri bugun hal bo\'lishini belgilang.', p:'Barcha xavotirlaringizni yozing — hech birini qoldirmay.' },
      { e:'🕯️', t:'Qorong\'ida bitta sham yetarli. Hozir siz uchun "bir narsa" yetarli — hammasi emas. Faqat bu lahzani ko\'ring.', p:'"Hozir bitta narsa qilsam, bu nima bo\'lardi?" — yozing.' },
      { e:'🌊', t:'Xavotirni his qiling — lekin unda cho\'kmang. U to\'lqin kabi keladi va ketadi. Sen qirg\'oqsan — to\'lqin o\'tib ketadi.', p:'"Bu xavotir o\'tsa, nima his qilaman?" — yozing.' },
    ],
    creative: [
      { e:'🎨', t:'Ijod — xavotirning eng yaxshi dorisi! Qo\'lingizga biror narsa oling: bo\'yoq, qalam, yoki klaviatura. Hissiyotlaringizni chiqarib tashlang — baholash kerak emas.', p:'Xavotiringizni rasm yoki so\'z bilan ifodalang.' },
      { e:'🖊️', t:'Yozing — hamma narsani, tartibsiz. Bosh ichidagi fikrlarni qog\'ozga to\'kib soling. Bu "brain dump" — eng yaxshi terapiya.', p:'5 daqiqa to\'xtovsiz yozing — nima kelsa.' },
      { e:'🎵', t:'Musiqa — tinchlantiradi. Hozir quloqchinni takib, sevimli qo\'shig\'ingizni eshiting. Hech narsa qilmasdan, faqat eshiting.', p:'Tinchlanadigan qo\'shig\'ingiz bormi? Uning nomini yozing.' },
    ],
    relation: [
      { e:'💬', t:'Munosabatlardagi xavotir ko\'pincha bitta samimiy suhbat bilan yechiladi. Ichingizda saqlagan narsani — shu odamga ayting. Qo\'rqsangiz ham.', p:'Kimga biror narsani aytishdan qo\'rqayapsiz?' },
      { e:'🤗', t:'O\'zingizni himoya qilish uchun atrofingizga devol qurmang. Ba\'zan kuchsizligingizni ko\'rsatish — eng kuchli ish.', p:'"Kimga ishonaman?" — yozing.' },
      { e:'🌸', t:'Hamma munosabat mukammal emas — bu normal. Xavotirlaringizni yozib, keyin qaysi biri haqiqiy ekanini ajrating.', p:'Munosabatlarda sizni bezovta qiladigan narsa nima?' },
    ],
  },

  searching: {
    self: [
      { e:'🔭', t:'Izlash — o\'sishning eng kuchli belgisi! Siz kim bo\'lmoqchi ekanligingizni qidiryapsiz — bu juda katta ish. Javoblar sekin keladi, lekin siz to\'g\'ri yo\'ldasiz.', p:'"Men qanday odam bo\'lmoqchiman?" — erkin yozing.' },
      { e:'🌀', t:'Ba\'zan o\'zimizni yo\'qotib qo\'yamiz — bu yangi o\'zimizni topish uchun. Eski siz o\'tayapti, yangi siz kelayapti. Qo\'rqmang.', p:'"5 yil oldingi men va hozirgi men — qanday farq bor?" yozing.' },
      { e:'🗺️', t:'Hayot — xaritasiz sayohat. Hamma ham yo\'lini bilmay yuradi — faqat ba\'zilar buni yashiradi. Siz kamida izlayapsiz — bu juda katta qadam.', p:'"Kim bo\'lmoqchi emasman?" — bu ham javob. Yozing.' },
    ],
    goals: [
      { e:'🌱', t:'Maqsad yo\'q deb o\'ylasangiz — aslida izlayapsiz. Izlash ham yo\'nalish. Hozir qaysi sohada o\'rganish, sinab ko\'rish qiziq? O\'shandan boshlang.', p:'Hayotda nima sizni qiziqtiradi? Ro\'yxat tuzing.' },
      { e:'🔑', t:'Maqsadlar ba\'zan topiladi — qidirilmaydi. Ko\'proq tajriba yig\'ing: yangi narsa o\'rganing, yangi joy boring, yangi odam bilan gaplashing.', p:'Bu oy bitta yangi narsani sinab ko\'rasiz — nima bo\'ladi?' },
      { e:'💡', t:'Yo\'nalishsiz his qilish — bu boshi bo\'sh maydon. U — imkoniyat. Hech qanday cheklovlarsiz — nima qilmoqchi edingiz?', p:'"Agar hech kim bilmasa nima qilardim?" — yozing.' },
    ],
    hard: [
      { e:'🌫️', t:'Qidirish — ko\'pincha og\'riqli. Lekin bu og\'riq — sizni to\'g\'ri joyga olib bormoqda. Yo\'lni bilmaslik — bu hali to\'g\'ri yo\'l topilmaganlik, noto\'g\'ri yurganlik emas.', p:'"Bu qiyinchilik meni qaerga olib bormoqda?" — yozing.' },
      { e:'🌙', t:'Qorong\'uda yulduzlar ko\'rinadi. Siz hozir qorong\'uda — lekin shuning uchun ham ichki yulduzlaringizni ko\'ra olasiz.', p:'Qiyin paytlarda o\'zingizdan nima topgansiz?' },
      { e:'🔥', t:'Yo\'qolish — ba\'zan topilish uchun kerak bo\'ladi. Siz hozir o\'z o\'tchangdan o\'tayapsiz — narigi tomonda yangi siz bor.', p:'"Bu qiyinchilik tugagach, men qanday odam bo\'laman?" — yozing.' },
    ],
    creative: [
      { e:'🎭', t:'Ijod — o\'zingni topishning eng qadimiy usuli. Bir narsa yarating — nima bo\'lsa ham. Undan o\'zingiz haqingizda biror narsa bilib olasiz.', p:'Biror narsani yarating va "bu menga nima aytadi?" deb so\'rang.' },
      { e:'✏️', t:'Hamma narsani yozib chiqing — savollar, shubhalar, orzular. Qog\'oz — eng yaxshi terapeving. U hukm qilmaydi, faqat eshitadi.', p:'10 daqiqa to\'xtovsiz — ichingizda nima bo\'lsa yozing.' },
      { e:'🌈', t:'Ba\'zan biz o\'zimizni ijod orqali topamiz — mantiq orqali emas. Bugun biror narsani yarating va u sizga kim ekanligingizni ko\'rsatsin.', p:'"Men yaratayotganda kim bo\'laman?" — yozing.' },
    ],
    relation: [
      { e:'🌐', t:'O\'zingizni munosabatlarda yo\'qotdingizmi? Bu ko\'pchilikka tanish. Kim siz bo\'lmasangiz ham — aniqlash vaqti. Qaysi munosabatda o\'zingiz emassiz?', p:'"Qaysi munosabatlarda o\'zimman?" — yozing.' },
      { e:'🤲', t:'O\'zingizga mos odamlarni topish — hayotning eng katta topilmasi. Siz izlayapsiz — demak siz uchun joy bor. Shoshma.', p:'Qaysi odamlar bilan bo\'lganda eng o\'zingiz bo\'lasiz?' },
      { e:'💞', t:'Chuqur munosabatlar — o\'z-o\'zingizni bilganingizda boshlanadi. Hozir siz shu ish bilan band — bu munosabatlarga tayyorlik.', p:'"Meni haqiqatan tushungan odam men haqimda nima derdi?" — yozing.' },
    ],
  },
};
