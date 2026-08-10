import { prisma } from "@/lib/prisma";

export interface CreateAuditLogParams {
  actorId?: string | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, any>;
}

export class AuditLogRepository {
  static async record(params: CreateAuditLogParams) {
    try {
      return await prisma.auditLog.create({
        data: {
          actorId: params.actorId ?? null,
          action: params.action,
          entity: params.entity ?? null,
          entityId: params.entityId ?? null,
          ipAddress: params.ipAddress ?? null,
          userAgent: params.userAgent ?? null,
          metadata: params.metadata ? (params.metadata as any) : undefined,
        },
      });
    } catch (error) {
      // Audit log failures should be logged but should not crash critical auth path
      console.error("[AuditLog Error]: Failed to create audit log entry", error);
      return null;
    }
  }
}
