/* ============================================================
   ПРАЙС «Мама сделала»
   Любочка, цены и названия меняются только здесь.
   price  — число (одна цена) или строка ("1250–2200")
   unit   — "/шт" для штучного, иначе ""
   photo  — путь к фото в папке img/ или null (тогда будет рисунок)
   art    — рисунок-заглушка, если фото нет: rose | tulip | heart | dome |
            eight | cone | box | wreath | nest | kulich | cake | bouquet
   Цены обновлены 25.09.2026 (+500 ₽ к прежнему прайсу).
   ============================================================ */
window.MAMA_PRICES = [
  // ── Шляпные коробки ────────────────────────────────────────
  { tab: "hat", name: "Шляпная коробка 20 см", desc: "Розы или тюльпаны на выбор, в нежной тишью и с лентой", price: 2000, unit: "", photo: "img/roses-pink-box.webp", art: "rose" },
  { tab: "hat", name: "Шляпная коробка 16 см", desc: "Компактный вариант: розочки в круглой коробке", price: 1500, unit: "", photo: "img/roses-hatbox.webp", art: "rose" },

  // ── Вёдра и букеты ─────────────────────────────────────────
  { tab: "bouquet", name: "Ведро с тюльпанами", desc: "Весенние зефирные тюльпаны в ведёрке, перевязанном лентой", price: 1800, unit: "", photo: "img/tulips-bucket.webp", art: "tulip" },
  { tab: "bouquet", name: "Ведро с розами", desc: "Пышные розы, каждый лепесток отсажен вручную", price: 2000, unit: "", photo: "img/roses-buckets.webp", art: "rose" },
  { tab: "bouquet", name: "Зефирный букет", desc: "Настоящая зефирная флористика. Заказ за 10 дней", price: 2800, unit: "", photo: "img/bouquet-course.webp", art: "bouquet" },
  { tab: "bouquet", name: "Пионовый букет", desc: "На пионы у нас всегда «сезон»", price: 2500, unit: "", photo: "img/peony-bouquet.webp", art: "rose" },
  { tab: "bouquet", name: "Мини-букет", desc: "Небольшой букетик: маленький повод, большая радость", price: "1250–2200", unit: "", photo: "img/mini-bouquet.webp", art: "bouquet" },

  // ── Ассорти ────────────────────────────────────────────────
  { tab: "assorti", name: "Коробка ассорти 20×20", desc: "Цветы, мандаринки и формы разных вкусов", price: "1700–1800", unit: "", photo: "img/assorti-box.webp", art: "box" },
  { tab: "assorti", name: "Большая коробка ассорти", desc: "Для большой семьи или целого отдела", price: 2200, unit: "", photo: "img/assorti-big.webp", art: "box" },
  { tab: "assorti", name: "Торт зефир-суфле", desc: "Ягодное пюре, бисквит, апельсиновый мармелад. В меру сладкий", price: 1700, unit: "", photo: "img/cake-souffle.webp", art: "cake" },

  // ── Штучное ────────────────────────────────────────────────
  { tab: "piece", name: "Клубничные сердечки", desc: "Хит к 14 февраля, в пакетике с атласной лентой", price: 570, unit: "/шт", photo: "img/hearts.webp", art: "heart" },
  { tab: "piece", name: "Купол с цветком", desc: "Роза, тюльпан, ёлочка или гномик под куполом", price: 750, unit: "", photo: "img/domes.webp", art: "dome" },
  { tab: "piece", name: "Зефирная «восьмёрка»", desc: "Маленький подарок к 8 Марта", price: 670, unit: "/шт", photo: "img/eight.webp", art: "eight" },
  { tab: "piece", name: "Зефирный рожок", desc: "Мороженое, которое не тает", price: 850, unit: "", photo: "img/cone.webp", art: "cone" },

  // ── Сезонное ───────────────────────────────────────────────
  { tab: "season", name: "Новогодняя коробка", desc: "Зефирные мандарины, снежки, хлопок и шампанское", price: 1800, unit: "", photo: "img/newyear-1.webp", art: "box" },
  { tab: "season", name: "Рождественский венок", desc: "Венок из роз, хлопка и мандаринок", price: 2500, unit: "", photo: "img/wreath.webp", art: "wreath" },
  { tab: "season", name: "Пасхальное гнездо", desc: "Зефирное гнёздышко со съедобными яйцами с миндалём", price: 680, unit: "/шт", photo: "img/easter-nests.webp", art: "nest" },
  { tab: "season", name: "Мини-кулич", desc: "Апельсиновое песочное печенье, шоколад и зефир. Диаметр 6 см, высота 11 см", price: 750, unit: "/шт", photo: "img/kulichi.webp", art: "kulich" }
];

window.MAMA_TABS = [
  { id: "hat", label: "Шляпные коробки" },
  { id: "bouquet", label: "Вёдра и букеты" },
  { id: "assorti", label: "Ассорти" },
  { id: "piece", label: "Штучное" },
  { id: "season", label: "Сезонное" }
];
