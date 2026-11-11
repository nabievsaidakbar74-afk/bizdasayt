/**
 * "Fly to cart" animatsiyasi.
 *
 * Mahsulot rasmini karta ustidan olib, header'dagi savatcha ikonkasi
 * tomon uchiradi: rasm sekin kichrayib, biroz yuqoriga ko'tarilib
 * savatchaga "kirib ketadi". Animatsiya tugagach element o'chiriladi.
 *
 * Ishlatish: muvaffaqiyatli add-to-cart'dan keyin chaqiriladi.
 */

export const CART_TARGET_ID = "header-cart";

type FlyOptions = {
  /** Uchadigan rasm URL'i */
  imageSrc: string;
  /** Boshlanish nuqtasi (odatda karta rasmi elementi) */
  fromEl: HTMLElement | null;
  /** Animatsiya tugagach chaqiriladi (masalan, header badge'ni "siltitish") */
  onArrive?: () => void;
};

export function flyToCart({ imageSrc, fromEl, onArrive }: FlyOptions) {
  if (typeof document === "undefined" || !fromEl) return;

  const target = document.getElementById(CART_TARGET_ID);
  if (!target) return;

  const fromRect = fromEl.getBoundingClientRect();
  const toRect = target.getBoundingClientRect();

  // Boshlang'ich o'lcham — rasm elementi kengligining ~60%i
  const startSize = Math.min(fromRect.width * 0.6, 140);

  const ghost = document.createElement("img");
  ghost.src = imageSrc;
  ghost.alt = "";
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${fromRect.left + fromRect.width / 2 - startSize / 2}px`,
    top: `${fromRect.top + fromRect.height / 2 - startSize / 2}px`,
    width: `${startSize}px`,
    height: `${startSize}px`,
    objectFit: "cover",
    borderRadius: "16px",
    zIndex: "9999",
    pointerEvents: "none",
    boxShadow: "0 12px 32px rgba(17, 24, 45, 0.28)",
    willChange: "transform, opacity",
  } satisfies Partial<CSSStyleDeclaration>);

  document.body.appendChild(ghost);

  const deltaX =
    toRect.left + toRect.width / 2 - (fromRect.left + fromRect.width / 2);
  const deltaY =
    toRect.top + toRect.height / 2 - (fromRect.top + fromRect.height / 2);

  const animation = ghost.animate(
    [
      { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1, offset: 0 },
      // Avval biroz yuqoriga ko'tariladi — "sakrash" hissi
      {
        transform: `translate(${deltaX * 0.18}px, ${deltaY * 0.18 - 110}px) scale(0.85) rotate(-4deg)`,
        opacity: 1,
        offset: 0.3,
      },
      // Yo'lning o'rtasida keng yoy bilan uchadi
      {
        transform: `translate(${deltaX * 0.55}px, ${deltaY * 0.55 - 130}px) scale(0.5) rotate(3deg)`,
        opacity: 0.95,
        offset: 0.65,
      },
      {
        transform: `translate(${deltaX}px, ${deltaY}px) scale(0.1) rotate(8deg)`,
        opacity: 0.35,
        offset: 1,
      },
    ],
    {
      duration: 1300,
      easing: "cubic-bezier(0.25, 0.8, 0.35, 1)",
      fill: "forwards",
    }
  );

  // Ba'zi muhitlarda (yashirin/fonda tab) WAAPI animatsiyasi to'xtab
  // qolishi va onfinish hech qachon chaqirilmasligi mumkin —
  // shuning uchun setTimeout bilan zaxira tozalash ham qilamiz.
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    ghost.remove();
    // Savatcha ikonkasini kichik "siltitish" — yetib borganini sezdirish
    target.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.3)" },
        { transform: "scale(0.95)" },
        { transform: "scale(1)" },
      ],
      { duration: 450, easing: "ease-out" }
    );
    onArrive?.();
  };

  animation.onfinish = cleanup;
  setTimeout(cleanup, 1450);
}
