import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Float "mo:core/Float";
import Int "mo:core/Int";

module {
  // Old types (from previous version)
  type OldCandle = {
    open : Float;
    close : Float;
    high : Float;
    low : Float;
    volume : Float;
    time : Int;
  };

  type OldDataset = {
    id : Text;
    candles : [OldCandle];
    owner : Principal;
    uploadedAt : Int;
    name : Text;
    description : ?Text;
  };

  type OldPromptTemplate = {
    id : Text;
    name : Text;
    content : Text;
    createdAt : Int;
    updatedAt : Int;
    category : Text;
    example : ?Text;
    owner : Principal;
  };

  type OldTrade = {
    positionType : { #long; #short };
    entryPrice : Float;
    exitPrice : ?Float;
    size : Float;
    profitLoss : Float;
    owner : Principal;
  };

  type OldTradingMode = { #paperTrading; #shadowTrading; #liveTrading };

  type OldTradingStatus = {
    binanceConnected : Bool;
    tradingEnabled : Bool;
    mode : OldTradingMode;
  };

  type OldUserProfile = {
    name : Text;
    email : ?Text;
    createdAt : Int;
  };

  type OldActor = {
    datasets : Map.Map<Text, OldDataset>;
    promptTemplates : Map.Map<Text, OldPromptTemplate>;
    trades : Map.Map<Text, List.List<OldTrade>>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  // New types (from current actor)
  type NewActor = {
    datasets : Map.Map<Text, OldDataset>;
    promptTemplates : Map.Map<Text, OldPromptTemplate>;
    trades : Map.Map<Text, List.List<OldTrade>>;
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  type NewUserProfile = {
    name : Text;
    email : ?Text;
    createdAt : Int;
    tradingStatus : OldTradingStatus;
  };

  public func run(old : OldActor) : NewActor {
    let migratedProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        { oldProfile with tradingStatus = { binanceConnected = false; tradingEnabled = false; mode = #paperTrading } };
      }
    );
    { old with userProfiles = migratedProfiles };
  };
};
