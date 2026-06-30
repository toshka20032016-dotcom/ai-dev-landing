export const PROCESS_BY_SLUG = {
  blackcraftlab: [
    { title: "Figma-макет", description: "Сетка hero, калькулятор и pricing в единой неоновой системе.", tooltip: "12-колоночная сетка + UI-kit" },
    { title: "Логика JavaScript", description: "Калькулятор стоимости, квиз подбора услуг и валидация форм.", tooltip: "Vanilla JS модули" },
    { title: "Чистый HTML/CSS код", description: "Семантика, CSS Grid/Flexbox, glow через color-mix и токены.", tooltip: "Pixel-perfect вёрстка" },
    { title: "Готовая интеграция", description: "Деплой на Vercel, server actions, Lighthouse 90+.", tooltip: "Next.js App Router" },
  ],
  "villa-poseidon": [
    { title: "Figma-макет", description: "Scrollytelling-лендинг: hero, галерея, карта и бронирование.", tooltip: "Luxury hospitality UI" },
    { title: "Логика JavaScript", description: "Lenis smooth scroll, Framer Motion сцены, lazy-галерея.", tooltip: "Motion design" },
    { title: "Чистый HTML/CSS код", description: "Премиальная типографика, золотой акцент, адаптив 375–1440px.", tooltip: "Editorial layout" },
    { title: "Готовая интеграция", description: "Форма заявки, SEO-метаданные, оптимизированные WebP.", tooltip: "Production deploy" },
  ],
  bulochnaya: [
    { title: "Figma-макет", description: "Тёплый бутиковый лендинг: витрина, меню, доставка.", tooltip: "Food and bakery aesthetic" },
    { title: "Логика JavaScript", description: "Корзина, расчёт доставки, анимация добавления в заказ.", tooltip: "E-commerce UX" },
    { title: "Чистый HTML/CSS код", description: "Кремовая палитра, фото-галерея, мобильное меню.", tooltip: "Responsive bakery UI" },
    { title: "Готовая интеграция", description: "Оплата и Telegram-уведомления для заказов.", tooltip: "Онлайн-витрина" },
  ],
};

export const WEB_VITALS_BY_SLUG = {
  blackcraftlab: { lcp: "1.8", cls: "0.04", fid: "28" },
  "villa-poseidon": { lcp: "2.1", cls: "0.05", fid: "35" },
  bulochnaya: { lcp: "2.0", cls: "0.03", fid: "32" },
};