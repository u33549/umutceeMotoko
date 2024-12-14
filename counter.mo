actor {

  stable var counter = 0;

  // Get the value of the counter.
  public query func get() : async Nat {
    return counter;
  };

  // Set the value of the counter.
  public func set(n : Nat) : async () {
    counter := n;
  };

  // Increment the value of the counter.
  public func inc(n : Nat) : async () {
    counter += n;
  };

  // Reset the stable values
  public func reset() : async(){
    counter:=0;
  };

};
