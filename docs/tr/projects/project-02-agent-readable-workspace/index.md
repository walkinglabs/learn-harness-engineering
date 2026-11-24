[中文版本 →](../../../zh/projects/project-02-agent-readable-workspace/)

> İlgili dersler: [Ders 03. Depoyu tek doğruluk kaynağınız yapın](./../../lectures/lecture-03-why-the-repository-must-become-the-system-of-record/index.md) · [Ders 04. Talimatları dosyalara bölün](./../../lectures/lecture-04-why-one-giant-instruction-file-fails/index.md)
> Şablon dosyaları: [templates/](https://github.com/walkinglabs/learn-harness-engineering/blob/main/docs/en/resources/templates/)

# Proje 02. Projeyi okunabilir kılın ve kaldığınız yerden devam edin

## Ne Yapacaksınız

Depoya "okunabilirlik" ekleyin; böylece yeni bir ajan proje yapısını hızla anlayabilsin, mevcut ilerlemeyi bilsin ve çalışmayı sürdürebilsin. Somut olarak: doküman içe aktarma, doküman detay görünümü ve yerel kalıcılığı, iki oturuma yayılı şekilde tamamlayın.

Her iki çalışmaya da `starter/` içindeki aynı kodla başlayın. İlkinde starter’ın harness’ini kullanın ve devir notu yazmayın. İkincisinde devir kuralları olan `AGENTS.md` dosyasını kullanın ve ajana A oturumunun sonunda `session-handoff.md` yazdırın. Bkz. uygulama protokolü.

## Araçlar

- Claude Code veya Codex
- Git
- Node.js + Electron

## Harness Mekanizması

Ajanın okuyabildiği çalışma alanı + kalıcı durum dosyaları

## Depodaki projeyi kullanın

Depo yolu: [`projects/project-02/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02)

| Dizin | İçerik | Nasıl kullanılır |
|------|------|------|
| [`starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) | Project 01 kodu; tamamlanmamış doküman içe aktarma, detay görünümü ve kalıcılık içerir. Dokümanlar vardır ama incedir; `session-handoff.md` yoktur. | İkinci agent oturumunun ne kadar bağlamı yeniden keşfetmesi gerektiğini ölçün. |
| [`solution/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/solution) | Yalnızca tamamlanmış bir referanstır, başlangıç noktası değildir. Güçlü çalışmada buradan sadece `AGENTS.md` alın. | Yeni oturumun yalnızca depo durumuna bakarak çalışmaya devam edip edemediğini kontrol edin. |

Ürün özellikleri doküman içe aktarma, tam detay/içerik yükleme ve yeniden başlatmalar arasında kalıcılıktır; harness özelliği ise devredilebilir, agent-readable workspace'tir.

## Uygulama protokolü

İki çalışma arasında yalnızca harness değişebilir. Başlangıç kodu, görev istemi, ajan ve A oturumunun bitiş noktası aynı kalır. [Proje README’sinde](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/README.md) belirtildiği gibi A oturumu belge içe aktarma ve ayrıntı görünümü, B oturumu ise kalıcı saklama içindir.

1. `p02-baseline/` ve `p02-improved/` gibi birbirinden yalıtılmış iki çalışma dizini hazırlayın. Her seferinde yalnızca birini çalıştırın: iki oturumu da bitirip sonuçları arşivleyin, ardından diğerine başlamadan önce çalışma dizinini silin. İki çalışma için Git dalları kullanmayın. Bir kodlama ajanı diğer dalları veya kardeş dizinleri okuyabilir; zayıf harness güçlü harness’in dosyalarını görürse karşılaştırma güvenilir olmaz.
2. [`projects/project-02/starter/`](https://github.com/walkinglabs/learn-harness-engineering/tree/main/projects/project-02/starter) içeriğini her iki dizine kopyalayın. Bu başlangıç Project 01 çözümünü temel alır: önceki özellikler çalışır, Project 02’nin üç özelliği ise `feature_list.json` dosyasında `not-started` durumundadır. Kendi Project 01 sonucunuzla devam edecekseniz her iki dizine de aynı anlık görüntüyü kopyalayın.
3. İki çalışmada da aynı istemi verin. Örneğin: “Dosya seçiciyle belge içe aktarmayı, tüm içeriği gösteren bir belge ayrıntı görünümünü ve uygulama yeniden başlatıldığında içe aktarılan belgeleri koruyan kalıcı saklamayı uygulayın.”
4. `solution/docs/`, `solution/feature_list.json` veya `solution/session-handoff.md` dosyalarını hiçbir çalışmaya kopyalamayın. Bunlar tamamlanmış akışları anlatır ve özellikleri `pass` olarak işaretler; yani cevabı önceden verir. İki çalışmada da `starter/docs/ARCHITECTURE.md`, `starter/docs/PRODUCT.md` ve `feature_list.json` dosyalarını başlangıçtaki haliyle bırakın.

### İlk çalışma (zayıf harness)

`p02-baseline/` dizininde starter’ın kısa `AGENTS.md` dosyasını, `docs/` dizinini ve `feature_list.json` dosyasını olduğu gibi bırakın; `session-handoff.md` eklemeyin. Zayıf harness, boş değil, sade harness’tir.

**A oturumu:**

1. Ajanı görev istemiyle başlatın.
2. İçe aktarma ve ayrıntı görünümü çalışınca, kalıcılık henüz yokken oturumu bitirin. Uygulamayı açın, dosya seçiciden bir `.txt` ya da `.md` belgesi içe aktarın, listede görün ve açıp içeriğinin tamamını okuyun. Yeniden başlatınca belge hâlâ kaybolmalıdır. İkinci çalışmada da aynı ölçütü kullanın.
3. Devir notu veya başka bir özet dosyası istemeyin.

**B oturumu:**

1. Aynı dizinde yeni bir ajan oturumu açıp yalnızca “Çalışmaya devam et.” deyin.
2. Ajanın ilk anlamlı kod değişikliğine kadar geçen süreyi ve mimari, komutlar veya yarım kalan özellikler gibi A oturumunun bildiği bilgileri kaç kez yeniden keşfettiğini kaydedin.

### İkinci çalışma (güçlü harness)

A oturumundan önce `p02-improved/` dizinindeki `AGENTS.md` dosyasını [`solution/AGENTS.md`](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/AGENTS.md) ile değiştirin. Bu dosyada başlangıç kuralları, doküman hiyerarşisi, dokümanları güncelleme kuralı, `feature_list.json` içinde kanıt gerektiren bir tamamlanma ölçütü ve oturum devri bölümü vardır. Başka bir şeyi değiştirmeyin. Karşılaştırma yalnızca devir notunu değil, bütün harness’i ölçer. Devir notunun etkisini ayırmak için üçüncü bir çalışmada starter’ın `AGENTS.md` dosyasına yalnızca oturum devri bölümünü ekleyin.

**A oturumu:**

1. Aynı istemle başlayın ve aynı noktada durun: içe aktarma ve ayrıntı görünümü çalışır, kalıcılık henüz yoktur.
2. Oturumu kapatmadan önce ajandan [devir şablonuna](./../../resources/templates/session-handoff.md) göre repo kökünde `session-handoff.md` yazmasını isteyin: doğrulananlar, değişenler, bozuk ya da doğrulanmamış noktalar ve sıradaki adım. [Çözümdeki devir dosyası](https://github.com/walkinglabs/learn-harness-engineering/blob/main/projects/project-02/solution/session-handoff.md) tamamlanmış bir örnektir; kopyalamayın.

**B oturumu:**

1. Aynı dizinde yeni bir oturum açıp yalnızca “Çalışmaya devam et.” deyin. Notu okuma talimatı istemden değil, `AGENTS.md` dosyasından gelir.
2. İlk çalışmadaki ölçümleri aynen yapın.

## Sonuçları ölçme

| Ölçüt | Açıklama |
|---|---|
| B oturumunda işe başlama süresi | Oturum başlangıcından ilk anlamlı kod değişikliğine kadar geçen süre |
| Yeniden keşif sayısı | Ajanın bilinen mimariyi, komutları veya durumu kaç kez yeniden araştırdığı |
| Devir notunun kalitesi | Notun eksiksiz, doğru ve uygulanabilir olup olmadığı (yalnızca ikinci çalışma) |
| Tekrarlanan iş | A oturumunda biten işin ne kadarının B oturumunda tekrarlandığı |
| Son durum | Üç özelliğin de tamamlanıp tamamlanmadığı |

## Teslim edilecekler

- Zayıf harness çalışmasının A ve B oturum kayıtları veya günlükleri.
- Güçlü harness çalışmasının aynı kayıtları, kullanılan `AGENTS.md` ve ajanın yazdığı `session-handoff.md`.
- İşe devam etme hızını ve bağlamı yeniden kazanma kalitesini karşılaştıran kısa bir not.
