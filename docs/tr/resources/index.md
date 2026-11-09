# Türkçe Kaynak Kütüphanesi

Bu klasör, kurs yöntemlerini gerçek bir depoda kullanabileceğiniz, kopyalamaya
hazır şablonlara ve derli toplu referanslara dönüştürür.

## Ne Zaman Kullanılır

Codex, Claude Code veya başka bir kod yazma ajanının; kurulumu, durumu ve
kapsamı her seferinde yeniden çıkarmak zorunda kalmadan birden fazla oturum
boyunca çalışmasını istediğinizde buradan başlayın.

Özellikle şu durumlarda faydalıdır:

- iş birden fazla oturuma yayılıyorsa
- özellikler çok sayıdaysa ve yarım bırakılması kolaysa
- ajanlar zaferi çok erken ilan etme eğilimindeyse
- başlatma adımları her seferinde yeniden keşfediliyorsa

## Buradan Başlayın

Minimal bir kurulum için şunlarla başlayın:

- kök talimatlar: [`templates/AGENTS.md`](./templates/AGENTS.md) veya [`templates/CLAUDE.md`](./templates/CLAUDE.md)
- özellik durumu: [`templates/feature_list.json`](./templates/index.md#feature-list-json)
- ilerleme günlüğü: [`templates/claude-progress.md`](./templates/claude-progress.md)
- başlangıç betiği referansı: `docs/tr/resources/templates/init.sh`

Ardından şunları ekleyin:

- oturum devri: [`templates/session-handoff.md`](./templates/session-handoff.md)
- temiz çıkış kontrol listesi: [`templates/clean-state-checklist.md`](./templates/clean-state-checklist.md)
- değerlendirici rubriği: [`templates/evaluator-rubric.md`](./templates/evaluator-rubric.md)

"Harness engineering" yazısındaki daha kapsamlı OpenAI tarzı depo yapısını
istiyorsanız, gelişmiş paketi kullanın:

- [`openai-advanced/index.md`](./openai-advanced/index.md)

## Kütüphane Yapısı

- [`templates/`](./templates/index.md): gerçek bir depoya kopyalanacak şablonlar
- [`reference/`](./reference/index.md): yöntem notları, başlatma akışı ve hata modu haritaları
- [`openai-advanced/`](./openai-advanced/index.md): gelişmiş depo iskeleti,
  kayıt sistemi belgeleri ve ajan öncelikli yönetişim şablonları

## Önerilen Minimal Paket

- `AGENTS.md` veya `CLAUDE.md`
- `feature_list.json`
- `claude-progress.md`
- `init.sh`

Bu dört dosya, çoğu ajan iş akışını gözle görülür biçimde daha kararlı hale
getirmek için yeterlidir.

Depo; birden fazla alanı, aktif planları, kalite puanlamasını ve güvenilirlik
politikalarını içeren daha uzun ömürlü bir sisteme dönüştüğünde, minimal paketi
gereğinden fazla zorlamak yerine
[`openai-advanced/`](./openai-advanced/index.md) paketine geçin.
