import Text "mo:core/Text";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import List "mo:core/List";
import Storage "blob-storage/Storage";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Storage and authorization mixins
  include MixinStorage();

  // User roles & authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // System Health Types/Functions
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

  var healthyState : HealthStatus = #healthy;

  public query ({ caller }) func getHealthStatus() : async HealthStatus {
    healthyState;
  };

  public shared ({ caller }) func setSystemHealth(state : HealthStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can set health status");
    };
    healthyState := state;
  };

  public query ({ caller }) func getSystemHealth() : async AppHealth {
    { status = healthyState; message = null };
  };

  // User profiles
  public type UserProfile = {
    name : Text;
    email : Text;
    createdAt : Int;
    tradingStatus : TradingStatus;
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

  let userProfiles = Map.empty<Principal, UserProfile>();

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    if (profile.name == "") {
      Runtime.trap("Profile must have a name");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Binance/account connection
  public type BinanceAccount = {
    apiKey : Text;
    secretKey : Text;
    createdAt : Int;
    connected : Bool;
    mode : TradingMode;
  };

  let binanceAccounts = Map.empty<Principal, BinanceAccount>();

  public shared ({ caller }) func addBinanceAccount(apiKey : Text, secretKey : Text, mode : TradingMode) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can connect Binance account");
    };
    if (apiKey == "" or secretKey == "") {
      Runtime.trap("API or Secret Key cannot be empty");
    };
    let account : BinanceAccount = {
      apiKey;
      secretKey;
      createdAt = Int.abs(Time.now());
      connected = true;
      mode;
    };
    binanceAccounts.add(caller, account);
  };

  public query ({ caller }) func verifyBinanceConnection() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can verify Binance connection");
    };
    switch (binanceAccounts.get(caller)) {
      case (?account) { account.connected };
      case (null) { Runtime.trap("No Binance account found for caller") };
    };
  };

  public shared ({ caller }) func disconnectBinance() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: User must be logged in to disconnect");
    };
    switch (binanceAccounts.get(caller)) {
      case (?account) {
        let newAccount = { account with connected = false };
        binanceAccounts.add(caller, newAccount);
      };
      case (null) {
        Runtime.trap("Trying to disconnect a non-existent Binance Account");
      };
    };
  };

  public shared ({ caller }) func updateTradingMode(mode : TradingMode) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: User must be logged in to update trading mode");
    };
    switch (binanceAccounts.get(caller)) {
      case (?account) {
        let newAccount = { account with mode };
        binanceAccounts.add(caller, newAccount);
      };
      case (null) {
        Runtime.trap("Trying to update mode on non-existent Binance Account");
      };
    };
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

  public type Dataset = {
    id : Text;
    candles : [Candle];
    owner : Principal;
    uploadedAt : Int;
    name : Text;
    description : ?Text;
  };

  let datasets = Map.empty<Text, Dataset>();

  public shared ({ caller }) func uploadDataset(datasetId : Text, candles : [Candle], name : Text, desc : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload datasets");
    };
    if (name == "" or datasetId == "") {
      Runtime.trap("Dataset must have a unique ID and name");
    };
    let dataset : Dataset = {
      id = datasetId;
      candles;
      owner = caller;
      uploadedAt = Int.abs(Time.now());
      name;
      description = desc;
    };
    datasets.add(datasetId, dataset);
  };

  public query ({ caller }) func getAllDatasetIds() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list datasets");
    };
    // Return only datasets owned by caller, or all if admin
    if (AccessControl.isAdmin(accessControlState, caller)) {
      datasets.keys().toArray();
    } else {
      let filtered = datasets.filter(func(_id, ds) { ds.owner == caller });
      filtered.keys().toArray();
    };
  };

  public query ({ caller }) func getDataset(datasetId : Text) : async ?Dataset {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view datasets");
    };
    switch (datasets.get(datasetId)) {
      case (?dataset) {
        if (dataset.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own datasets");
        };
        ?dataset;
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getCandleSummary(datasetId : Text) : async CandleSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view candle summaries");
    };
    switch (datasets.get(datasetId)) {
      case (?dataset) {
        if (dataset.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view summaries of your own datasets");
        };

        let totalCandles = dataset.candles.size();
        if (totalCandles == 0) { Runtime.trap("No candle data available") };

        var sumVolume = 0.0;
        var sumPrice = 0.0;

        for (candle in dataset.candles.values()) {
          sumVolume += candle.volume;
          let avgOHLC = (candle.open + candle.close + candle.high + candle.low) / 4.0;
          sumPrice += avgOHLC;
        };

        {
          totalCount = totalCandles;
          avgVolume = sumVolume / totalCandles.toFloat();
          totalVolume = sumVolume;
          avgPrice = sumPrice / totalCandles.toFloat();
        };
      };
      case (_) { Runtime.trap("No dataset found for id " # datasetId) };
    };
  };

  public type PromptTemplate = {
    id : Text;
    name : Text;
    content : Text;
    createdAt : Int;
    updatedAt : Int;
    category : Text;
    example : ?Text;
    owner : Principal;
  };

  let promptTemplates = Map.empty<Text, PromptTemplate>();

  public shared ({ caller }) func savePromptTemplate(template : PromptTemplate) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save prompt templates");
    };
    if (template.id == "" or template.name == "") {
      Runtime.trap("Prompt template must have a unique ID and name");
    };
    let ownedTemplate = { template with owner = caller };
    promptTemplates.add(ownedTemplate.id, ownedTemplate);
  };

  public query ({ caller }) func getPromptTemplate(id : Text) : async ?PromptTemplate {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view prompt templates");
    };
    switch (promptTemplates.get(id)) {
      case (?template) {
        if (template.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own templates");
        };
        ?template;
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getAllPromptTemplates() : async [PromptTemplate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list prompt templates");
    };
    if (AccessControl.isAdmin(accessControlState, caller)) {
      promptTemplates.values().toArray();
    } else {
      let filtered = promptTemplates.filter(func(_id, tmpl) { tmpl.owner == caller });
      filtered.values().toArray();
    };
  };

  public query ({ caller }) func filterPromptTemplates(category : Text) : async [PromptTemplate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can filter prompt templates");
    };
    // Return only templates owned by caller (and matching category), or all matching if admin
    if (AccessControl.isAdmin(accessControlState, caller)) {
      let filtered = promptTemplates.filter(func(_id, tmpl) { tmpl.category == category });
      filtered.values().toArray();
    } else {
      let filtered = promptTemplates.filter(func(_id, tmpl) { tmpl.category == category and tmpl.owner == caller });
      filtered.values().toArray();
    };
  };

  public type Trade = {
    positionType : PositionType;
    entryPrice : Float;
    exitPrice : ?Float;
    size : Float;
    profitLoss : Float;
    owner : Principal;
  };

  public type PositionType = { #long; #short };

  let trades = Map.empty<Text, List.List<Trade>>();

  public shared ({ caller }) func saveTrade(tradeId : Text, trade : Trade) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save trades");
    };

    let ownedTrade = { trade with owner = caller };

    let userTrades = switch (trades.get(tradeId)) {
      case (null) { List.empty<Trade>() };
      case (?existing) { existing };
    };

    userTrades.add(ownedTrade);
    trades.add(tradeId, userTrades);
  };

  public query ({ caller }) func getAllTrades(tradeId : Text) : async [Trade] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view trades");
    };
    switch (trades.get(tradeId)) {
      case (null) { [] };
      case (?userTrades) {
        // Filter to return only trades owned by caller, or all if admin
        if (AccessControl.isAdmin(accessControlState, caller)) {
          userTrades.toArray();
        } else {
          let filtered = userTrades.filter(func(t) { t.owner == caller });
          filtered.toArray();
        };
      };
    };
  };

  public shared ({ caller }) func uploadFile(blob : Storage.ExternalBlob) : async Storage.ExternalBlob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload files");
    };
    blob;
  };

  public query ({ caller }) func verifyUser() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #user);
  };
};

