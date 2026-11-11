# DeepSeek Harness tasarımının incelenmesi

[DeepSeek Harness](https://deepseek.com/harness) (`dsh` komutu, `deepseek-ai/deepseek-harness` deposu), Ağustos 2026'da Developer Preview olarak yayımlandı. Resmî tanımı son derece doğrudandır: **Agent = Model + Environment + Tools + State** — model, ortam, araçlar ve durumdan oluşan dörtlü.

İlk üç ürünün incelemesi "harness nasıl tasarlanmalı" diye soruyorsa DeepSeek Harness daha radikal bir soru sorar: **harness belirli bir modelden ayrılıp bağımsız bir runtime olabilir mi?** Yanıtı evettir ve bu yaklaşımı son noktasına kadar götürür. [Mimari belgesindeki](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) özgün ifade şöyledir: *Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself* (model bağdaştırıcısı, araç kayıt defteri, session günlüğü ve hatta agent döngüsünün kendisi dâhil olmak üzere ürünün her parçası bir plugin'dir).

Bu yazıda üç noktaya odaklanıyoruz: plugin tabanlı çekirdek, yetenek eklemi (capability seam), olay hattı ve en güçlü mühendislik kısıtı olan "Model-visible means logged".

## Tek Cümlelik Konumlandırma

Geleneksel bir coding agent'ın yapısı "LLM + sabit agent döngüsü + sabit araç kümesi"dir. DeepSeek Harness'ın yapısı ise "model + plugin çekirdeği (Cordis)" biçimindedir. Çekirdek yalnızca plugin'lerin yüklenmesi, kaldırılması, bağımlılıkları ve olay mekanizmasından sorumludur; **agent'ın belirli yeteneklerinden hiçbirine sahip değildir**. [Mimari belgesindeki](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) özgün ifadeler şöyledir: "There is no privileged core to patch" (yama yapılması gereken ayrıcalıklı bir çekirdek yoktur) ve "you extend dsh by mounting a plugin beside the others" (çekirdeği değiştirmeden diğerlerinin yanına bir plugin bağlayarak dsh'yi genişletirsiniz). Bu, agent döngüsünün kendisinin bile dokunulmaz olmadığı anlamına gelir. DeepSeek modelini kullanıp Claude Code'un subagent'larını bağlayabilir; uzaktan sandbox, özel bellek, özel döngü ve özel UI ekleyerek yepyeni bir agent oluşturabilirsiniz.

Bu, dersteki "model ağırlıklarının dışındaki her şey harness'tır" ifadesinin en köklü uygulamasıdır: harness bağımsızsa onu bağımsız bir işletim sistemine dönüştürün.

## Mimari Çekirdek 1: Yetenek Eklemi (Capability Seam)

DeepSeek Harness, "yeteneği" Service ile temsil eder ve neredeyse her yeteneği üç katmana ayırır:

```
Service Definition
        ↓
Service Provider
        ↓
Consumer
```

Örneğin dosya sisteminde `FS Service` altında Local FS, E2B FS ve Remote FS gibi birden fazla Provider bulunur; üst katmana ise tek biçimli file tools sunulur. Shell, Subprocess, Sandbox, Web, LLM ve SubAgent aynı yapıyı kullanır. Bu üç katmanlı yapı bizim özetimiz değildir. [Mimari belgesinin Capability seams bölümündeki](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) özgün ifade şöyledir: *a seam is a swappable capability with three roles: a Service Definition declaring the interface, a Service Provider implementing it, and a Consumer using it, commonly a model-facing tool* (yetenek eklemi, üç rolü olan değiştirilebilir bir yetenektir: arayüzü bildiren Service Definition, onu uygulayan Service Provider ve onu kullanan, genellikle modele dönük bir araç olan Consumer).

Bu, harness mühendisliğinde uzun süredir var olan bir sorunu çözer: **Agent "belirli araçlara" mı, yoksa "yetenek arayüzlerine" mi bağımlı olmalıdır?** DeepSeek Harness ikinci seçeneği tercih eder. Ders açısından bu, "araç alt sisteminin" bir arayüz olarak standartlaştırılması demektir: Provider değiştirildiğinde ortam bütünüyle değişir, ancak modele sunulan araç yüzeyi aynı kalır.

## Mimari Çekirdek 2: Olay Hattı (Event Pipeline)

DeepSeek Harness'ın iç yapısı basit bir "LLM → araç → LLM" dizisi değildir. Her aşaması plugin'lerin dinleyebileceği bir olay noktası olan bir olay hattıdır:

```
turn/start → claim input → assemble（system prompt / context / tools）
  → agent/pre-step → step/start → LLM request（agent/request）→ llm/stream
  → assistant/message → tool/call
  → tools/pre-execute（permission / guard / policy / hook）
  → tools/execute → tools/post-execute → tool/result → step/end → next turn
```

(Yukarıdaki hat, [mimari belgesinin Turn flow bölümünün](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) aktarımıdır: `turn/*`, `step/*`, `user/message`, `assistant/*` ve `tool/*` kalıcı session olaylarıdır; `agent/pre-step`, `agent/request`, `llm/stream` ve `tools/*` ise plugin'lerin dinleyebildiği genişletme noktalarıdır.)

Bu tasarımın en büyük yararı şudur: **Pek çok özellik için agent döngüsünün kendisini değiştirmek gerekmez.** Araç çalıştırılmadan önce güvenlik denetimi mi yapmak istiyorsunuz? `tools/pre-execute` olayını dinleyin. Bellek mi eklemek istiyorsunuz? `agent/pre-step` aşamasında enjekte edin. Davranışları mı kaydetmek istiyorsunuz? Session olaylarına abone olun. Model isteğini mi değiştirmek istiyorsunuz? `agent/request` hook'unı kullanın. Muhakemenin sürüp sürmeyeceğine mi karar vermek istiyorsunuz? `agent/turn-stopping` olayını dinleyin.

On birinci dersteki "agent'ın çalışma sürecini gözlemlenebilir kılma" yaklaşımıyla karşılaştırıldığında DeepSeek Harness daha da ileri gider: Yalnızca "günlük eklemek" yerine **döngünün her adımını bir olay noktasına dönüştürür**. Böylece gözlemlenebilirlik, permissions, bellek ve politikalar döngüye sabit kodlanmak yerine dinleyici olarak bağlanır.

## Mimari Çekirdek 3: Session Event Log ve "Model-visible means logged"

DeepSeek Harness, **append-only Session Event Log (yalnızca eklenen session olay günlüğü)** kullanır ve son derece güçlü bir mühendislik kısıtı tanımlar. [Mimari belgesinin Session log bölümündeki](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) özgün ifade şöyledir:

> **Model-visible means logged.** Anything that reaches a model request must be reconstructable from the log, and a runtime invariant asserts it.

(Modelin görebildiği her şey günlüğe kaydedilmelidir. Bir model isteğine ulaşan her şey günlükten yeniden oluşturulabilmeli ve bir runtime değişmezi bunu zorunlu kılmalıdır.)

Başka bir deyişle gözlemlenebilirlik, sonradan eklenen günlüklerden ibaret değil, harness'ın birincil kısıtıdır: Model bağlamına giren her şey varsayılan olarak kaydedilmelidir. Bu, kapanış dersindeki "gözlemlenebilirlik harness'ın içinde yer alır" yaklaşımıyla doğrudan örtüşür ve "append-only" depolama tasarımını bir ilkeye dönüştürür: Günlüklere yalnızca ekleme yapılır, mevcut kayıtların üzerine yazılmaz ve session durumu yeniden oynatılabilir.

## Ders Çerçevesiyle Eşleştirme

| Alt sistem | DeepSeek Harness'ın uygulaması | Değerlendirme |
| --- | --- | --- |
| Talimatlar | Plugin tabanlıdır; kurallar/beceriler plugin olarak enjekte edilir | Son derece özgürdür, ancak yerleşik bir "CLAUDE.md" kuralı yoktur |
| Araçlar | Service Definition → Provider → Consumer yetenek eklemi | Araç alt sistemini standartlaştırmanın en uç örneği |
| Ortam | Sandbox/FS/Shell Provider'larının tamamı değiştirilebilir (uzak E2B dâhil) | Ortam bütünüyle takılıp çıkarılabilir |
| Durum | append-only Session Event Log + Model-visible means logged | Gözlemlenebilirlik birincil kısıttır |
| Geri bildirim | tools/pre-execute üzerindeki permission / guard / policy / hook | Geri bildirim mekanizması olaylara dönüştürülmüştür |

DeepSeek Harness ile diğer üç ürün arasındaki temel fark şudur: Pi, Claude Code ve Codex, "belirli bir agent'ın" içindeki harness'ı iyileştirir; DeepSeek Harness ise harness'ı **modelden bağımsız bir işletim sistemi** olarak tanımlar ve agent'ın kendisini bu OS üzerinde değiştirilebilir bir uygulama olarak görür. Bunun bedeli de açıktır: Yüksek özgürlük, yüksek yapılandırma maliyeti getirir. Bu, "işletim sistemi olarak harness" tasarımının doğal diğer yüzüdür (Developer Preview aşamasında da "erken deneyim, mekanizmalar hâlâ gelişiyor" yaklaşımıyla konumlandırılmıştır).

## Örnek Alınabilecek Tasarımlar

1. **Döngünün her adımını bir olay noktasına dönüştürün**: Permissions, bellek, politikalar ve günlükler döngüye sabit kodlanmak yerine dinleyici olarak bağlansın.
2. **Yetenek eklemlerini standartlaştırın**: "Belirli araçlara" değil, "yetenek arayüzlerine" bağımlı olun; böylece modele sunulan araç yüzeyi değişmeden ortam bütünüyle değiştirilebilir.
3. **Model-visible means logged**: Modelin görebildiği her şey kaydedilmelidir; gözlemlenebilirliği "ek avantaj" olmaktan çıkarıp "birincil kısıt" hâline getirin.
4. **append-only session günlüğü**: Durum yeniden oynatılabilir ve devir teslimi güvenilir olur; bu, "her session'dan sonra temiz bir durum bırakma"nın mühendislik güvencesidir.

## Referanslar (Özgün Metin / Kaynak Kod)

Her iddia, izlenime dayalı aktarımı önlemek için aşağıdaki özgün metne veya kaynak koda kadar izlenebilir:

- **DeepSeek Harness Ana Sayfası**: "Agent = Model + Environment + Tools + State" ürün tanımı, Developer Preview konumlandırması ve `dsh` komutu.<br/>https://deepseek.com/harness
- **deepseek-ai/deepseek-harness Deposu** (`dsh` komutu, MIT lisansı):<br/>https://github.com/deepseek-ai/deepseek-harness
- **architecture.md Mimari Belgesi**: Bu yazının en temel kaynağı — "Every part of the product is a plugin", "There is no privileged core to patch", Turn flow olay hattı, Capability seams'in üç rolü, "Model-visible means logged" ve runtime değişmezi, append-only Session Event Log, fs/tools/telemetry gibi yetenek eklemleri ve `ctx.*` alt sistemleri.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md
- **Mimari Belgesi · Tamamlayıcı Alt Belgeler**: Cordis çekirdeğine giriş (plugins contribute services, typed events, reversible effects), yetenek eklemi ayrıntıları ve Session alt sistemi.<br/>https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md ｜ https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/session.md

İlgili dersler: [Ders 11 · Gözlemlenebilirlik Neden Harness'ın İçinde Yer Almalıdır?](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/) ｜ [Ders 12 · Her Session Neden Temiz Bir Durum Bırakmalıdır?](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/) ｜ [Ders 2 · Harness Tam Olarak Nedir?](../../lectures/lecture-02-what-a-harness-actually-is/)
