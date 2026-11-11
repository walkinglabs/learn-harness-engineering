# Claude Code'un harness tasarımının incelenmesi

Anthropic, [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) yazısında güvenilirliğin modelden değil harness'tan geldiğini ve agent'ın "modelin dışında" kısıtlanması gerektiğini açıkça savunur. Claude Code bu düşüncenin ürünleştirilmiş örneğidir; Anthropic de onu doğrudan **agentic harness** kategorisine yerleştirir. Bu yalnızca bir pazarlama söylemi değildir. Claude Code, bugün kamuya açık biçimde en ayrıntılı incelenmiş harness olabilir: Kaynak kodu açıktır, topluluk araştırma raporları ayrıntılıdır ve ders notlarındaki temel mekanizmaların neredeyse tamamını (katmanlı bellek, bağlam compaction, permissions, hooks, subagent'lar ve session kalıcılığı) eksiksiz bir ürün uygulamasına dönüştürür.

Bu yazıda Claude Code'u dersin beş alt sistem çerçevesiyle inceliyor; özellikle "bağlam yönetimi", "tamamlandığını erken ilan etmeyi önleme" ve "deterministik kısıtlar" gibi temel harness kavramlarını nasıl hayata geçirdiğine bakıyoruz.

## Tek Cümlelik Konumlandırma

Claude Code'un merkezinde basit bir while döngüsü bulunur: modeli çağır, aracı çalıştır, sonucu gözlemle, modeli yeniden çağır. Ancak **kodun büyük çoğunluğu bu döngüde değil, döngüyü çevreleyen sistemlerdedir**: permissions sistemi, bağlam compaction hattı, genişletme mekanizmaları, subagent orkestrasyonu ve session depolama. harness'ın özü budur: Döngü iskelettir; güvenilirliği belirleyen, iskeletin dışındaki her şeydir.

## Talimat Alt Sistemi: Katmanlı Bellek Yapısı

Claude Code'un bellek sistemi, harness teorisine yaptığı en doğrudan katkıdır ve dersteki "gerçekliğin kaynağı depo" ile "session'lar arası bağlam sürekliliği" konularına karşılık gelir. [Resmî How Claude remembers your project belgesi](https://code.claude.com/docs/en/memory) açıkça şunu söyler: Her session yepyeni bir bağlam penceresiyle başlar ve bilgi, session'lar arasında iki mekanizmayla taşınır: CLAUDE.md dosyaları (sizin yazdığınız talimatlar) ve auto memory (Claude'un kendi yazdığı notlar).

Resmî belgeler CLAUDE.md dosyalarını kapsamlarına göre dört sınıfa ayırır (yükleme sırasında genelden özele):

- **Kuruluş politikası düzeyi**: IT/DevOps tarafından merkezi olarak yönetilir (ör. `/etc/claude-code/CLAUDE.md`); şirket çapındaki standartları içerir.
- **Kullanıcı düzeyi `~/.claude/CLAUDE.md`**: Projeler arası kişisel tercihler ve kurallar.
- **Proje düzeyi `./CLAUDE.md` veya `./.claude/CLAUDE.md`**: Projenin gerçeklik kaynağı; mühendislik yapısı, teknoloji yığını ve doğrulama komutları. Depoyla paylaşılır.
- **Yerel düzey `./CLAUDE.local.md`**: Proje içindeki kişisel tercihler; genellikle `.gitignore` dosyasına eklenir ve commit edilmez.

Bunlara ek olarak iki mekanizma daha vardır:

- **Alt dizin düzeyinde gerektiğinde yükleme**: Alt dizinlerdeki CLAUDE.md başlangıçta yüklenmez; yalnızca Claude o dizindeki bir dosyayı okuduğunda bağlama girer.
- **Otomatik bellek (auto memory)**: Claude, düzeltmelerinize ve tercihlerinize dayanarak kendiliğinden notlar yazar. Bu notlar depo kapsamında paylaşılır, worktree'ler arasında geçerlidir ve her session'da en fazla ilk 200 satır ya da 25KB yüklenir.

Bu dört kapsam bir **talimat hiyerarşisi** oluşturur. Resmî belgelere göre "daha özel talimatlar bağlama daha sonra girer" (proje talimatları kullanıcı talimatlarından sonra gelir). Değeri şuradadır: Modelin her konuşmanın başında dev bir talimat metnini sindirmesi yerine talimatlar, kapsamlarına göre en yakın noktada yüklenir. Bu, dördüncü dersteki "tek bir dev talimat dosyası neden başarısız olur" sorusunun ürünleştirilmiş yanıtıdır.

## Bağlam Alt Sistemi: Beş Aşamalı Compaction Hattı

Claude Code'un bağlam yönetimi, yalnızca "dolunca özetle" yaklaşımı değil, **beş aşamalı bir compaction hattıdır** (five-layer compaction pipeline). Bu mimari ayrıntı, kaynak kod düzeyindeki [VILA Lab Dive into Claude Code](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf) incelemesinden gelir. Beşinci ders "uzun görevlerin sürekliliği kaybetmesini" ele alır; Claude Code'un çözümü çok aşamalı bir hunidir: Önce kayıpsız budama (gereksiz araç sonuçlarını kaldırma), ardından yapılandırılmış damıtma, en sonunda kayıplı LLM özeti; ayrıca aşırı compaction'ı önleyen devre kesici mekanizmalar.

Buna eşlik eden session depolama tasarımı **ekleme odaklı session depolamadır (append-oriented storage)**. Tüm geçmiş `history.jsonl` dosyasına eklenir; `/resume` ile kurtarma ve fork dallanması desteklenir. Böylece "her session sona ermeden önce iyi bir devir teslimi yapılır"; iyi hafıza sayesinde değil, depolama katmanı ekleme tabanlı ve yeniden oynatılabilir olduğu için.

## Araç Alt Sistemi: Dört Genişletme Mekanizması

Claude Code, genişletme yüzeyini dört sınıfa ayırır. Her sınıf farklı bir sorunu çözer ve bu, tasarımının en çok örnek alınmaya değer kısmıdır:

- **Beceriler (Skills)**: [Resmî belgelere](https://code.claude.com/docs/en/skills) göre `SKILL.md` ile tanımlanan prosedürel bilgidir; tetikleyici sözcüklere göre otomatik yüklenir ve aşamalı açıklamayı kullanır. "Bir işin nasıl yapılacağına" ilişkin alan bilgisine uygundur.
- **MCP**: [Resmî belgelerdeki](https://code.claude.com/docs/en/mcp) JSON-RPC protokolüyle dış sistemlere bağlanır; "modelin elini dış dünyaya uzatan" standart arayüzdür.
- **Hooks**: [Resmî belgelere](https://code.claude.com/docs/en/hooks) göre `PreToolUse`, `PostToolUse`, `Stop` ve benzeri yaşam döngüsü olaylarına bağlanan deterministik betiklerdir.
- **Plugin'ler / Subagent'lar**: [Resmî belgelere](https://code.claude.com/docs/en/sub-agents) göre karmaşık görevleri uzmanlaşmış agent'lara ayırır.

Temel tasarım kararı **sorumlulukların ayrılmasıdır**: CLAUDE.md "ne olduğunu", beceriler "nasıl yapılacağını", MCP "nereye bağlanılacağını", hooks ise "ne zaman zorlanacağını" yönetir. Ekipler bu katmanları birbirine karıştırırsa (örneğin MCP'nin yapması gereken işi CLAUDE.md içine yazarsa) derste anlatılan bağlam sızıntısı ortaya çıkar.

## Geri Bildirim ve Doğrulama: Deterministik Kısıtlar + İnsan-Agent İş Bölümü

Onuncu ders, "yalnızca uçtan uca akış çalıştırıldığında gerçek doğrulama yapılmış olur" der. Claude Code bunun için iki kanallı bir mekanizma kullanır:

**1. Permissions sistemi (deterministik kısıtlar).** Claude Code'un permissions yaklaşımı "her şeyi sor" değildir; yedi mod ve ML tabanlı bir sınıflandırıcıdan oluşur. Düşük riskli işlemler serbest bırakılır, yüksek riskli işlemler ise politikaya göre sorulur ya da reddedilir (mimari ayrıntılar için [VILA Lab incelemesine](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf) bakın). Böylece "agent için net sınırlar çizmek" (Ders 7), istemlerle ricada bulunmak yerine runtime'da zorunlu hâle getirilir.

**2. Hooks (tamamlandığını erken ilan etmeyi önleme).** `PostToolUse` hook'u araç çalıştıktan sonra kontrolleri zorunlu olarak çalıştırabilir ve sonuçları yeniden bağlama yazabilir; `Stop` hook'u agent tamamlandığını ilan ettiğinde devreye girer. Böylece "işi yapan ile kontrol eden ayrılır". [Anthropic, harness yazısında](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) agent'ın kendi çalışmasını kendinden emin biçimde övdüğünü ("confidently praised their work") açıkça gözlemlemiştir. Bu nedenle modelin kendi değerlendirmesine güvenmek yerine hooks ile **deterministik** kontroller eklenir.

**3. Subagent'lar (bağlam yalıtımı).** Her subagent'ın konuşma kaydı ayrı bir sidechain dosyasında tutulur ve **üst agent'ın bağlamını şişirmez** (bkz. [VILA Lab incelemesi](https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf)). Bu, "görev sınırı" ile "bağlam yalıtımı"nı birleştirir: Görevler ayrılırken bağlam kirlenmesi de yalıtılır.

## Gözlemlenebilirlik ve Session Kalıcılığı

Claude Code'un günlüğü ekleme tabanlı eksiksiz bir kayıttır (history.jsonl). `/compact`, `/clear` ve `/init` gibi açık komutlar sayesinde bağlamın dolmasını pasifçe beklemek yerine bağlam durumunu etkin biçimde yönetebilirsiniz. `/init`, "agent'ı her işten önce başlatma" yaklaşımını (Ders 6) bir komuta dönüştürür. [Resmî belgelere](https://code.claude.com/docs/en/memory) göre kod tabanını otomatik analiz eder ve ilk CLAUDE.md dosyasını (derleme komutları, test talimatları ve mühendislik kurallarıyla birlikte) üretir.

## Ders Çerçevesiyle Eşleştirme

| Alt sistem | Claude Code'un uygulaması | Değerlendirme |
| --- | --- | --- |
| Talimatlar | Kapsam katmanları (kuruluş/kullanıcı/proje/yerel) + otomatik bellek | Katmanlı bellek için örnek uygulama |
| Araçlar | Beceriler + MCP + hooks + subagent'lardan oluşan dört genişletme türü | Sorumluluk ayrımı nettir ve temel güçlü yönüdür |
| Ortam | Proje içi ayarlar + settings.json | Kullanıcının CLAUDE.md içinde yaptığı tanıma dayanır |
| Durum | Ekleme tabanlı session depolama + beş aşamalı compaction + resume/fork | Çok güçlü; uzun görev sürekliliği için referans uygulama |
| Geri bildirim | Permissions sınıflandırıcısı + PostToolUse hook'uyla zorunlu kontrol | "Tamamlandığını erken ilan etmeyi önleme"yi deterministik bir mekanizmaya dönüştürür |

## Örnek Alınabilecek Tasarımlar

1. **Talimatları kapsama göre katmanlandırın**; tek dosyada yığmayın. Dizin düzeyindeki CLAUDE.md, "en yakın noktada yükleme"nin zarif bir uygulamasıdır.
2. **Compaction'ı kademeli bir huni olarak tasarlayın**: Önce kayıpsız, sonra kayıplı yöntemleri kullanın; doğrudan tam metin özetine geçmeyin.
3. **Deterministik kontroller için hooks kullanın**: Tamamlandığını erken ilan etmeyi istemlerle ricada bulunarak değil, runtime zorlamasıyla önleyin.
4. **Subagent bağlamlarını yalıtın**: Görevleri bölerken bağlamı da bölün; alt görevlerin sonuçlarının ana döngüyü kirletmesine izin vermeyin.
5. **Session depolamasını ekleme tabanlı ve yeniden oynatılabilir yapın**: Devir teslimi belleğe değil, depolama katmanının güvencesine dayanır.

## Referanslar (Özgün Metin / Kaynak Kod)

Her iddia, izlenime dayalı aktarımı önlemek için aşağıdaki özgün metne veya kaynak koda kadar izlenebilir:

- **Claude Code Resmî Belgeleri · Memory**: Her session için yepyeni bir bağlam, CLAUDE.md'nin dört kapsam türü, alt dizinlerin gerektiğinde yüklenmesi, auto memory (200 satır / 25KB) ve `/init` ile CLAUDE.md oluşturulması.<br/>https://code.claude.com/docs/en/memory
- **Claude Code Resmî Belgeleri · Skills / MCP / Hooks / Sub-agents**: Dört genişletme mekanizmasının tanımları ve olayları (PreToolUse / PostToolUse / Stop).<br/>https://code.claude.com/docs/en/skills ｜ https://code.claude.com/docs/en/mcp ｜ https://code.claude.com/docs/en/hooks ｜ https://code.claude.com/docs/en/sub-agents
- **VILA Lab, “Dive into Claude Code”** (kaynak kod düzeyinde inceleme raporu): Beş aşamalı compaction hattı, yedi permissions modu + ML sınıflandırıcısı, sidechain subagent'ları ve ekleme tabanlı session depolama history.jsonl.<br/>https://zhiqiangshen.com/projects/Claude_Code_Report/Claude_Code_Report.pdf
- **Anthropic, “Effective harnesses for long-running agents”**: “Güvenilirlik modelden değil harness'tan gelir”, agent'ın kendi çalışmasını kendinden emin biçimde övmesi ve doğrulama için hooks kullanılması gibi görüşlerin kaynağı.<br/>https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- **Claude Code Full Stack Rehberi** (topluluk; CLAUDE.md / Skills / MCP / Subagents / Hooks katmanları): Genişletme mekanizmalarındaki sorumluluk ayrımına ilişkin tamamlayıcı okuma.<br/>https://jsmanifest.com/claude-code-full-stack-guide

İlgili dersler: [Ders 3 · Kod Deposu Neden Tek Gerçeklik Kaynağı Olmalıdır?](../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/) ｜ [Ders 9 · Agent'lar Neden Zaferi Erken İlan Eder?](../../lectures/lecture-09-why-agents-declare-victory-too-early/) ｜ [Ders 10 · Uçtan Uca Test Sonuçları Neden Değiştirir?](../../lectures/lecture-10-why-end-to-end-testing-changes-results/)
