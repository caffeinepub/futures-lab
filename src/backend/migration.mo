import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";

module {
  type OldUserProfile = {
    name : Text;
    email : ?Text;
    createdAt : Int;
    tradingStatus : TradingStatus;
  };

  type OldDataset = {
    id : Text;
    candles : [Candle];
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

  public type HealthStatus = {
    #healthy;
    #degraded;
    #unreachable;
    #maintenance;
    #appIssue;
  };

  public type AppHealth = {
    status : HealthStatus;
    message : ?Text;
  };

  public type TradingStatus = {
    binanceConnected : Bool;
    tradingEnabled : Bool;
    mode : TradingMode;
  };

  public type TradingMode = {
    #paperTrading;
    #shadowTrading;
    #liveTrading;
  };

  public type BinanceAccount = {
    apiKey : Text;
    secretKey : Text;
    createdAt : Int;
    connected : Bool;
    mode : TradingMode;
  };

  public type Candle = {
    open : Float;
    close : Float;
    high : Float;
    low : Float;
    volume : Float;
    time : Int;
  };

  public type CandleSummary = {
    totalCount : Int;
    avgVolume : Float;
    totalVolume : Float;
    avgPrice : Float;
  };

  public type Trade = {
    positionType : { #long; #short };
    entryPrice : Float;
    exitPrice : ?Float;
    size : Float;
    profitLoss : Float;
    owner : Principal;
  };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    healthyState : HealthStatus;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    binanceAccounts : Map.Map<Principal, BinanceAccount>;
    datasets : Map.Map<Text, OldDataset>;
    promptTemplates : Map.Map<Text, OldPromptTemplate>;
    trades : Map.Map<Text, List.List<Trade>>;
  };

  type NewUserProfile = {
    name : Text;
    email : Text;
    createdAt : Int;
    tradingStatus : TradingStatus;
  };

  type NewDataset = {
    id : Text;
    candles : [Candle];
    owner : Principal;
    uploadedAt : Int;
    name : Text;
    description : ?Text;
  };

  type NewPromptTemplate = {
    id : Text;
    name : Text;
    content : Text;
    createdAt : Int;
    updatedAt : Int;
    category : Text;
    example : ?Text;
    owner : Principal;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    healthyState : HealthStatus;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    binanceAccounts : Map.Map<Principal, BinanceAccount>;
    datasets : Map.Map<Text, NewDataset>;
    promptTemplates : Map.Map<Text, NewPromptTemplate>;
    trades : Map.Map<Text, List.List<Trade>>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_p, profile) {
        {
          profile with
          email = switch (profile.email) {
            case (null) { "" };
            case (?email) { email };
          };
        };
      }
    );

    { old with userProfiles = newUserProfiles };
  };
};

