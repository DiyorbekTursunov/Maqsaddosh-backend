import { Request, Response } from "express";

interface SubDirection {
  id: string;
  name: string;
}

interface Direction {
  id: string;
  name: string;
  subDirections: SubDirection[];
}

const directionsData: Direction[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Sport",
    subDirections: [
      { id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8", name: "Yugurish" },
      { id: "6ba7b811-9dad-11d1-80b4-00c04fd430c8", name: "Suzish" },
      { id: "6ba7b812-9dad-11d1-80b4-00c04fd430c8", name: "Futbol" },
      { id: "6ba7b813-9dad-11d1-80b4-00c04fd430c8", name: "Basketbol" },
      { id: "6ba7b814-9dad-11d1-80b4-00c04fd430c8", name: "Voleybol" },
      { id: "6ba7b815-9dad-11d1-80b4-00c04fd430c8", name: "Tennis" },
      { id: "6ba7b816-9dad-11d1-80b4-00c04fd430c8", name: "Stol tennisi" },
      { id: "6ba7b817-9dad-11d1-80b4-00c04fd430c8", name: "Badminton" },
      { id: "6ba7b818-9dad-11d1-80b4-00c04fd430c8", name: "Shaxmat" },
      { id: "6ba7b819-9dad-11d1-80b4-00c04fd430c8", name: "Dzyudo" },
      { id: "6ba7b81a-9dad-11d1-80b4-00c04fd430c8", name: "Karate" },
      { id: "6ba7b81b-9dad-11d1-80b4-00c04fd430c8", name: "Taekvondo" },
      { id: "6ba7b81c-9dad-11d1-80b4-00c04fd430c8", name: "Gimnastika" },
      { id: "6ba7b81d-9dad-11d1-80b4-00c04fd430c8", name: "Engil atletika" },
      { id: "6ba7b81e-9dad-11d1-80b4-00c04fd430c8", name: "Og‘ir atletika" },
      { id: "6ba7b81f-9dad-11d1-80b4-00c04fd430c8", name: "Velosport" },
      { id: "6ba7b820-9dad-11d1-80b4-00c04fd430c8", name: "Qo‘l kurashi" },
      { id: "6ba7b821-9dad-11d1-80b4-00c04fd430c8", name: "Kurash" },
      { id: "6ba7b822-9dad-11d1-80b4-00c04fd430c8", name: "Boks" },
      {
        id: "6ba7b823-9dad-11d1-80b4-00c04fd430c8",
        name: "Fitness / Jismoniy mashg‘ulotlar",
      },
    ],
  },
  {
    id: "550e8401-e29b-41d4-a716-446655440001",
    name: "Zamonaviy kasblar",
    subDirections: [
      {
        id: "6ba7b830-9dad-11d1-80b4-00c04fd430c8",
        name: "Dasturchi (programmist)",
      },
      { id: "6ba7b831-9dad-11d1-80b4-00c04fd430c8", name: "Grafik dizayner" },
      { id: "6ba7b832-9dad-11d1-80b4-00c04fd430c8", name: "Web-dizayner" },
      { id: "6ba7b833-9dad-11d1-80b4-00c04fd430c8", name: "UX/UI dizayner" },
      {
        id: "6ba7b834-9dad-11d1-80b4-00c04fd430c8",
        name: "Mobil ilovalar ishlab chiquvchisi",
      },
      {
        id: "6ba7b835-9dad-11d1-80b4-00c04fd430c8",
        name: "Ma’lumotlar tahlilchisi (Data Analyst)",
      },
      {
        id: "6ba7b836-9dad-11d1-80b4-00c04fd430c8",
        name: "Sun’iy intellekt mutaxassisi",
      },
      {
        id: "6ba7b837-9dad-11d1-80b4-00c04fd430c8",
        name: "Kiberxavfsizlik mutaxassisi",
      },
      {
        id: "6ba7b838-9dad-11d1-80b4-00c04fd430c8",
        name: "Raqamli marketing mutaxassisi",
      },
      {
        id: "6ba7b839-9dad-11d1-80b4-00c04fd430c8",
        name: "Kontent yaratuvchi (blogger, vlogger)",
      },
      {
        id: "6ba7b83a-9dad-11d1-80b4-00c04fd430c8",
        name: "SMM mutaxassisi (ijtimoiy tarmoqlar boshqaruvchisi)",
      },
      { id: "6ba7b83b-9dad-11d1-80b4-00c04fd430c8", name: "SEO mutaxassisi" },
      {
        id: "6ba7b83c-9dad-11d1-80b4-00c04fd430c8",
        name: "Elektron tijorat (e-commerce) menejeri",
      },
      {
        id: "6ba7b83d-9dad-11d1-80b4-00c04fd430c8",
        name: "Startap asoschisi / tadbirkor",
      },
      {
        id: "6ba7b83e-9dad-11d1-80b4-00c04fd430c8",
        name: "IT loyihalar menejeri (Project Manager)",
      },
      { id: "6ba7b83f-9dad-11d1-80b4-00c04fd430c8", name: "Videomontajchi" },
      {
        id: "6ba7b840-9dad-11d1-80b4-00c04fd430c8",
        name: "3D modelchi / animator",
      },
      {
        id: "6ba7b841-9dad-11d1-80b4-00c04fd430c8",
        name: "Onlayn ta’lim platformasi instruktori",
      },
      {
        id: "6ba7b842-9dad-11d1-80b4-00c04fd430c8",
        name: "Kriptovalyuta bo‘yicha mutaxassis",
      },
      {
        id: "6ba7b843-9dad-11d1-80b4-00c04fd430c8",
        name: "Frilanser (mustaqil ish yurituvchi)",
      },
    ],
  },
  {
    id: "550e8402-e29b-41d4-a716-446655440002",
    name: "Shaxsiy rivojlanish",
    subDirections: [
      { id: "6ba7b850-9dad-11d1-80b4-00c04fd430c8", name: "Vaqtni boshqarish" },
      { id: "6ba7b851-9dad-11d1-80b4-00c04fd430c8", name: "Kitob o‘qish" },
      { id: "6ba7b852-9dad-11d1-80b4-00c04fd430c8", name: "Erta turish" },
      { id: "6ba7b853-9dad-11d1-80b4-00c04fd430c8", name: "Reja tuzish" },
      {
        id: "6ba7b854-9dad-11d1-80b4-00c04fd430c8",
        name: "Nutqni rivojlantirish",
      },
      { id: "6ba7b855-9dad-11d1-80b4-00c04fd430c8", name: "Shaxsiy ishonch" },
      {
        id: "6ba7b856-9dad-11d1-80b4-00c04fd430c8",
        name: "Stressni boshqarish",
      },
      {
        id: "6ba7b857-9dad-11d1-80b4-00c04fd430c8",
        name: "Yomon odatlarni tashlash",
      },
      { id: "6ba7b858-9dad-11d1-80b4-00c04fd430c8", name: "Motivatsiya" },
      { id: "6ba7b859-9dad-11d1-80b4-00c04fd430c8", name: "Kundalik yozish" },
      {
        id: "6ba7b85a-9dad-11d1-80b4-00c04fd430c8",
        name: "Qiziqishlarni topish",
      },
      {
        id: "6ba7b85b-9dad-11d1-80b4-00c04fd430c8",
        name: "Ijtimoiy ko‘nikmalar",
      },
      {
        id: "6ba7b85c-9dad-11d1-80b4-00c04fd430c8",
        name: "Kamchiliklar ustida ishlash",
      },
    ],
  },
  {
    id: "550e8403-e29b-41d4-a716-446655440003",
    name: "Kitobxonlik",
    subDirections: [
      { id: "6ba7b860-9dad-11d1-80b4-00c04fd430c8", name: "Har kuni o‘qish" },
      { id: "6ba7b861-9dad-11d1-80b4-00c04fd430c8", name: "Oyiga 1 kitob" },
      {
        id: "6ba7b862-9dad-11d1-80b4-00c04fd430c8",
        name: "Adabiy asarlar o‘qish",
      },
      { id: "6ba7b863-9dad-11d1-80b4-00c04fd430c8", name: "Badiiy kitoblar" },
      { id: "6ba7b864-9dad-11d1-80b4-00c04fd430c8", name: "Ilmiy kitoblar" },
      {
        id: "6ba7b865-9dad-11d1-80b4-00c04fd430c8",
        name: "O‘zini rivojlantirish kitoblari",
      },
      {
        id: "6ba7b866-9dad-11d1-80b4-00c04fd430c8",
        name: "Xorijiy tillarda kitob o‘qish",
      },
      {
        id: "6ba7b867-9dad-11d1-80b4-00c04fd430c8",
        name: "O‘qilgan kitoblarni yozib borish",
      },
      {
        id: "6ba7b868-9dad-11d1-80b4-00c04fd430c8",
        name: "Kitoblar haqida fikr bildirish",
      },
      {
        id: "6ba7b869-9dad-11d1-80b4-00c04fd430c8",
        name: "Audiokitoblar tinglash",
      },
      {
        id: "6ba7b86a-9dad-11d1-80b4-00c04fd430c8",
        name: "Sevimli yozuvchini tanlash",
      },
      {
        id: "6ba7b86b-9dad-11d1-80b4-00c04fd430c8",
        name: "Yangi janrlar sinab ko‘rish",
      },
      {
        id: "6ba7b86c-9dad-11d1-80b4-00c04fd430c8",
        name: "Kutubxonaga borish",
      },
      {
        id: "6ba7b86d-9dad-11d1-80b4-00c04fd430c8",
        name: "Kitob tavsiya qilish",
      },
      {
        id: "6ba7b86e-9dad-11d1-80b4-00c04fd430c8",
        name: "Kitob klublariga qo‘shilish",
      },
    ],
  },
  {
    id: "550e8404-e29b-41d4-a716-446655440004",
    name: "Biznes",
    subDirections: [
      { id: "6ba7b870-9dad-11d1-80b4-00c04fd430c8", name: "Biznes boshlash" },
      { id: "6ba7b871-9dad-11d1-80b4-00c04fd430c8", name: "G‘oya topish" },
      {
        id: "6ba7b872-9dad-11d1-80b4-00c04fd430c8",
        name: "Biznes-reja tuzish",
      },
      { id: "6ba7b873-9dad-11d1-80b4-00c04fd430c8", name: "Sarmoya topish" },
      {
        id: "6ba7b874-9dad-11d1-80b4-00c04fd430c8",
        name: "Onlayn biznes ochish",
      },
      {
        id: "6ba7b875-9dad-11d1-80b4-00c04fd430c8",
        name: "Frilanserlikni yo‘lga qo‘yish",
      },
      { id: "6ba7b876-9dad-11d1-80b4-00c04fd430c8", name: "Mahsulot yaratish" },
      { id: "6ba7b877-9dad-11d1-80b4-00c04fd430c8", name: "Mijoz topish" },
      {
        id: "6ba7b878-9dad-11d1-80b4-00c04fd430c8",
        name: "SMM orqali targ‘ibot",
      },
      {
        id: "6ba7b879-9dad-11d1-80b4-00c04fd430c8",
        name: "Savdo ko‘nikmalarini rivojlantirish",
      },
      { id: "6ba7b87a-9dad-11d1-80b4-00c04fd430c8", name: "Brend yaratish" },
      {
        id: "6ba7b87b-9dad-11d1-80b4-00c04fd430c8",
        name: "Telegram / Instagram do‘kon",
      },
      { id: "6ba7b87c-9dad-11d1-80b4-00c04fd430c8", name: "Savdoni oshirish" },
      {
        id: "6ba7b87d-9dad-11d1-80b4-00c04fd430c8",
        name: "Raqobatchilarni tahlil qilish",
      },
      {
        id: "6ba7b87e-9dad-11d1-80b4-00c04fd430c8",
        name: "Marketingni o‘rganish",
      },
      {
        id: "6ba7b87f-9dad-11d1-80b4-00c04fd430c8",
        name: "Daromadni oshirish",
      },
      {
        id: "6ba7b880-9dad-11d1-80b4-00c04fd430c8",
        name: "Soliq va huquqiy bilimlar",
      },
      { id: "6ba7b881-9dad-11d1-80b4-00c04fd430c8", name: "Jamoa tuzish" },
      {
        id: "6ba7b882-9dad-11d1-80b4-00c04fd430c8",
        name: "Mijozlar bilan ishlash",
      },
      {
        id: "6ba7b883-9dad-11d1-80b4-00c04fd430c8",
        name: "Biznes kitoblar o‘qish",
      },
    ],
  },
  {
    id: "550e8405-e29b-41d4-a716-446655440005",
    name: "Sayohat",
    subDirections: [
      {
        id: "6ba7b890-9dad-11d1-80b4-00c04fd430c8",
        name: "Yangi davlatga borish",
      },
      {
        id: "6ba7b891-9dad-11d1-80b4-00c04fd430c8",
        name: "Ichki turizm (O‘zbekiston ichida sayohat)",
      },
      {
        id: "6ba7b892-9dad-11d1-80b4-00c04fd430c8",
        name: "Oyda bir marta sayohat",
      },
      { id: "6ba7b893-9dad-11d1-80b4-00c04fd430c8", name: "Tog‘ga chiqish" },
      {
        id: "6ba7b894-9dad-11d1-80b4-00c04fd430c8",
        name: "Dengiz bo‘yida dam olish",
      },
      {
        id: "6ba7b895-9dad-11d1-80b4-00c04fd430c8",
        name: "Tarixiy joylarga borish",
      },
      { id: "6ba7b896-9dad-11d1-80b4-00c04fd430c8", name: "Solo sayohat" },
      {
        id: "6ba7b897-9dad-11d1-80b4-00c04fd430c8",
        name: "Do‘stlar bilan safar",
      },
      {
        id: "6ba7b898-9dad-11d1-80b4-00c04fd430c8",
        name: "Arzon sayohat rejalashtirish",
      },
      {
        id: "6ba7b899-9dad-11d1-80b4-00c04fd430c8",
        name: "Sayohat blogi yuritish",
      },
      {
        id: "6ba7b89a-9dad-11d1-80b4-00c04fd430c8",
        name: "Sayohat uchun pul tejash",
      },
      {
        id: "6ba7b89b-9dad-11d1-80b4-00c04fd430c8",
        name: "Harakatlanish rejasi tuzish",
      },
      {
        id: "6ba7b89c-9dad-11d1-80b4-00c04fd430c8",
        name: "Yangi madaniyat bilan tanishish",
      },
      {
        id: "6ba7b89d-9dad-11d1-80b4-00c04fd430c8",
        name: "Sayohat fotosuratlari olish",
      },
      {
        id: "6ba7b89e-9dad-11d1-80b4-00c04fd430c8",
        name: "Mahalliy taomlarni tatib ko‘rish",
      },
    ],
  },
  {
    id: "550e8406-e29b-41d4-a716-446655440006",
    name: "Qiziqishlar",
    subDirections: [
      { id: "6ba7b8a0-9dad-11d1-80b4-00c04fd430c8", name: "Rasm chizish" },
      { id: "6ba7b8a1-9dad-11d1-80b4-00c04fd430c8", name: "Musiqa chalish" },
      { id: "6ba7b8a2-9dad-11d1-80b4-00c04fd430c8", name: "Ashula kuylash" },
      { id: "6ba7b8a3-9dad-11d1-80b4-00c04fd430c8", name: "Fotografiya" },
      { id: "6ba7b8a4-9dad-11d1-80b4-00c04fd430c8", name: "Videomontaj" },
      {
        id: "6ba7b8a5-9dad-11d1-80b4-00c04fd430c8",
        name: "Tikuvchilik / qo‘l mehnati",
      },
      { id: "6ba7b8a6-9dad-11d1-80b4-00c04fd430c8", name: "Ovqat tayyorlash" },
      {
        id: "6ba7b8a7-9dad-11d1-80b4-00c04fd430c8",
        name: "Pishiriqlar tayyorlash",
      },
      {
        id: "6ba7b8a8-9dad-11d1-80b4-00c04fd430c8",
        name: "Blogging / kontent yaratish",
      },
      {
        id: "6ba7b8a9-9dad-11d1-80b4-00c04fd430c8",
        name: "O‘simlik parvarishi",
      },
      { id: "6ba7b8aa-9dad-11d1-80b4-00c04fd430c8", name: "Kitob yozish" },
      {
        id: "6ba7b8ab-9dad-11d1-80b4-00c04fd430c8",
        name: "Kino / seriallar tahlili",
      },
      {
        id: "6ba7b8ac-9dad-11d1-80b4-00c04fd430c8",
        name: "O‘yin o‘ynash (video yoki stol o‘yinlari)",
      },
      {
        id: "6ba7b8ad-9dad-11d1-80b4-00c04fd430c8",
        name: "Yangi sport turi sinash",
      },
      {
        id: "6ba7b8ae-9dad-11d1-80b4-00c04fd430c8",
        name: "Yangi tillarni o‘rganishga qiziqish",
      },
      {
        id: "6ba7b8af-9dad-11d1-80b4-00c04fd430c8",
        name: "Qo‘l san’atlari (handmade)",
      },
      {
        id: "6ba7b8b0-9dad-11d1-80b4-00c04fd430c8",
        name: "Komiks yoki manga o‘qish",
      },
    ],
  },
  {
    id: "550e8407-e29b-41d4-a716-446655440007",
    name: "Karyera",
    subDirections: [
      { id: "6ba7b8c0-9dad-11d1-80b4-00c04fd430c8", name: "Ish topish" },
      {
        id: "6ba7b8c1-9dad-11d1-80b4-00c04fd430c8",
        name: "Rezyume tayyorlash",
      },
      {
        id: "6ba7b8c2-9dad-11d1-80b4-00c04fd430c8",
        name: "Ish suhbati uchun tayyorgarlik",
      },
      { id: "6ba7b8c3-9dad-11d1-80b4-00c04fd430c8", name: "Lavozim oshirish" },
      {
        id: "6ba7b8c4-9dad-11d1-80b4-00c04fd430c8",
        name: "Karyera yo‘nalishini tanlash",
      },
      {
        id: "6ba7b8c5-9dad-11d1-80b4-00c04fd430c8",
        name: "LinkedIn profil yaratish",
      },
      {
        id: "6ba7b8c6-9dad-11d1-80b4-00c04fd430c8",
        name: "Professional tarmoq qurish",
      },
      { id: "6ba7b8c7-9dad-11d1-80b4-00c04fd430c8", name: "Portfolio tuzish" },
      {
        id: "6ba7b8c8-9dad-11d1-80b4-00c04fd430c8",
        name: "Onlayn kurs o‘tash",
      },
      { id: "6ba7b8c9-9dad-11d1-80b4-00c04fd430c8", name: "Sertifikat olish" },
      {
        id: "6ba7b8ca-9dad-11d1-80b4-00c04fd430c8",
        name: "Yangi ko‘nikma o‘rganish",
      },
      {
        id: "6ba7b8cb-9dad-11d1-80b4-00c04fd430c8",
        name: "O‘qituvchilik / mentorlik qilish",
      },
      {
        id: "6ba7b8cc-9dad-11d1-80b4-00c04fd430c8",
        name: "Ish joyini almashtirish",
      },
      {
        id: "6ba7b8cd-9dad-11d1-80b4-00c04fd430c8",
        name: "Muloqot ko‘nikmalarini oshirish",
      },
      {
        id: "6ba7b8ce-9dad-11d1-80b4-00c04fd430c8",
        name: "Rahbarlik ko‘nikmalarini rivojlantirish",
      },
      {
        id: "6ba7b8cf-9dad-11d1-80b4-00c04fd430c8",
        name: "Karyera bo‘yicha maslahat olish",
      },
      { id: "6ba7b8d0-9dad-11d1-80b4-00c04fd430c8", name: "Oylikni oshirish" },
      {
        id: "6ba7b8d1-9dad-11d1-80b4-00c04fd430c8",
        name: "Taqdimot qilishni o‘rganish",
      },
      {
        id: "6ba7b8d2-9dad-11d1-80b4-00c04fd430c8",
        name: "Ish va hayot muvozanatini topish",
      },
    ],
  },
  {
    id: "550e8408-e29b-41d4-a716-446655440008",
    name: "Til o’rganish",
    subDirections: [
      { id: "6ba7b8e0-9dad-11d1-80b4-00c04fd430c8", name: "Yangi til tanlash" },
      {
        id: "6ba7b8e1-9dad-11d1-80b4-00c04fd430c8",
        name: "Har kuni so‘z yodlash",
      },
      {
        id: "6ba7b8e2-9dad-11d1-80b4-00c04fd430c8",
        name: "Grammatika o‘rganish",
      },
      {
        id: "6ba7b8e3-9dad-11d1-80b4-00c04fd430c8",
        name: "Til kursiga yozilish",
      },
      {
        id: "6ba7b8e4-9dad-11d1-80b4-00c04fd430c8",
        name: "Ingliz tilini o‘rganish",
      },
      {
        id: "6ba7b8e5-9dad-11d1-80b4-00c04fd430c8",
        name: "Rus tilini o‘rganish",
      },
      {
        id: "6ba7b8e6-9dad-11d1-80b4-00c04fd430c8",
        name: "Arab tilini o‘rganish",
      },
      {
        id: "6ba7b8e7-9dad-11d1-80b4-00c04fd430c8",
        name: "Nemis / fransuz tilini o‘rganish",
      },
      {
        id: "6ba7b8e8-9dad-11d1-80b4-00c04fd430c8",
        name: "Onlayn darslar qilish",
      },
      {
        id: "6ba7b8e9-9dad-11d1-80b4-00c04fd430c8",
        name: "Tilda gapirish mashqlari",
      },
      { id: "6ba7b8ea-9dad-11d1-80b4-00c04fd430c8", name: "Podcast tinglash" },
      {
        id: "6ba7b8eb-9dad-11d1-80b4-00c04fd430c8",
        name: "Film va seriallar ko‘rish",
      },
      {
        id: "6ba7b8ec-9dad-11d1-80b4-00c04fd430c8",
        name: "Chet tilida kitob o‘qish",
      },
      {
        id: "6ba7b8ed-9dad-11d1-80b4-00c04fd430c8",
        name: "So‘zlashuv klubiga qo‘shilish",
      },
      {
        id: "6ba7b8ee-9dad-11d1-80b4-00c04fd430c8",
        name: "Til imtihoniga tayyorlanish (IELTS, TOEFL)",
      },
      { id: "6ba7b8ef-9dad-11d1-80b4-00c04fd430c8", name: "Lug‘at yuritish" },
      {
        id: "6ba7b8f0-9dad-11d1-80b4-00c04fd430c8",
        name: "Matn tarjima qilish",
      },
      {
        id: "6ba7b8f1-9dad-11d1-80b4-00c04fd430c8",
        name: "Yozma ishlar mashqi",
      },
      {
        id: "6ba7b8f2-9dad-11d1-80b4-00c04fd430c8",
        name: "Til o‘rganishni kundalik odatga aylantirish",
      },
    ],
  },
  {
    id: "550e8409-e29b-41d4-a716-446655440009",
    name: "Volontyorlik",
    subDirections: [
      {
        id: "6ba7b900-9dad-11d1-80b4-00c04fd430c8",
        name: "Ko‘ngilli faoliyat topish",
      },
      {
        id: "6ba7b901-9dad-11d1-80b4-00c04fd430c8",
        name: "Tadbirda volontyor bo‘lish",
      },
      {
        id: "6ba7b902-9dad-11d1-80b4-00c04fd430c8",
        name: "Ehtiyojmandlarga yordam berish",
      },
      {
        id: "6ba7b903-9dad-11d1-80b4-00c04fd430c8",
        name: "Atrof-muhitni tozalash aksiyasida qatnashish",
      },
      {
        id: "6ba7b904-9dad-11d1-80b4-00c04fd430c8",
        name: "Hayriya tadbirida ishtirok etish",
      },
      {
        id: "6ba7b905-9dad-11d1-80b4-00c04fd430c8",
        name: "Kitob yoki kiyim yig‘ish aksiyasiga qo‘shilish",
      },
      {
        id: "6ba7b906-9dad-11d1-80b4-00c04fd430c8",
        name: "Qariyalar yoki bolalar uyida volontyorlik",
      },
      {
        id: "6ba7b907-9dad-11d1-80b4-00c04fd430c8",
        name: "Marafon yoki sport tadbirlarida ko‘maklashish",
      },
      {
        id: "6ba7b908-9dad-11d1-80b4-00c04fd430c8",
        name: "Ko‘ngilli tashkilotga a’zo bo‘lish",
      },
      {
        id: "6ba7b909-9dad-11d1-80b4-00c04fd430c8",
        name: "Volontyorlar jamoasiga qo‘shilish",
      },
      {
        id: "6ba7b90a-9dad-11d1-80b4-00c04fd430c8",
        name: "Ko‘ngillilik tajribasini rezyumega qo‘shish",
      },
      {
        id: "6ba7b90b-9dad-11d1-80b4-00c04fd430c8",
        name: "Ta’lim loyihalarida yordam berish",
      },
      {
        id: "6ba7b90c-9dad-11d1-80b4-00c04fd430c8",
        name: "Onlayn volontyorlik qilish",
      },
      {
        id: "6ba7b90d-9dad-11d1-80b4-00c04fd430c8",
        name: "Dasturlash/dizayn orqali ko‘ngilli yordam ko‘rsatish",
      },
    ],
  },
  {
    id: "550e8410-e29b-41d4-a716-446655440010",
    name: "Ustoz-Shogirt",
    subDirections: [
      { id: "6ba7b910-9dad-11d1-80b4-00c04fd430c8", name: "Mentor topish" },
      {
        id: "6ba7b911-9dad-11d1-80b4-00c04fd430c8",
        name: "Haftalik uchrashuv",
      },
      { id: "6ba7b912-9dad-11d1-80b4-00c04fd430c8", name: "Maqsad belgilash" },
      {
        id: "6ba7b913-9dad-11d1-80b4-00c04fd430c8",
        name: "Fikr-mulohaza olish",
      },
      { id: "6ba7b914-9dad-11d1-80b4-00c04fd430c8", name: "Tajriba almashish" },
      { id: "6ba7b915-9dad-11d1-80b4-00c04fd430c8", name: "Nazorat qilish" },
      {
        id: "6ba7b916-9dad-11d1-80b4-00c04fd430c8",
        name: "Progressni baholash",
      },
      {
        id: "6ba7b917-9dad-11d1-80b4-00c04fd430c8",
        name: "Ish rezyumesini ko‘rib chiqish",
      },
      { id: "6ba7b918-9dad-11d1-80b4-00c04fd430c8", name: "Networking" },
      { id: "6ba7b919-9dad-11d1-80b4-00c04fd430c8", name: "Amaliyot" },
      {
        id: "6ba7b91a-9dad-11d1-80b4-00c04fd430c8",
        name: "Loyihada rahbarlik",
      },
      {
        id: "6ba7b91b-9dad-11d1-80b4-00c04fd430c8",
        name: "Motivatsiya berish",
      },
      {
        id: "6ba7b91c-9dad-11d1-80b4-00c04fd430c8",
        name: "Qaror qabul qilish bo‘yicha maslahat",
      },
    ],
  },
  {
    id: "550e8411-e29b-41d4-a716-446655440011",
    name: "Sog’lom hayot",
    subDirections: [
      {
        id: "6ba7b920-9dad-11d1-80b4-00c04fd430c8",
        name: "To‘g‘ri ovqatlanish",
      },
      {
        id: "6ba7b921-9dad-11d1-80b4-00c04fd430c8",
        name: "Sport bilan shug‘ullanish",
      },
      {
        id: "6ba7b922-9dad-11d1-80b4-00c04fd430c8",
        name: "Erta uxlash / erta turish",
      },
      {
        id: "6ba7b923-9dad-11d1-80b4-00c04fd430c8",
        name: "Shakar iste’molini kamaytirish",
      },
      {
        id: "6ba7b924-9dad-11d1-80b4-00c04fd430c8",
        name: "Ko‘proq suv ichish",
      },
      {
        id: "6ba7b925-9dad-11d1-80b4-00c04fd430c8",
        name: "Meditatsiya qilish",
      },
      {
        id: "6ba7b926-9dad-11d1-80b4-00c04fd430c8",
        name: "Salbiy odatlarni tashlash",
      },
      { id: "6ba7b927-9dad-11d1-80b4-00c04fd430c8", name: "Kunlik yurish" },
      { id: "6ba7b928-9dad-11d1-80b4-00c04fd430c8", name: "Nafas mashqlari" },
      {
        id: "6ba7b929-9dad-11d1-80b4-00c04fd430c8",
        name: "Tinch uxlash odatini shakllantirish",
      },
      {
        id: "6ba7b92a-9dad-11d1-80b4-00c04fd430c8",
        name: "Ekran vaqtini kamaytirish",
      },
      {
        id: "6ba7b92b-9dad-11d1-80b4-00c04fd430c8",
        name: "Stressni boshqarish",
      },
      { id: "6ba7b92c-9dad-11d1-80b4-00c04fd430c8", name: "Vazn nazorati" },
      { id: "6ba7b92d-9dad-11d1-80b4-00c04fd430c8", name: "Faol hayot tarzi" },
      {
        id: "6ba7b92e-9dad-11d1-80b4-00c04fd430c8",
        name: "Ruhiy salomatlikka e’tibor",
      },
    ],
  },
  {
    id: "550e8412-e29b-41d4-a716-446655440012",
    name: "Universitetlar",
    subDirections: [
      {
        id: "6ba7b930-9dad-11d1-80b4-00c04fd430c8",
        name: "O‘zbekiston Milliy universiteti (Mirzo Ulug‘bek nomidagi)",
      },
      {
        id: "6ba7b931-9dad-11d1-80b4-00c04fd430c8",
        name: "Toshkent axborot texnologiyalari universiteti (TATU)",
      },
      {
        id: "6ba7b932-9dad-11d1-80b4-00c04fd430c8",
        name: "Toshkent davlat iqtisodiyot universiteti (TDIU)",
      },
      {
        id: "6ba7b933-9dad-11d1-80b4-00c04fd430c8",
        name: "Toshkent davlat texnika universiteti (TDTU)",
      },
      {
        id: "6ba7b934-9dad-11d1-80b4-00c04fd430c8",
        name: "Toshkent davlat yuridik universiteti",
      },
      {
        id: "6ba7b935-9dad-11d1-80b4-00c04fd430c8",
        name: "Toshkent davlat pedagogika universiteti",
      },
      {
        id: "6ba7b936-9dad-11d1-80b4-00c04fd430c8",
        name: "Toshkent tibbiyot akademiyasi",
      },
      {
        id: "6ba7b937-9dad-11d1-80b4-00c04fd430c8",
        name: "Toshkent moliya instituti",
      },
      {
        id: "6ba7b938-9dad-11d1-80b4-00c04fd430c8",
        name: "Toshkent arxitektura-qurilish instituti",
      },
      {
        id: "6ba7b939-9dad-11d1-80b4-00c04fd430c8",
        name: "Toshkent temir yo‘l muhandislari instituti",
      },
      {
        id: "6ba7b93a-9dad-11d1-80b4-00c04fd430c8",
        name: "Jahon iqtisodiyoti va diplomatiya universiteti (JIDU)",
      },
      {
        id: "6ba7b93b-9dad-11d1-80b4-00c04fd430c8",
        name: "Inha universiteti Toshkentda",
      },
      {
        id: "6ba7b93c-9dad-11d1-80b4-00c04fd430c8",
        name: "Westminster universiteti Toshkentda (WIUT)",
      },
      {
        id: "6ba7b93d-9dad-11d1-80b4-00c04fd430c8",
        name: "Webster universiteti Toshkentda",
      },
      {
        id: "6ba7b93e-9dad-11d1-80b4-00c04fd430c8",
        name: "Turin politexnika universiteti Toshkentda",
      },
      {
        id: "6ba7b93f-9dad-11d1-80b4-00c04fd430c8",
        name: "Management Development Institute of Singapore (MDIS Tashkent)",
      },
      {
        id: "6ba7b940-9dad-11d1-80b4-00c04fd430c8",
        name: "Amity universiteti Toshkentda",
      },
      {
        id: "6ba7b941-9dad-11d1-80b4-00c04fd430c8",
        name: "Lomonosov nomidagi Moskva davlat universiteti Toshkent filiali",
      },
      {
        id: "6ba7b942-9dad-11d1-80b4-00c04fd430c8",
        name: "Akfa universiteti (hozirda: Central Asia University)",
      },
      {
        id: "6ba7b943-9dad-11d1-80b4-00c04fd430c8",
        name: "Yangi O‘zbekiston universiteti",
      },
      {
        id: "6ba7b944-9dad-11d1-80b4-00c04fd430c8",
        name: "Samarqand davlat universiteti",
      },
      {
        id: "6ba7b945-9dad-11d1-80b4-00c04fd430c8",
        name: "Samarqand davlat tibbiyot universiteti",
      },
      {
        id: "6ba7b946-9dad-11d1-80b4-00c04fd430c8",
        name: "Buxoro davlat universiteti",
      },
      {
        id: "6ba7b947-9dad-11d1-80b4-00c04fd430c8",
        name: "Buxoro tibbiyot instituti",
      },
      {
        id: "6ba7b948-9dad-11d1-80b4-00c04fd430c8",
        name: "Andijon davlat universiteti",
      },
      {
        id: "6ba7b949-9dad-11d1-80b4-00c04fd430c8",
        name: "Andijon davlat tibbiyot instituti",
      },
      {
        id: "6ba7b94a-9dad-11d1-80b4-00c04fd430c8",
        name: "Farg‘ona davlat universiteti",
      },
      {
        id: "6ba7b94b-9dad-11d1-80b4-00c04fd430c8",
        name: "Namangan davlat universiteti",
      },
      {
        id: "6ba7b94c-9dad-11d1-80b4-00c04fd430c8",
        name: "Namangan muhandislik-texnologiya instituti",
      },
      {
        id: "6ba7b94d-9dad-11d1-80b4-00c04fd430c8",
        name: "Nukus davlat universiteti",
      },
      {
        id: "6ba7b94e-9dad-11d1-80b4-00c04fd430c8",
        name: "Qarshi davlat universiteti",
      },
      {
        id: "6ba7b94f-9dad-11d1-80b4-00c04fd430c8",
        name: "Qo‘qon davlat pedagogika instituti",
      },
      {
        id: "6ba7b950-9dad-11d1-80b4-00c04fd430c8",
        name: "Urganch davlat universiteti",
      },
      {
        id: "6ba7b951-9dad-11d1-80b4-00c04fd430c8",
        name: "Termiz davlat universiteti",
      },
      {
        id: "6ba7b952-9dad-11d1-80b4-00c04fd430c8",
        name: "Jizzax politexnika instituti",
      },
      {
        id: "6ba7b953-9dad-11d1-80b4-00c04fd430c8",
        name: "Navoiy davlat konchilik instituti",
      },
    ],
  },
  {
    id: "550e8413-e29b-41d4-a716-446655440013",
    name: "IELTS/SAT",
    subDirections: [
      {
        id: "6ba7b960-9dad-11d1-80b4-00c04fd430c8",
        name: "IELTS kursiga yozilish",
      },
      {
        id: "6ba7b961-9dad-11d1-80b4-00c04fd430c8",
        name: "Har kuni yangi so‘z yodlash",
      },
      {
        id: "6ba7b962-9dad-11d1-80b4-00c04fd430c8",
        name: "Listening test mashqlari qilish",
      },
      {
        id: "6ba7b963-9dad-11d1-80b4-00c04fd430c8",
        name: "Reading matnlarini tahlil qilish",
      },
      {
        id: "6ba7b964-9dad-11d1-80b4-00c04fd430c8",
        name: "Writing task 1/2 yozish mashqlari",
      },
      {
        id: "6ba7b965-9dad-11d1-80b4-00c04fd430c8",
        name: "Speaking savollarni mashq qilish",
      },
      {
        id: "6ba7b966-9dad-11d1-80b4-00c04fd430c8",
        name: "Band score maqsadini belgilash",
      },
      {
        id: "6ba7b967-9dad-11d1-80b4-00c04fd430c8",
        name: "Rasmiy IELTS test topshirish",
      },
      {
        id: "6ba7b968-9dad-11d1-80b4-00c04fd430c8",
        name: "Mock testlarda qatnashish",
      },
      {
        id: "6ba7b969-9dad-11d1-80b4-00c04fd430c8",
        name: "Grammar va pronunciation ustida ishlash",
      },
      {
        id: "6ba7b96a-9dad-11d1-80b4-00c04fd430c8",
        name: "SAT kursiga yozilish",
      },
      {
        id: "6ba7b96b-9dad-11d1-80b4-00c04fd430c8",
        name: "Reading comprehension mashqlari",
      },
      {
        id: "6ba7b96c-9dad-11d1-80b4-00c04fd430c8",
        name: "Math bo‘yicha misollar ishlash",
      },
      {
        id: "6ba7b96d-9dad-11d1-80b4-00c04fd430c8",
        name: "Writing & Language qismida test bajarish",
      },
      {
        id: "6ba7b96e-9dad-11d1-80b4-00c04fd430c8",
        name: "Vocab builder ilovalaridan foydalanish",
      },
      {
        id: "6ba7b96f-9dad-11d1-80b4-00c04fd430c8",
        name: "Practice testlar ishlash",
      },
      {
        id: "6ba7b970-9dad-11d1-80b4-00c04fd430c8",
        name: "Rasmiy CollegeBoard resurslaridan foydalanish",
      },
      {
        id: "6ba7b971-9dad-11d1-80b4-00c04fd430c8",
        name: "Vaqtga nisbatan tez ishlashni mashq qilish",
      },
      {
        id: "6ba7b972-9dad-11d1-80b4-00c04fd430c8",
        name: "Qiyin savollarni tahlil qilish",
      },
      {
        id: "6ba7b973-9dad-11d1-80b4-00c04fd430c8",
        name: "SAT imtihoni sanasini rejalashtirish",
      },
    ],
  },
  {
    id: "550e8414-e29b-41d4-a716-446655440014",
    name: "Do’stlar",
    subDirections: [
      {
        id: "6ba7b980-9dad-11d1-80b4-00c04fd430c8",
        name: "Yangi do‘st topish",
      },
      {
        id: "6ba7b981-9dad-11d1-80b4-00c04fd430c8",
        name: "Eski do‘st bilan aloqani tiklash",
      },
      {
        id: "6ba7b982-9dad-11d1-80b4-00c04fd430c8",
        name: "Haftada bir marta uchrashuv qilish",
      },
      {
        id: "6ba7b983-9dad-11d1-80b4-00c04fd430c8",
        name: "Birgalikda kitob o‘qish / film ko‘rish",
      },
      {
        id: "6ba7b984-9dad-11d1-80b4-00c04fd430c8",
        name: "Do‘st bilan sportga borish",
      },
      {
        id: "6ba7b985-9dad-11d1-80b4-00c04fd430c8",
        name: "Do‘stga sovg‘a tayyorlash",
      },
    ],
  },
];

// Get all directions
export const getDirections = async (_req: Request, res: Response): Promise<Response | void> => {
    try {
        res.status(200).json({
            success: true,
            data: directionsData,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching directions',
            error: error.message,
        });
    }
};

// Get subdirections by direction ID
export const getSubDirections = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const directionId = req.params.id;
        const direction = directionsData.find(d => d.id === directionId);
        if (!direction) {
            return res.status(404).json({ success: false, message: 'Direction not found' });
        }
        res.status(200).json({
            success: true,
            data: direction.subDirections,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Error fetching subdirections',
            error: error.message,
        });
    }
};
