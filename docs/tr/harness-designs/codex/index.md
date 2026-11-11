# Codex'in harness tasarımının incelenmesi

OpenAI'ın [Codex](https://openai.com/index/harness-engineering/) ürünü, dört ürün arasında "özgün harness öğretisi"ne en sıkı bağlı olanı olabilir. Alanın adını tanımlayan Harness Engineering yazısı, OpenAI ekibinin Codex ile ürün geliştirirken edindiği deneyimlerin bir özetidir. Dolayısıyla Codex harness tasarımını incelemek, büyük ölçüde bu yazının arkasındaki mühendislik pratiğini incelemek demektir.

Codex felsefesi tek cümlede özetlenebilir: **Gerçekliğin kaynağı depodur (repository as the system of record), AGENTS.md yalnızca bir dizin sayfasıdır; mühendisliğin değeri ortamı tasarlamakta, niyeti ifade etmekte ve geri bildirim döngüleri kurmaktadır.**

## Tek Cümlelik Konumlandırma

OpenAI ekibi Codex kullanarak birkaç hafta içinde, sonunda bir milyon satırı aşan bir ürün teslim etti ve **kodun her satırını Codex yazdı** (özgün metin için [Harness Engineering](https://openai.com/index/harness-engineering/) yazısının "Designing for growth" bölümüne bakın). Bu pratik şu soruyu yanıtladı: Mühendisin rolü "kod yazmaktan" "harness tasarlamaya" dönüştüğünde sistem nasıl düzenlenmelidir? Codex CLI, Rust ile yazılmış açık kaynaklı monolitik bir ikili dosyadır ([github.com/openai/codex](https://github.com/openai/codex)); ancak harness'a asıl katkısı gösterişli genişletme noktalarından çok **kurallar (convention)** ve **bağlam mühendisliği** alanındadır.

## Talimat Alt Sistemi: AGENTS.md Bir Ansiklopedi Değil, Dizin Sayfasıdır

Bu, Codex'in harness teorisine kattığı en etkili tasarım ilkelerinden biridir:

> Tek bir dev talimat dosyası mekanik denetime (kapsam, güncellik durumu, sahiplik, çapraz bağlantılar) uygun değildir ve gerçeklikten sapması kaçınılmazdır. Bu nedenle AGENTS.md dosyasını artık bir ansiklopedi olarak değil, bir **dizin sayfası** olarak görüyoruz. Kod tabanı bilgisi yapılandırılmış belgelerde bulunur; AGENTS.md bunlara yönlendirir.

(Yukarıdaki metin, [Harness Engineering](https://openai.com/index/harness-engineering/) yazısının "AGENTS.md should be a directory page" bölümünün doğrudan aktarımıdır.)

Dördüncü ders "tek bir dev talimat dosyasının başarısız olacağını" söyler; Codex ise doğrudan doğru çözümü verir: AGENTS.md dosyasını yaklaşık 100 satırda tutun (özgün metin yaklaşık 100 satır önerir; sınıra yaklaşınca `docs/` altına bölün), sığmayan içeriği `docs/` dizinine ayırın ve agent'ın gerektiğinde okumasını sağlayın. Bu, "kılavuzu değil haritayı ver" ilkesinin yetkili kaynağıdır.

Buna eşlik eden ilke **uygulamayı mikro düzeyde yönetmek yerine değişmezleri uygulatmaktır** (özgün ifade: "don't micromanage the implementation; focus on invariants"). AGENTS.md yalnızca ihlal edilemez katı kısıtları ve doğrulama komutlarını içerir; uygulamanın ayrıntıları modele bırakılır. Bu, ikinci dersteki "mikro yönetim yerine kısıtlar" yaklaşımına doğrudan karşılık gelir.

## Bağlam Alt Sistemi: Write-Select-Compress-Isolate

Codex bağlam mühendisliği dört stratejiyle özetlenebilir. Bu çerçeve, "context engineering" bağımsız bir disiplin hâline geldikten sonra topluluk tarafından derlenmiş ve Codex'e eşlenmiştir (çerçeve için [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/) kaynağına bakın):

- **Write (dışarı yaz)**: Bağlamı pencerenin dışında kalıcılaştırın; sonuçları belgelere, durumu dosyalara yazın, konuşmada bırakmayın. "Gerçekliğin kaynağı depo" ilkesine karşılık gelir.
- **Select (içeri seç)**: Yalnızca gereken token'ları pencereye alın; tüm depoyu içeri doldurmak yerine AGENTS.md ile yönlendirin ve dosyaları gerektiğinde okuyun.
- **Compress**: Gerçekten önemli olanı koruyun. Codex otomatik compaction ve manuel `/compact` sunar; `compact_prompt` özelleştirilebilir (bkz. [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/)).
- **Isolate (yalıt)**: Bağlamı farklı sınırlara ayırın. Subagent'larla farklı görevlerin bağlamını yalıtın; böylece bir ön yüz subagent'ı arka ucun veritabanı schema'sını hiç görmez.

Codex ayrıca incelikli bir ortam bağlamı tasarımına sahiptir. [codex-harness-internals](https://github.com/AlexKenbo/codex-harness-internals) üzerine topluluk kaynak kod analizine göre `build_environment_update_item`, her turda tüm sistem bağlamını yeniden yapıştırmak yerine yalnızca ortam değiştiğinde **değişen alanları** (CWD, git dalı, dosya sistemi) çıktı olarak verir. Bu, "bağlamda tekrar eden token barındırmama"nın mühendislik ayrıntısıdır.

## Araçlar ve Sınırlar: worktree Yalıtımı + Subagent'lar

Codex'in iki temel harness mekanizması vardır:

**1. git worktree ile ortam yalıtımı.** [Harness Engineering](https://openai.com/index/harness-engineering/) yazısının "Environment" bölümü, her görevin bağımsız bir git worktree içinde; yerel gözlemlenebilirlik yığınıyla (günlükler, metrikler ve izler) birlikte çalıştırıldığını açıkça belirtir. Böylece her değişiklik bağımsız bir ortamda doğrulanır. Bu, yedinci dersteki "agent'ın her görevi için net sınırlar çizme" ilkesinin fiziksel uygulamasıdır. Sınır, talimatlarla rica edilmez; ortam yalıtımıyla zorunlu kılınır. Burada ortam (environment) alt sistemi katı bir yalıtıma dönüştürülmüştür.

**2. Çekirdek düzeyinde subagent'lar.** Codex'in `spawn_agent` / `wait_agent` araçları çekirdek düzeyindedir: Model açıkça subagent'lar oluşturur, her birine bağımsız session geçmişi ve araç kümesi verir ve sonuçları bekler. Subagent'lar üst düzey AGENTS.md talimatlarını devralır, ancak **kendi bağlamlarında** çalışır. Yapılandırma `.codex/agents/*.toml` altında tutulur ve farklı modeller ile talimatlar belirtilebilir (ayrıntılar için [Context Engineering for Codex CLI](https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/) kaynağındaki Sub-agents bölümüne bakın). Bu, "bağlam yalıtımı"nın doğrudan uygulaması ve on ikinci dersteki "devir teslimi" yaklaşımının da bir yansımasıdır: Her subagent, sınırları açıkça belirlenmiş bir iş birimidir.

## Geri Bildirim Alt Sistemi: Doğrulama Komutlarını Kurallara Yazmak

OpenAI pratiğinin en çok vurguladığı noktalardan biri, doğrulama komutlarını AGENTS.md içinde açıkça listelemek ve "doğru yapıldığını nasıl anlarız" sorusunun yanıtını deponun bir parçasına dönüştürmektir. Codex mühendislik akışında testler, CI, belgeler ve gözlemlenebilirlik yapılandırması tamamen Codex tarafından üretilir ve bunların tümü "çalıştırılabilir doğrulama yollarıdır". Güçlü ama güvenilmez bir modelin çözümü, modelin kendiliğinden doğru davranmasını ummak değil, **doğrulama yolunu harness'ın varsayılan bir bileşeni yapmaktır**.

Onay politikaları (approval policies) ve plan modu (plan mode), geri bildirimin diğer yönüdür: Yüksek riskli işlemlerden önce plan çıkarıp onay isteyerek "görev sınırlarını" ve "insanın karar yetkisini" runtime kontrolüne dönüştürür.

## Ders Çerçevesiyle Eşleştirme

| Alt sistem | Codex'in uygulaması | Değerlendirme |
| --- | --- | --- |
| Talimatlar | AGENTS.md dizin sayfası + docs/ dosyalarına ayırma + değişmezleri uygulatma | "Kılavuzu değil haritayı ver" ilkesini tanımlayan ders kitabı niteliğinde uygulama |
| Araçlar | worktree yalıtımı + spawn_agent subagent'ları | Sınırları ortamla katı biçimde yalıtır; çok güçlüdür |
| Ortam | Bağımsız worktree + gözlemlenebilirlik yığını | worktree yalıtımı ayırt edici özelliğidir |
| Durum | Write stratejisi (durumu dosyalara/belgelere yazma) | Yerleşik bellek yerine kurallara dayanır |
| Geri bildirim | Doğrulama komutlarını kurallara ekleme + onay politikaları + plan mode | Geri bildirim yolunu varsayılan hâle getirir; örnek alınmaya değerdir |

Codex ile Claude Code karşılaştırması ilginçtir: Claude Code "ekleme" yaklaşımıyla bellek, permissions ve subagent'ları çekirdeğe yerleştirir; Codex ise "çıkarma" yaklaşımıyla çekirdeği olabildiğince ölçülü tutar ve daha fazla sorumluluğu depo kurallarına ve bağlam mühendisliğine bırakır. Topluluğun sıkça "Codex'in harness felsefesi kodundan daha değerlidir" demesinin nedeni de budur.

## Örnek Alınabilecek Tasarımlar

1. **AGENTS.md dosyasını bir dizin sayfası olarak yazın**: Yaklaşık 100 satırda tutun, docs/ altındaki ayrıntılara yönlendirin ve mekanik olarak denetlenebilir kılın.
2. **Yalnızca değişmezleri yazın, uygulamayı mikro düzeyde yönetmeyin**: Katı kısıtları ve doğrulama komutlarını belirtin, gerisini modele bırakın.
3. **Ortam yalıtımı için worktree kullanın**: Görev sınırlarını talimatlarla rica etmek yerine ortamla zorunlu kılın.
4. **Ortam bağlamında yalnızca farkları aktarın**: Her turda yalnızca değişen alanları çıktılayın; sistem bağlamının tamamını tekrar tekrar yapıştırmayın.
5. **Bağlam yalıtımı için subagent'lar kullanın**: Görevleri bölerken bağlamı da bölün; alt görevlerin ana döngüyü kirletmesine izin vermeyin.

## Referanslar (Özgün Metin / Kaynak Kod)

Her iddia, izlenime dayalı aktarımı önlemek için aşağıdaki özgün metne veya kaynak koda kadar izlenebilir:

- **OpenAI, “Harness Engineering”**: AGENTS.md'nin dizin sayfası olması ve yaklaşık 100 satır önerisi, executive invariants / don't micromanage, worktree yalıtımı + gözlemlenebilirlik yığını, doğrulama komutlarının kurallara eklenmesi, bir milyon satırı aşan ürün örneği, onay politikaları ve plan mode. Bu yazıdaki tüm temel iddiaların başlıca kaynağı.<br/>https://openai.com/index/harness-engineering/
- **OpenAI'ın Resmî “AGENTS.md” Standardı** (AGENTS.md'nin araçlar arası bir convention standardı olması):<br/>https://openai.com/index/agents-md/
- **Codex CLI Açık Kaynak Deposu** (Rust ile yazılmış monolitik ikili dosya):<br/>https://github.com/openai/codex
- **Context Engineering for Codex CLI** (topluluk): Write-Select-Compress-Isolate çerçevesi, `/compact` ve `compact_prompt`, `spawn_agent` / `wait_agent` subagent'ları ve `.codex/agents/*.toml` yapılandırması.<br/>https://codex.danielvaughan.com/2026/06/10/context-engineering-codex-cli-write-select-compress-isolate-june-2026/
- **codex-harness-internals** (topluluk kaynak kod analizi): `build_environment_update_item` ile artımlı ortam bağlamı gibi uygulama ayrıntıları.<br/>https://github.com/AlexKenbo/codex-harness-internals

İlgili dersler: [Ders 3 · Kod Deposu Neden Tek Gerçeklik Kaynağı Olmalıdır?](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [Ders 4 · Talimatları Farklı Dosyalara Ayırmak](../../lectures/lecture-04-why-one-giant-instruction-file-fails/) ｜ [Ders 7 · Agent'ın Her Görevi İçin Net Sınırlar Çizmek](../../lectures/lecture-07-why-agents-overreach-and-under-finish/)
