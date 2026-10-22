[中文版本 →](../../../zh/lectures/lecture-01-why-capable-agents-still-fail/)

> Kod örnekleri: [code/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/lectures/lecture-01-why-capable-agents-still-fail/code/)
> Uygulama projesi: [Proje 01. Yalnızca prompt vs. önce kurallar](./../../projects/project-01-baseline-vs-minimal-harness/index.md)

# Ders 01. Güçlü ajanlar neden hâlâ başarısız olur

Kendinizi yapay zeka dünyasında tecrübeli sayıyorsunuz — Claude Pro aboneliğiniz var, GPT-4o API anahtarınız hazır, SWE-bench liderlik tablosu rakamlarını ezbere biliyorsunuz. Bir gün nihayet gerçek bir projeyi büyük bir özgüvenle bir yapay zeka ajanına teslim ediyorsunuz. Sonuç? Bir özellik ekliyor ama testleri bozuyor, bir hatayı düzeltirken iki yenisini ekliyor, 20 dakika çalışıp gururla "tamam" diyor — siz koda bakıyorsunuz ve bu hiç de istediğiniz şey değil.

İlk içgüdünüz nedir? "Bu model yeterli değil. Yükseltme zamanı." Bir dakika durun. Cüzdanınıza uzanmadan önce, sorunun model olmama ihtimalini de düşünün.

