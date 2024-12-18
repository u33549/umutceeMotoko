import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import Nat32 "mo:base/Nat32";
import Hash "mo:base/Hash";

actor VotingContract {

    // Basit bir hash fonksiyonu: Nat değerinin 32-bit modunu alır
    func natHash(n: Nat): Hash.Hash {
        return Nat32.fromNat(n % 2_147_483_647);
    };

    // Anket yapısı
    type Poll = {
        id: Nat;                         // Anketin ID'si
        question: Text;                  // Anket sorusu
        options: [Text];                 // Anket seçenekleri
        votes: HashMap.HashMap<Text, Nat>;  // Seçeneklere yapılan oy sayıları
        voters: HashMap.HashMap<Text, Bool>; // Kullanıcıların oy verip vermediği bilgisi
    };

    // Anketleri saklamak için değişken
    let polls = HashMap.HashMap<Nat, Poll>(10, Nat.equal, natHash);

    // Anket ID'si için sayaç
    var pollCounter : Nat = 0;

    // Yeni anket oluşturma fonksiyonu
    public func createPoll(question : Text, options : [Text]) : async Nat {
        let pollId = pollCounter;

        // Oy sayılarını tutmak için HashMap oluştur
        let votesMap = HashMap.HashMap<Text, Nat>(options.size(), Text.equal, Text.hash);

        // Seçenekleri sıfırla (ilk başta her seçeneğe 0 oy verilir)
        for (option in options.vals()) {
            votesMap.put(option, 0);
        };

        // Yeni anket nesnesi oluştur
        let newPoll : Poll = {
            id = pollId;
            question = question;
            options = options;
            votes = votesMap;
            voters = HashMap.HashMap(10, Text.equal, Text.hash);  // Voters HashMap'i boş
        };

        // Anketi polls HashMap'ine ekle
        polls.put(pollId, newPoll);

        // Anket ID'sini artır
        pollCounter += 1;

        return pollId;
    };

    // Oy verme fonksiyonu
    public func vote(pollId : Nat, selectedOptionIndex : Nat, voter: Text) : async Result.Result<(), Text> {
        // Anketin mevcut olup olmadığını kontrol et
        switch (polls.get(pollId)) {
            case null { 
                return #err("Anket bulunamadı");
            };
            case (?poll) {

                // Kullanıcının daha önce oy verip vermediğini kontrol et
                if (poll.voters.get(voter) == ?true) {
                    return #err("Zaten oy verdiniz");
                };

                // Seçenek numarasını kontrol et
                if (selectedOptionIndex >= Array.size(poll.options) or selectedOptionIndex < 0) {
                    return #err("Geçersiz seçenek numarası");
                };

                let selectedOption = poll.options[selectedOptionIndex];

                // Oyu güncelle
                switch (poll.votes.get(selectedOption)) {
                    case null { 
                        poll.votes.put(selectedOption, 1);  // İlk oy
                    };
                    case (?currentVotes) { 
                        poll.votes.put(selectedOption, currentVotes + 1);  // Mevcut oyu bir artır
                    };
                };

                // Kullanıcıyı oy vermiş olarak işaretle
                poll.voters.put(voter, true);

                return #ok();
            };
        };
    };

    // Anket sonuçlarını görüntüleme fonksiyonu
    public query func getPollResults(pollId : Nat) : async ?{
        question: Text;
        options: [Text];
        results: [(Text, Nat)];
    } {
        switch (polls.get(pollId)) {
            case null { null };
            case (?poll) {
                // Seçeneklerin ve oy sayıların bir listesini oluştur
                let results = Array.map<Text, (Text, Nat)>(poll.options, func(option : Text) : (Text, Nat) {
                    let voteCount = switch (poll.votes.get(option)) {
                        case null { 0 };          // Oy yoksa 0
                        case (?votes) { votes };  // Oy varsa mevcut sayıyı al
                    };
                    (option, voteCount);
                });
                
                // Sonuçları döndür
                ?{
                    question = poll.question;
                    options = poll.options;
                    results = results;
                };
            };
        };
    };

    // Anket ID'sine göre anketi silme fonksiyonu
    public func deletePoll(pollId : Nat) : async Result.Result<(), Text> {
        switch (polls.remove(pollId)) {
            case null { 
                return #err("Silinecek anket bulunamadı");  // Anket bulunamadı
            };
            case (?_) {
                return #ok();  // Anket başarıyla silindi
            };
        };
    };

    // Toplam anket sayısını döndüren fonksiyon
    public query func getAllPollsCount() : async Nat {
        return pollCounter;
    };
};
