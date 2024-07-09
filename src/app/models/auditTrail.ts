export interface AuditTrail {
    auditTrailId: number;
    date: Date;
    userId: string;
    userName: string;
    userAction: string;
}