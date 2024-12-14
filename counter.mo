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
  func natHash(n: Nat): Hash.Hash {
    // Basit bir hash fonksiyonu: Nat değerinin 32-bit modunu alır
    return Nat32.fromNat(n % 2_147_483_647);
  };
    // Anket yapısı
    type Poll = {
        id: Nat;
        question: Text;
        options: [Text];
        votes: HashMap.HashMap<Text, Nat>;
        voters: HashMap.HashMap<Principal, Bool>;
    };

    // Anketleri saklamak için değişkenler
    let polls = HashMap.HashMap<Nat, Poll>(10,Nat.equal, natHash);
    var pollCounter : Nat = 0;

    // Yeni anket oluşturma fonksiyonu
    public func createPoll(question : Text, options : [Text]) : async Nat {
        let pollId = pollCounter;
        
        // Oy sayılarını tutmak için HashMap oluştur
        let votesMap = HashMap.HashMap<Text, Nat>(options.size(), Text.equal, Text.hash);
        for (option in options.vals()) {
            votesMap.put(option, 0);
        };

        let newPoll : Poll = {
            id = pollId;
            question = question;
            options = options;
            votes = votesMap;
            voters = HashMap.HashMap(10, Principal.equal, Principal.hash);
        };

        polls.put(pollId, newPoll);
        pollCounter += 1;
        return pollId;
    };

    // Oy verme fonksiyonu
    public shared(msg) func vote(pollId : Nat, selectedOption : Text) : async Result.Result<(), Text> {
      switch (polls.get(pollId)) {
        case null { 
            return #err("Anket bulunamadı") ;
        };
        case (?poll) {
            // Kullanıcının daha önce oy verip vermediğini kontrol et
            if (poll.voters.get(msg.caller) == ?true) {
                return #err("Zaten oy verdiniz");
            };

            // Geçerli bir seçenek mi kontrol et
            switch (Array.find<Text>(poll.options, func(option : Text) : Bool { option == selectedOption })) {
                case null { 
                    return #err("Geçersiz seçenek");
                };
                case (?option) { 
                    // Oyu güncelle
                    switch (poll.votes.get(option)) {
                        case null { 
                            poll.votes.put(option, 1);
                        };
                        case (?currentVotes) { 
                            poll.votes.put(option, currentVotes + 1);
                        };
                    };

                    // Kullanıcıyı oy vermiş olarak işaretle
                    poll.voters.put(msg.caller, true);
                    return #ok();
                };
            };
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
                let results = Array.map<Text, (Text, Nat)>(poll.options, func(option : Text) : (Text, Nat) {
                    let voteCount = switch (poll.votes.get(option)) {
                        case null { 0 };
                        case (?votes) { votes };
                    };
                    (option, voteCount);
                });
                
                ?{
                    question = poll.question;
                    options = poll.options;
                    results = results;
                };
            };
        };
    };
};