29 Eylül 2025'te Anthropic, Claude Sonnet 4.5'in SWE-bench Verified üzerinde [%77,2 başarı oranına](https://www.anthropic.com/news/claude-sonnet-4-5) ulaştığını bildirdi. Bu sayı ilk bakışta fena görünmüyor — ama hemen sevinmeyin: bunlar net açıklamaları ve mevcut test senaryoları olan, özenle seçilmiş görevler. Günlük geliştirme ortamınıza geçin — belirsiz gereksinimler, mevcut testin olmaması, her yere dağılmış örtük iş kuralları — ve bu sayı yalnızca düşer.

Ama bu sayıların ardında sezgilere ters bir gerçek yatıyor.

## Aynı at, farklı kaderler

Anthropic aynı prompt'u ("2B retro oyun yapımcısı geliştir") ve aynı modeli (Opus 4.5) iki farklı harness altında karşılaştırdı. İlk koşu: çıplak, hiçbir destek yok — 20 dakika, 9 dolar; uygulama açıldı ama varlıklar girdiye yanıt vermedi. İkinci koşu: tam harness (planlayıcı + üretici + değerlendirici üç-ajan mimarisi) — 6 saat, 200 dolar; yazar bir varlığı hareket ettirebildi ama fizik pürüzlüydü ve bir duvar ilerlemeyi engelledi. [Temel oynanış çalıştı; uygulama tamamlanmadı.](https://www.anthropic.com/engineering/harness-design-long-running-apps)

Modeli değiştirmediler. Opus 4.5 yine Opus 4.5'ti. Değişen şey koşum takımıydı.

OpenAI'nin 2025 harness mühendisliği makalesi bunu açıkça söylüyor: iyi bir harness'a sahip bir depoda Codex "güvenilmez"den "güvenilir"e geçiyor. İfadeye dikkat edin — "biraz daha iyi" değil, niteliksel bir sıçrama. Tıpkı safkan bir at gibi: doğru koşum takımı olmadan binebilirsiniz ama uzağa gidemezsiniz, hızlı gidemezsiniz, düşmek de sürpriz olmaz. Harness işte o tam koşum takımıdır — **model ağırlıkları dışındaki tüm mühendislik altyapısı.**

## Ajanlar gerçekte nerede takılıyor

Peki tam olarak ne yanlış gidiyor?

En yaygın olanı: görevi hiçbir zaman net olarak tanımlamadınız. "Bir arama özelliği ekle" diyorsunuz ve ajanın anlayışı sizinkinden tamamen farklı — neyin araması? Tam metin mi yapılandırılmış mı? Sayfalama? Vurgulama? Belirtmediniz, ajan tahmin ediyor. Doğru bir tahmin şanstır; yanlış bir tahminin düzeltilmesi en başından net olmaktan çok daha pahalıya patlar. Bir restorana girip aşçıya "balık alacağım" demek gibi — haşlama mı, buğulama mı, sıcak tencerede mi geleceği tamamen şansa kalmış.

Belirtseniz bile, projenin ajanın bilmediği örtük mimari kuralları vardır. Takımınız SQLAlchemy 2.0 sözdiziminde standartlaştı, ama ajan varsayılan olarak 1.x kodu yazıyor. Tüm API uç noktaları OAuth 2.0 kimlik doğrulaması kullanmalı, ama bu kural yalnızca sizin kafanızda ve üç ay önceki bir Slack mesajında var. Ajan bunları göremez — uymak istemediğinden değil, bu kuralların var olduğunu kelimenin tam anlamıyla bilmiyor.

Ortam da bir tuzaktır. Eksik geliştirme ortamı, eksik bağımlılıklar, yanlış araç sürümleri. Ajan gerçek görevinizi çözmek yerine değerli bağlam penceresini `pip install` hatalarına ve Node sürüm uyuşmazlıklarına harcıyor. Yetenekli bir marangoz tutup ona çekiç, çivi ya da düzgün bir tezgâh sağlamayı unutmak gibi — ne kadar yetenekli olursa olsun, işi yapamaz.

Daha da yaygın olanı: doğrulamanın hiçbir yolu olmaması. Test yok, lint yok ya da doğrulama komutları ajana hiçbir zaman iletilmemiş. Ajan kodu yazıyor, ona bakıyor, iyi olduğuna karar veriyor, "tamam" diyor. Bir öğrenciden cevap anahtarı olmadan ödev teslim etmesini istemek gibi — doğru yaptıklarını sanıyorlar ama notlandırdığınızda bir yığın hata çıkıyor. Anthropic ilginç bir gözlem de yaptı: ajanlar bağlamın azaldığını sezdiklerinde bitirmek için acele ediyor, doğrulamayı atlıyor ve optimal yerine basit bir çözümü seçiyorlar. Buna "bağlam kaygısı" diyorlar — sınavda zamanın bittiğini fark edip kalan çoktan seçmeli sorularda rastgele tahmin yapmaya başladığınızda olanın aynısı.

Birden fazla oturuma yayılan uzun görevler daha da kötüdür — önceki oturumdaki tüm keşifler kaybolur ve her yeni oturum proje yapısını yeniden keşfetmek ve kod organizasyonunu yeniden anlamak zorunda kalır. Kalıcı duruma sahip olmayan ajanlar 30 dakikayı aşan görevlerde başarısızlık oranlarında sert bir artış görür.

## Temel terminoloji

Bu senaryolar göz önünde bulundurulduğunda bu kavramlar artık sadece jargon değil:

- **Yetenek farkı (Capability Gap)**: Modelin benchmark performansı ile gerçek görev performansı arasındaki büyük uçurum. Benchmark görevleri net hata açıklamaları, testler ve bir ortamla gelir; gerçek görevler bunları çoğu zaman sizin sağlamanızı gerektirir.
- **Harness**: Modelin dışındaki her şey — talimatlar, araçlar, ortam, durum yönetimi, doğrulama geri bildirimi. Eğer model ağırlığı değilse, harness'tır. "Koşum takımı" diye andığımız şey.
- **Harness kaynaklı başarısızlık (Harness-Induced Failure)**: Modelin yeterli yeteneği vardır ama yürütme ortamı yapısal kusurlara sahiptir. Yukarıdaki retro oyun karşılaştırması buna bir örnektir.
- **Doğrulama farkı (Verification Gap)**: Ajanın çıktısına olan güveni ile gerçek doğruluk arasındaki fark. Ajan iş bitmemişken "bitirdim" diyor — bu en yaygın başarısızlık modu.
- **Tanılayıcı döngü (Diagnostic Loop)**: Yürüt, başarısızlığı gözlemle, belirli bir harness katmanına ata, o katmanı düzelt, yeniden yürüt. Bu, harness mühendisliğinin temel metodolojisidir.
- **Bitirme tanımı (Definition of Done)**: Makine tarafından doğrulanabilir bir dizi koşul — testler geçer, lint temizdir, tip kontrolleri geçer. Açık bir bitirme tanımı olmadan ajan kendi tanımını uyduracaktır.

## Bir şey ters gittiğinde önce harness'ı düzeltin

Temel ilke: **Bir şey ters gittiğinde önce modeli değiştirmeyin — harness'ı kontrol edin.** Aynı model benzer, iyi yapılandırılmış görevlerde başarılı oluyorsa, sorunun harness'ta olduğunu varsayın. Bir arabanın bozulması gibi — hemen motoru suçlamazsınız. Önce yakıtı bitmiş mi diye bakarsınız.

Somut adımlar:

**Her başarısızlığı belirli bir katmana atfedin.** Sadece "model berbat" demeyin. Sorun: Görev belirsiz miydi? Bağlam yetersiz miydi? Doğrulama yöntemleri yok muydu? Her başarısızlığı beş başarısızlık katmanından birine eşleyin: görev belirleme, bağlam sağlama, yürütme ortamı, doğrulama geri bildirimi ve durum yönetimi. Bunlar pratik tanı katmanlarıdır, yukarıdaki altı sözlük terimi değildir. Bu alışkanlığı kazanın ve "model yeterince iyi değil" ifadesinin günlüklerinizde gittikçe azaldığını göreceksiniz.

**Her görev için açık bir Bitirme Tanımı yazın.** "Bir arama özelliği ekle" demeyin. Şunu söyleyin:
```
Tamamlanma kriterleri:
- Yeni uç nokta GET /api/search?q=xxx
- Sayfalama destekler, varsayılan 20 öğe
- Sonuçlar vurgulanmış parçalar içerir
- Tüm yeni kod pytest'i geçer
- Tip kontrolü geçer (mypy --strict)
```

**Bir AGENTS.md dosyası oluşturun.** Depo köküne koyarak ajana projenin teknoloji yığınını, mimari kurallarını ve doğrulama komutlarını söyleyin. Bu harness mühendisliğinin ilk adımı ve atabileceğiniz en yüksek getirili adımdır. Bir `AGENTS.md` dosyası daha pahalı bir modele yükseltmekten daha etkili olabilir — şaka yapmıyorum.

**Bir tanılayıcı döngü kurun.** Başarısızlıkları "model yine aptallık yapıyor" olarak değil, harness'ınızın bir kusuru olduğunun sinyali olarak ele alın. Her başarısızlıkta katmanı belirleyin, düzeltin, bir daha bu şekilde başarısız olmasın. Birkaç turdan sonra harness'ınız güçlenir ve ajan performansı sabitlenir. Yol tamiri gibi — kapattığınız her çukur bir sonraki bölümü daha pürüzsüz yapar.

**İyileştirmeleri ölçün.** Basit bir günlük tutun: her görev başarılı mı oldu başarısız mı, hangi katman başarısızlığa neden oldu. Birkaç turdan sonra hangi katmanın darboğaz olduğunu göreceksiniz — enerjinizi oraya odaklayın.

## Milyon satırlık deney

Ağustos 2025'te OpenAI'de üç mühendis iddialı bir deney başlattı: boş bir git deposundan tam bir iç ürün geliştirmek için yalnızca Codex kullanılacaktı. [Beş ay sonra depo yaklaşık bir milyon satır kod içeriyordu](https://openai.com/index/harness-engineering/) — uygulama mantığı, altyapı, araçlar, dokümantasyon, dahili geliştirici araçları — hepsi ajan tarafından üretilmişti. Ekip sonradan yedi mühendise çıktı; dönem boyunca yaklaşık 1.500 PR açıp birleştirdiler. Mühendis başına günde ortalama 3,5 PR.

Temel kısıt: **insanlar asla doğrudan kod yazmadı.** Bu bir gösteri değildi — mühendisin birincil işi artık kod yazmak değil, ortamları tasarlamak, niyeti ifade etmek ve geri bildirim döngüleri kurmak olduğunda neyin değiştiğini takımın anlamasını zorlamak için tasarlanmıştı.

Erken ilerleme beklenenden daha yavaştı. Codex yetersiz olduğu için değil, ortam yeterince eksiksiz olmadığı için — ajanın üst düzey hedefleri ilerletmek için gerekli araçlardan, soyutlamalardan ve dahili yapılardan yoksun olmasıydı. Mühendislerin işi şuna dönüştü: büyük hedefleri küçük yapı taşlarına bölmek (tasarım, kod, inceleme, test), ajanın bunları birleştirmesine izin vermek, ardından bu blokları daha karmaşık görevleri açmak için kullanmak. Bir şey başarısız olduğunda, düzeltme neredeyse hiçbir zaman "daha fazla dene" değildi — "ajanın hangi yetenekten yoksun olduğu ve bunu hem anlaşılır hem de yürütülebilir kılmak için ne yapabiliriz?" idi.

Bu deney bu dersin temel tezini doğrudan kanıtlıyor: **aynı model çıplak bir ortamda ve eksiksiz bir harness ile temelden farklı çıktı üretir.** Model değişmedi. Ortam değişti.

> Kaynak: [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)

## Daha somut bir örnek

Bir takım orta ölçekli bir Python web uygulamasına (FastAPI + PostgreSQL + Redis, ~15.000 satır kod) yeni bir API uç noktası eklemek için Claude Sonnet kullandı.

Başlangıçta yalnızca tek bir cümle verdiler: "`/api/v2/users` altında kullanıcı tercihleri uç noktaları ekle." Sonuç? Ajan, oturumun büyük bölümünü depo yapısını keşfetmek için harcadı, makul görünen ama projenin hata işleme kalıplarını izlemeyen kod üretti, eski SQLAlchemy sözdizimini kullandı ve uç nokta çalışma zamanı hataları içerirken tamamlandığını ilan etti. Sonraki oturumun tüm keşif çalışmasını yeniden yapması gerekti.

Daha sonra `AGENTS.md` (proje mimarisi ve teknoloji yığını sürümlerini açıklayan), açık doğrulama komutları (`pytest tests/api/v2/ && python -m mypy src/`) ve mimari karar kayıtları eklediler. Aynı model ardından projenin konvansiyonlarına uydu ve işini çalıştırabildiği komutlarla doğruladı.

Modeli değiştirmediler. Harness'ı değiştirdiler.

## Önemli çıkarımlar

- Model yeteneği ve yürütme güvenilirliği farklı şeylerdir. Safkan bir at hâlâ iyi bir koşum takımına ihtiyaç duyar.
- Bir şey ters gittiğinde önce harness'ı kontrol edin, sonra modeli. Model değiştirmek en pahalı seçenektir — ve çoğu zaman model sorunu bile değildir.
- Her başarısızlık bir sinyaldir: harness'ınızın yapısal bir kusuru var. Onu bulun, düzeltin.
- Beş savunma katmanı: görev belirleme, bağlam sağlama, yürütme ortamı, doğrulama geri bildirimi, durum yönetimi. Bir doktorun en yaygın nedenleri önce eleyerek yaptığı gibi sistematik olarak kontrol edin.
- Bir `AGENTS.md` dosyası daha pahalı bir modele yükseltmekten daha etkili olabilir. Cidden.

## Daha fazla okuma

- [OpenAI: Harness Engineering — Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [HumanLayer: Skill Issue — Harness Engineering for Coding Agents](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- [SWE-bench Liderlik Tablosu](https://www.swebench.com/)
- [Thoughtworks Technology Radar: Harness Engineering](https://www.thoughtworks.com/radar)

## Alıştırmalar

1. **Karşılaştırma deneyi**: İyi tanıdığınız bir kod tabanı ve önemsiz olmayan bir değişiklik görevi seçin. Önce ajanı harness desteği olmadan çalıştırın ve başarısızlıkları kaydedin. Sonra açık doğrulama komutları içeren bir `AGENTS.md` ekleyin ve aynı ajanla tekrar çalıştırın. Sonuçları karşılaştırın, her başarısızlığı beş savunma katmanından birine atfedin.

2. **Doğrulama farkı ölçümü**: 5 kod yazma görevi seçin. Her görevden sonra ajanın tamamlandığını iddia edip etmediğini kaydedin, ardından bağımsız testlerle gerçek doğruluğu doğrulayın. Ajanın aslında bitmemişken bittiğini iddia etme oranını hesaplayın — bu sizin doğrulama farkınızdır. Sonra düşünün: hangi doğrulama komutları bu oranı azaltırdı?

3. **Tanılayıcı döngü pratiği**: Projenizde ajanın tekrar tekrar başarısız olduğu bir görev bulun. Bir kez çalıştırın, başarısızlığı kaydedin. Beş katmandan birine atfedin. O katmanı düzeltin. Tekrar çalıştırın. Her seferinde iyileştirmeleri kaydederek üç ila beş tur tekrarlayın.
