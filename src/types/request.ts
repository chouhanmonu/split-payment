import { Request, Response } from 'express';

export interface GqlContext {
  req: Request;
  res?: Response;
}

export interface RequestMetadata {
  deviceId?: string;
  ip?: string;
  userAgent?: string;
}
