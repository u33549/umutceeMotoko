# Anonim Anket Uygulaması : AnoSurvey

| **İsimler**              | **Rol** |
|----------------------------|----------------------------|
| **Furkan Barış Sönmezışık**                | Backend Geliştirici |
| **Selenay Akbaba**                | Backend Geliştirici |
| **Umut Can Cebbur**            | Frontend Geliştirici    |
---

## Vizyon
Projemiz, web3 teknolojisini kullanarak veri güvenliğini ve kullanıcı gizliliğini en üst düzeye çıkaran, tamamen anonim ve özgür bir anket uygulaması geliştirmeyi hedeflemektedir. Bu uygulama sayesinde kullanıcılar, herhangi bir oturum açma işlemi yapmadan soru oluşturabilir ve her soruya en fazla 8 tane seçenek ekleyebilir. Kullanıcılar, oluşturdukları soruların cevap istatistiklerini kolayca görüntüleyebilir ve aynı zamanda diğer kullanıcıların anketlerine anonim olarak katılım sağlayabilir. Ayrıca sayda yöneticisi dilediği anketi sayfadan kaldırabilir.

## Proje Detayları

| **Methodlar**              | **İşlevler** |
|----------------------------|----------------------------|
| **createPoll**                |  1 adet soru ve sınırsız şık ile kullanıcının anket oluşturmasını sağlayan fonksiyon |
| **getPollResults**                | Anketin sıra numarasını kullanarak anketin verilerini getiren fonksiyon |
| **vote**            | Anketin sıra numarasını kullanarak istenen şıka oy vermeyi sağlayan fonksiyon aynı zamanda fonksiyonun aldığı kullanıcı numarası ile her kullanıcının sadece bir kez oy kullanmasını sağlıyor    |
|**deletePoll**|Anketin sıra numarasını kullanarak anketi silen fonksiyon|
|**getAllPollsCount**|Sistemde kaç adet anket kayıtlı olduğunu getiren fonksiyon|
---

### Not: Yazılan kod ankete her bir tarayıcıdan bir adet oy verebilmesini sağlayan bir altyapıya sahip

## Diğer detaylar:

Altyapımız sınırsız şık desteklese de tasarımın bozulmaması ve veritabanının zorlanmaması için react ile en fazla 8 şık alınması sağlandı.

Uygulama responsive olsada uzun metinlerde bazı tasarım hataları yapabiliyor hackathon süresince elimizden geldiğince fazlasını düzelttik.

**dfx start --clean** kodu ile başlatmak veritabanını temizlemekte yani uygulamayı kapattıktan sorna **--clean** etiketi yaptığınız her şeyin silinmesine sebep olacaktır. Bu sebeple 2. çalıştırmayı sadece **dfx start** demeniz yeterli olur.

Kullanıcı verilerini **saklamamak** amacıyla bazı verileri kullanıcının cihazında saklıyoruz bu sebeple **--clean** etiketi ile 2.kere başlatmak local verilerle veritabanının çakışmasına sebep oluyor. Bunun için uygulama başında kendisi etiket kullanımı anlayıp size soruyor. Eğer gene bir sorun varsa öncelikle geliştirici panelinden **local storage** kısmının silinmesi gerekiyor. Bu tarz bir sorun devam ederse bizimle iletişime girin.

Sayfanının dinamik veri güncelleme sistemi yok yani kendi değişikliklerinizi anlık görürken diğer kullanıcıların değişikliklerini sayfayı yeniledikten sonra görürsünüz. Aynı zamanda **Candid UI** ile bir anketi silerseniz bunun tepkisini alabilmek için öncelikle sayfayı yenilemeniz gerekir aksi halde kod hata verebilir.

**Candid UI** ile bir anketi silmek veritabanındaki anket sayısını azaltmaz sadece belirlenen anketin değerini **null** olarak işaretler.

Projemizde özellikle web tarafında bir çok kütüphane kullanılmıştır çalıştırmadan önce **npm install** yapmanız tavsiye edilir. Bağımlılıklarla alakalı bir aksaklıkta bizimle iletişime girin.

Proje Ubuntu 22.04.06 sürümünde geliştirildi.

