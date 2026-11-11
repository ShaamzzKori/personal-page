# Favicon — промт и техспека

## 1. Промт для генератора изображений (EN, работает в Midjourney / Flux / SDXL / DALL·E)

> Minimal app icon, square 1:1, flat vector logo mark: a solid circle with the Cyrillic
> monogram "ДШ" centered inside, letters drawn as bold geometric sans-serif forms merged
> into one compact silhouette, generous negative space, single accent color — burnt
> terracotta #A9551F on a warm off-white #FBF8F3 background. No gradients, no shadows,
> no bevels, no outlines, no extra text. Centered, optically balanced, 12% padding,
> crisp edges, high contrast, readable when scaled down to 16×16 pixels. Style: Swiss
> editorial, precise geometry, professional personal brand. Output: 1024×1024, plain
> background, no photo textures.

Negative prompt:
> photorealistic, 3d render, glossy, drop shadow, gradient, texture, noise, clipart,
> emoji style, thin hairline strokes, serif letters, multiple colors, watermark,
> mockup, phone frame, perspective, rotated, small text, unreadable letters

Русская версия того же промта:

> Минималистичная иконка приложения, квадрат 1:1, плоский векторный знак: сплошной круг
> с монограммой «ДШ» по центру, буквы — жирные геометрические формы без засечек,
> объединённые в единый силуэт, много воздуха, один акцентный цвет — терракота #A9551F
> на тёплом фоне #FBF8F3. Без градиентов, теней, скосов, контуров и лишнего текста.
> Читаемость при уменьшении до 16×16 px. Стиль: швейцарская типографика, чистая
> геометрия, профессиональный личный бренд. 1024×1024, однотонный фон.

## 2. Что именно нужно получить

| Файл | Размер | Требования |
|---|---|---|
| `favicon.ico` | 16, 32, 48 | многокадровый ico, без сглаженного «мыла» |
| `favicon-16x16.png` | 16×16 | проверяется глазами: буквы ещё различимы |
| `favicon-32x32.png` | 32×32 | основной в браузерной вкладке |
| `apple-touch-icon.png` | 180×180 | **без прозрачности**, фон заливкой, скругления рисует iOS |
| `icon-192.png` | 192×192 | для `manifest.webmanifest` |
| `icon-512.png` | 512×512 | для `manifest.webmanifest` |
| `icon-maskable-512.png` | 512×512 | safe zone 80%: знак уменьшен и центрирован, фон до краёв |
| `og-cover.jpg` | 1200×630 | для соцсетей: знак + имя + подпись |

Правила, без которых комплект выглядит кустарно:

- **Никакой прозрачности в apple-touch и maskable** — iOS/Android заливают прозрачное чёрным.
- **16×16 — это тест.** Две буквы в круге на 16 px часто слипаются: если так — для 16 и 32
  сгенерируйте отдельный упрощённый вариант (только «Д» либо только круг с точкой).
- **Толщина штриха** — не меньше 1/8 высоты иконки, иначе на 16 px исчезает.
- **Фон не белый**, а `#FBF8F3` (как у сайта) — иначе во вкладке выпадает из палитры.
- Тёмная тема браузера: сделайте инверсный вариант (`#E2904F` знак на `#131110`) и
  положите как `icon-dark-192.png`; в `manifest` он не нужен, но пригодится для `<link media>`.

## 3. Нарезка из одного мастера 1024×1024

ImageMagick:

```bash
cd img/favicons
M=master-1024.png
magick "$M" -resize 16x16  favicon-16x16.png
magick "$M" -resize 32x32  favicon-32x32.png
magick "$M" -define icon:auto-resize=48,32,16 favicon.ico
magick "$M" -resize 180x180 -background "#FBF8F3" -flatten apple-touch-icon.png
magick "$M" -resize 192x192  icon-192.png
magick "$M" -resize 512x512  icon-512.png
magick "$M" -resize 410x410 -background "#FBF8F3" -gravity center -extent 512x512 icon-maskable-512.png
```

Python + Pillow (если ImageMagick нет):

```python
from PIL import Image

src = Image.open("master-1024.png").convert("RGBA")
out = "img/favicons/"
for size in (16, 32, 180, 192, 512):
    src.resize((size, size), Image.LANCZOS).save(f"{out}icon-{size}.png")
src.resize((16, 16), Image.LANCZOS).save(f"{out}favicon-16x16.png")
src.resize((32, 32), Image.LANCZOS).save(f"{out}favicon-32x32.png")
src.resize((48, 48), Image.LANCZOS).save(
    f"{out}favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)]
)

flat = Image.new("RGB", (180, 180), "#FBF8F3")
flat.paste(src.resize((180, 180), Image.LANCZOS), (0, 0), src.resize((180, 180), Image.LANCZOS))
flat.save(f"{out}apple-touch-icon.png")
```

## 4. Разметка в `<head>` (когда файлы появятся)

```html
<link rel="icon" href="/img/favicons/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/img/favicons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/img/favicons/favicon-16x16.png">
<link rel="apple-touch-icon" href="/img/favicons/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

`site.webmanifest`:

```json
{
  "name": "Дмитрий Штаненко — ИТ-специалист",
  "short_name": "Штаненко",
  "icons": [
    { "src": "/img/favicons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/img/favicons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/img/favicons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "theme_color": "#FBF8F3",
  "background_color": "#FBF8F3",
  "display": "standalone",
  "start_url": "/"
}
```

## 5. Чек-лист приёмки

- [ ] 16×16 во вкладке читается, буквы не сливаются.
- [ ] На тёмной панели вкладок иконка не проваливается (проверить инверсный вариант).
- [ ] apple-touch-icon без прозрачности, знак не обрезан скруглением iOS.
- [ ] maskable: при круглой маске знак целиком внутри safe zone.
- [ ] `favicon.ico` содержит 16/32/48 (проверка: `identify favicon.ico`).
