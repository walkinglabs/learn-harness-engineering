# Pi'nin harness tasarımının incelenmesi

[Pi](https://pi.dev/) (`@earendil-works/pi-coding-agent` npm paketi), kendisini "minimal agent harness", yani son derece yalın bir agent harness olarak tanımlar. Bu ifadeyi dikkatle okumaya değer: kendisini "en güçlü coding agent" ya da "en kullanışlı yapay zekâ programlama aracı" olarak değil, kesin biçimde bir **harness** olarak konumlandırır.

Bu yazıda Pi'yi dersin beş alt sistem çerçevesiyle (talimatlar, araçlar, ortam, durum ve geri bildirim) inceliyor; tasarım felsefesinin Claude Code ve Codex'ten temelde nasıl ayrıldığını ele alıyoruz. Yanıtı baştan verelim: **Pi'nin felsefesi "çekirdeği en aza indirmek + Extensions'ı programlanabilir kılmak"tır. Bağlam mühendisliğini sistem isteminin dışına taşır; harness'a Pi'nin sizin yerinize karar vermesi yerine kullanıcıların, hatta Pi'nin kendisinin müdahale edip harness'ı değiştirmesini sağlar.**

## Tek Cümlelik Konumlandırma

Pi yalın bir çekirdektir: Resmî konumlandırması çekirdeği bilinçli olarak küçük tutar ve karar yetkisini size geri verir. [pi.dev ana sayfasındaki](https://pi.dev/) özgün ifade şöyledir: "Ask Pi to build what you want, or install a package that does it your way"; harness'ı dört özelleştirilebilir katmana ayırır:

- **Extensions**: Pi yaşam döngüsü olaylarına bağlanan TypeScript hooks; runtime düzeyindeki programlanabilir yüzey.
- **Beceriler (Skills)**: Talimat ve araçlar içeren, gerektiğinde yüklenen yetenek paketleri; aşamalı açıklama (progressive disclosure).
- **İstem şablonları (Prompt templates)**: `/name` girildiğinde genişleyen, yeniden kullanılabilir Markdown istemleri.
- **Temalar (Themes)**: TUI görünümü.

Bu katmanlama yaklaşımının kendisi bir harness tasarımıdır: **"Model neyi, ne zaman görebilir" sorusunun yanıtını çekirdeğe sabitlemek yerine bütünüyle kurallara ve Extensions'a bırakır.**

## Temel Döngü

Pi, tüm coding agent'lar gibi özünde "muhakeme → araç çalıştırma → gözlem → yeniden muhakeme" biçiminde bir while döngüsüdür. Dikkate değer olan döngünün kendisi değil, Pi'nin döngünün dış katmanını ele alış biçimidir: Bağlam yönetimini döngü içindeki "compaction" işinden döngü dışındaki "kontrol" alanına genişletir.

Pi runtime'ı dışarıya programlanabilir bir arayüz sunar. [Kaynak kod README dosyasındaki Programmatic Usage](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) bölümünde etkileşimli TUI'nin yanı sıra betikleştirilebilir yazdırma/JSON modu, RPC protokolü ve SDK ile gömme desteği bulunur. Böylece aynı harness hem insanlar tarafından adım adım hem de CI/CD ya da başka programlar tarafından otomatik olarak çalıştırılabilir. Bu, on üçüncü dersteki "döngü mühendisliği" kapsamında "elle yürütmeden otomatik döngüye geçiş"in ön koşuluna karşılık gelir: Yalnızca insan etkileşimiyle çalışabilen bir harness hiçbir zaman otomatik döngüye giremez.

## Talimat Alt Sistemi: AGENTS.md ve SYSTEM.md

Pi, "talimatları" ölçülü ama net bir hiyerarşiyle ele alır:

- **AGENTS.md**: [Kaynak kod README dosyasındaki Project Context Files](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) bölümü yükleme sırasını açıkça belirtir: genel `~/.pi/agent/AGENTS.md` → üst dizinlerde kademeli gezinme → geçerli dizindeki `./AGENTS.md` (CLAUDE.md ile de uyumludur). Bu, "gerçekliğin kaynağı depodur" ilkesinin uygulanmasıdır: Talimatlar sohbet kutusundaki hatırlatmalar değil, dosyalardır.
- **SYSTEM.md**: [Pi'nin resmî belgelerine](https://pi.dev/docs/usage/project-context) göre varsayılan sistem istemi proje bazında değiştirilebilir (replace) veya genişletilebilir (append). Bu, Pi'nin "sistem istemine" müdahale etmeniz için sunduğu tek resmî giriş noktası ve aynı zamanda "ortamın kendini tanımlama" katmanıdır.

Pi, sistem isteminin kendisinin **son derece yalın** olduğunu özellikle vurgular. Bunun arkasında açık bir tercih vardır: Çekirdeği uzun "eğer... o zaman..." kurallarıyla doldurmak yerine genişletme noktaları bırakır ve kuralların yalnızca gerektiğinde beceri ve Extensions biçiminde ortaya çıkmasını sağlar. Bu yaklaşım dördüncü dersteki "tek bir dev talimat dosyası neden başarısız olur" sorusuyla doğrudan örtüşür. Pi, "yalın çekirdek + dosyalara ayırma + gerektiğinde yükleme" sayesinde dev talimat dosyası sorunundan doğal olarak kaçınır.

## Durum ve Bağlam: Pi'nin En İnce Ayrıntısına Kadar Ayırdığı Alan

Pi'nin bağlam mühendisliği özellikle incelenmeye değer; çünkü dersteki "bağlam sürekliliği" ve "bağlam bozulmasını önleme" kavramlarını somut mekanizmalara dönüştürür:

**1. Compaction programlanabilir.** Bağlam sınırına yaklaşırken eski mesajlar otomatik olarak özetlenir. [Pi'nin resmî belgeleri](https://pi.dev/docs/usage/sessions), compaction stratejisinin kendisinin **özelleştirilebilir** olduğunu belirtir: Extensions ile konu tabanlı compaction, kod farkındalığına sahip özetleme, hatta özetleme için farklı bir model kullanabilirsiniz. Kaynak kod README dosyasında varsayılan mekanizmanın ayrıntıları da görülebilir: Otomatik compaction iki durumda tetiklenir (bağlam taşmasından kurtarma / koruma eşiğini aşma), bölme noktası yakın zamandaki yaklaşık 20 bin token'ı korur ve önceki mesajlar bir "context handoff" hâlinde özetlenerek kademeli biçimde zincirleme compaction yapılır. Başka bir deyişle Pi, "nasıl compaction yapılacağını" değiştirilemez bir sabit değil, harness'ın bir parçası olarak görür.

**2. Dinamik bağlam (Dynamic context).** [Pi'nin resmî belgelerine](https://pi.dev/docs/usage/extensions) göre Extensions her muhakeme turundan önce mesaj ekleyebilir, mesaj geçmişini filtreleyebilir, RAG uygulayabilir ve uzun vadeli bellek oluşturabilir. Bu, "bağlam dolunca compaction" yaklaşımından bir adım öteye gider: Bilgiler bağlam penceresine girmeden önce neyin alınacağına ve neyin alınmayacağına karar vermenizi sağlar. Dersteki "agent'ın çalışma sürecini gözlemlenebilir ve hata ayıklanabilir kılma" ile "bağlam sürekliliğini koruma" hedefleri açısından Pi, bu iki işi Extension katmanına indirger.

**3. Session ağacı (Session tree).** [pi.dev ana sayfası](https://pi.dev/) açıkça "sessions are stored as trees" der: `/tree` ile geçmişteki herhangi bir düğüme dönüp devam edilebilir ve tüm dallar aynı dosyada saklanır. Bu, derste tekrar tekrar vurgulanan "session'lar arası bağlam kopukluğu" sorununu yalnızca özetlerle birbirine bağlamak yerine yapılandırılmış geçmişi yeniden oynatarak çözer. Dallar HTML olarak dışa aktarılabilir ya da gist olarak yüklenip paylaşılabilir; böylece gözlemlenebilirlik de sağlanır.

## Araç Alt Sistemi: Skills ve Extensions

Pi'nin "araçları" iki katmandan oluşur:

- **Beceriler (Skills)**: [Kaynak kod README dosyasındaki Skills bölümü](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) bunları açıkça "self-contained capability packages that the agent loads on-demand" olarak tanımlar; yani Agent Skills standardına uyan, talimat ve araçları içeren, gerektiğinde yüklenen yetenek paketleridir. Aşamalı açıklama sayesinde beceri ayrıntıları yalnızca tetiklendiğinde bağlama girer ve **istem önbelleğini şişirmez (prompt cache)**. Bu, maliyet açısından bir harness tasarımıdır: Bağlamdaki her ek token için her muhakeme turunda ödeme yapılır. Becerileri gerektiğinde yüklemek, "kılavuzu değil haritayı ver" ilkesinin başka bir ifadesidir.
- **Extensions**: Yerleşik yaşam döngüsü olaylarına bağlanan TypeScript hooks'tur. [Kaynak kod README dosyasındaki Hooks bölümü](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md) dört resmî kullanım örneği verir: tehlikeli komutları durdurmak (permissions kapısı), görev değişiminde kod durumunun checkpoint'ini almak, yolları korumak (`.env` gibi dosyalara yazmayı engellemek), araç çıktısını modele vermeden önce değiştirmek ve dışarıdan (dosya izleme/Webhook/CI) mesaj ekleyerek agent'ı uyandırmak. Bu hook API'leri `@mariozechner/pi-coding-agent/hooks` paketinden de dışa aktarılır. Topluluk harness'ı olan [pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness) ise bu hook yüzeyini skill-router, session-summary, extract-patterns ve telemetry gibi hazır Extensions ile daha da paketler.

Extensions Pi'nin en önemli tasarım kararıdır: **Kullanıcıya yalnızca birkaç anahtar sunmak yerine runtime'daki olay yüzeyinin tamamını açar.** Bellek mi eklemek istiyorsunuz? `agent/pre-step` aşamasında enjekte edin. Davranışları mı kaydetmek istiyorsunuz? Session olaylarına abone olun. Model isteğini mi değiştirmek istiyorsunuz? `agent/request` hook'unu kullanın. Pi'nin kendi harness'ını değiştirmesini bile sağlayabilirsiniz; bu, herhangi bir "yapılandırma seçeneğinden" çok daha fazla "programlanabilir harness" tanımına yaklaşır.

## Geri Bildirim ve Doğrulama: "Öğrenmeyi" de harness'a Dönüştürmek

Pi yerleşik olarak zorunlu test kapıları sunmaz (doğrulama komutlarını AGENTS.md içinde kullanıcı yazmalıdır). Ancak topluluk harness'ı [pi-agent-harness](https://github.com/LabidySabidy/pi-agent-harness), Extensions ile "geri bildirim döngüsünü" yapılandırır; resmî README dosyasının Hooks bölümü de benzer mekanizmaların temelini sunar:

- **session-summary** (pi-agent-harness Extension'ı): Sürekli güncellenen `PROGRESS.md` kayıtlarını tutar; bu, dersteki durum alt sistemi ve uzun görevlerde ilerleme takibidir.
- **extract-patterns** (pi-agent-harness Extension'ı): Session'lardan ders çıkarma adaylarını toplar ve `LESSONS.md` dosyasına işler; "her session sona ermeden önce iyi bir devir teslimi yapmayı" bir mutabakattan mekanizmaya dönüştürür.
- **telemetry** (pi-agent-harness Extension'ı): Token kullanımını, maliyeti vb. kaydeder; yani gözlemlenebilirlik sağlar.

Aynı topluluk deposu bu modeli daha da ileri götürür: `VISION.md` (hedef), `PROGRESS.md` (ilerleme), `LESSONS.md` (öğrenilen dersler) ve `STANDARDS.md` (standartlar) dosyalarının tümü Markdown biçimindedir ve session'lar arasında kalıcıdır. Bu, dersin önerdiği "gerçekliğin kaynağı depo + ilerleme dosyası + devir mekanizması" düzeniyle tamamen aynıdır; yalnızca Pi'nin Extension mekanizmasıyla kullanıma hazır bir katmana dönüştürülmüştür.

## Ders Çerçevesiyle Eşleştirme

Pi'yi dersin beş alt sistemine göre değerlendirelim (öznel bir karşılaştırmadır):

| Alt sistem | Pi'nin uygulaması | Değerlendirme |
| --- | --- | --- |
| Talimatlar | AGENTS.md hiyerarşik yükleme + SYSTEM.md | Hiyerarşi nettir, ancak kuralları kullanıcı yazmalıdır |
| Araçlar | Gerektiğinde yüklenen Skills + tüm yaşam döngüsünü kapsayan Extension hooks | Çok güçlü; araç sistemini programlanabilir bir yüzeye dönüştürür |
| Ortam | SYSTEM.md ortamın kendini tanımlamasını sağlar; runtime ortamı kullanıcı tarafından AGENTS.md içinde bildirilir | Mekanizma açıktır, ancak yeniden üretilebilirlik kullanıcının beyanına bağlıdır |
| Durum | Session ağacı + özelleştirilebilir compaction + PROGRESS.md | Çok güçlü; session'lar arası süreklilik ve kurtarılabilirlik temel odağıdır |
| Geri bildirim | Doğrulama komutlarını kullanıcı tanımlar; session-summary / extract-patterns bunları mekanizmaya bağlar | Mekanizma sağlanır, içerik kullanıcıya bağlıdır |

Pi'nin tercihi Claude Code / Codex ile belirgin bir karşıtlık oluşturur: Claude Code "bellek, permissions ve subagent'ları" yerleşik çekirdeğe koyarak kullanıma hazır sunar; Codex "depo kurallarını ve ortam yalıtımını" varsayılan hâle getirir. Pi ise **sizin yerinize hiçbir şeye karar vermemeyi** seçer ve karar yetkisini Extension noktalarına dönüştürür. Bunun bedeli, ya kendi Extensions'ınızı yazmanız ya da başkalarının paketlerini kurmanızdır.

## Örnek Alınabilecek Tasarımlar

1. **Compaction stratejisini takılabilir hâle getirin.** harness'ınızdaki "bağlamda nasıl compaction yapılır" sorusunun yanıtı sabit kodlanmış bir parametre değil, değiştirilebilir bir strateji arayüzü olmalıdır.
2. **Katı özetler yerine session ağacı kullanın.** Session'lar arası kurtarma her zaman "önceki turun özeti"ne dayanmak zorunda değildir; yapılandırılmış geçmişi yeniden oynatmak çoğu zaman daha güvenilir bir durum alt sistemidir.
3. **İstem önbelleğiyle uyumlu olun.** Becerileri gerektiğinde yükleyin ve tüm kuralları tek seferde sistem istemine doldurmayın. Bu hem bağlam hem de maliyet mühendisliğidir.
4. **Agent'ın kendi harness'ını değiştirebilmesini sağlayın.** harness'ın Extension yüzeyi yeterince açıksa "agent davranışını iyileştirme" işi agent tarafından yarı otomatik olarak yapılabilir.

## Referanslar (Özgün Metin / Kaynak Kod)

Her iddia, izlenime dayalı aktarımı önlemek için aşağıdaki özgün metne veya kaynak koda kadar izlenebilir:

- **pi.dev Ana Sayfası**: Özgün konumlandırma ifadesi "Ask Pi to build what you want, or install a package that does it your way", dört özelleştirilebilir katman ve session ağacı ("sessions are stored as trees", `/tree`, tek dosyada saklama, HTML olarak dışa aktarma / gist ile paylaşma).<br/>https://pi.dev/
- **pi.dev Resmî Belgeleri · Sessions**: Takılabilir compaction (topic-based / code-aware / farklı bir özetleme modeli kullanma), otomatik compaction ve dinamik bağlam ekleme mekanizmalarının açıklaması.<br/>https://pi.dev/docs/usage/sessions
- **pi.dev Resmî Belgeleri · Extensions**: Extensions'ın her muhakeme turundan önce mesaj eklemesi, geçmişi filtrelemesi, RAG uygulaması ve uzun vadeli bellek oluşturması.<br/>https://pi.dev/docs/usage/extensions
- **pi.dev Resmî Belgeleri · Project Context**: SYSTEM.md'nin replace / append semantiği.<br/>https://pi.dev/docs/usage/project-context
- **Pi Coding Agent Kaynak Kod README Dosyası** (badlogic/pi-mono): AGENTS.md'nin üç aşamalı yükleme sırası (genel → üst dizin → geçerli dizin), `/compact` ve otomatik compaction'ın tetiklenme koşulları ile 20 bin token'lık bölme noktası, Skills'in gerektiğinde yüklenmesi ve Agent Skills standardı, Hooks yaşam döngüsü ve dört resmî örnek kullanım alanı, Programmatic Usage (JSON / RPC / SDK).<br/>https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/README.md
- **pi-agent-harness Topluluk Deposu**: skill-router / session-summary / extract-patterns / telemetry Extensions'ı ve VISION.md / PROGRESS.md / LESSONS.md / STANDARDS.md dosya sistemi.<br/>https://github.com/LabidySabidy/pi-agent-harness

İlgili dersler: [Ders 2 · Harness Tam Olarak Nedir?](../../lectures/lecture-02-what-a-harness-actually-is/) ｜ [Ders 5 · Uzun Süren Görevler Neden Bağlam Sürekliliğini Kaybeder?](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/) ｜ [Ders 13 · Elle Yürütmeden Otomatik Döngüye](../../lectures/lecture-13-loop-engineering/)
