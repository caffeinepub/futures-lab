import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface CandleSummary {
    totalVolume: number;
    totalCount: bigint;
    avgPrice: number;
    avgVolume: number;
}
export interface PromptTemplate {
    id: string;
    content: string;
    owner: Principal;
    name: string;
    createdAt: bigint;
    updatedAt: bigint;
    example?: string;
    category: string;
}
export interface Trade {
    owner: Principal;
    size: number;
    profitLoss: number;
    positionType: PositionType;
    entryPrice: number;
    exitPrice?: number;
}
export interface Dataset {
    id: string;
    owner: Principal;
    name: string;
    description?: string;
    candles: Array<Candle>;
    uploadedAt: bigint;
}
export interface TradingStatus {
    mode: TradingMode;
    tradingEnabled: boolean;
    binanceConnected: boolean;
}
export interface Candle {
    low: number;
    high: number;
    close: number;
    open: number;
    time: bigint;
    volume: number;
}
export interface AppHealth {
    status: HealthStatus;
    message?: string;
}
export interface UserProfile {
    name: string;
    createdAt: bigint;
    email: string;
    tradingStatus: TradingStatus;
}
export enum HealthStatus {
    healthy = "healthy",
    unreachable = "unreachable",
    maintenance = "maintenance",
    degraded = "degraded",
    appIssue = "appIssue"
}
export enum PositionType {
    long_ = "long",
    short_ = "short"
}
export enum TradingMode {
    liveTrading = "liveTrading",
    shadowTrading = "shadowTrading",
    paperTrading = "paperTrading"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBinanceAccount(apiKey: string, secretKey: string, mode: TradingMode): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    disconnectBinance(): Promise<void>;
    filterPromptTemplates(category: string): Promise<Array<PromptTemplate>>;
    getAllDatasetIds(): Promise<Array<string>>;
    getAllPromptTemplates(): Promise<Array<PromptTemplate>>;
    getAllTrades(tradeId: string): Promise<Array<Trade>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCandleSummary(datasetId: string): Promise<CandleSummary>;
    getDataset(datasetId: string): Promise<Dataset | null>;
    getHealthStatus(): Promise<HealthStatus>;
    getPromptTemplate(id: string): Promise<PromptTemplate | null>;
    getSystemHealth(): Promise<AppHealth>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    savePromptTemplate(template: PromptTemplate): Promise<void>;
    saveTrade(tradeId: string, trade: Trade): Promise<void>;
    setSystemHealth(state: HealthStatus): Promise<void>;
    updateTradingMode(mode: TradingMode): Promise<void>;
    uploadDataset(datasetId: string, candles: Array<Candle>, name: string, desc: string | null): Promise<void>;
    uploadFile(blob: ExternalBlob): Promise<ExternalBlob>;
    verifyBinanceConnection(): Promise<boolean>;
    verifyUser(): Promise<boolean>;
}
