import type { RequestHandler, Router } from "express";
import type { AllyMailerClient } from "@allymailer/allymailer-node-sdk";

export interface AllyMailerOptions {
  /** User or project API key, default: env ALLYMAILER_API_KEY. */
  apiKey?: string;
  /** API host (datacenter) or a full base URL, default: env ALLYMAILER_HOST. */
  host?: string;
  /** Request timeout in seconds, default: env ALLYMAILER_TIMEOUT or 30. */
  timeout?: number;
  /** API key the webhooks are signed with, default: env ALLYMAILER_WEBHOOK_KEY or apiKey. */
  webhookKey?: string;
  /** Path of the webhook endpoint, default: env ALLYMAILER_WEBHOOK_PATH or "/allymailer/webhook". */
  webhookPath?: string;
}

export interface WebhookHandlers {
  /** The whole notification: parsed SDK model and decoded JSON. */
  onNotification?: (callback: any, payload: Record<string, any>, context?: any) => unknown;
  /** Each event of the notification with its user/project. */
  onEvent?: (event: any, user: any, context?: any) => unknown;
}

export function resolveOptions(options?: AllyMailerOptions): Required<AllyMailerOptions>;
export function createClient(options?: AllyMailerOptions): AllyMailerClient;
export function clientMiddleware(options?: AllyMailerOptions & { client?: AllyMailerClient }): RequestHandler;
export function webhookRouter(options?: AllyMailerOptions & WebhookHandlers & { path?: string; limit?: string }): Router;
export function verifySignature(body: string | Buffer, apiKey: string): boolean;
export function signBody(body: string, apiKey: string): string;
export function handleWebhook(body: string | Buffer, key: string, handlers?: WebhookHandlers, context?: any): Promise<{ status: number; text: string }>;
export function toMessage(data: Record<string, any>, envelope?: { from: string; to: string[] }): Record<string, any>;

/** Nodemailer transport: nodemailer.createTransport(new AllyMailerTransport({ apiKey })). */
export class AllyMailerTransport {
  constructor(options?: AllyMailerOptions & { client?: AllyMailerClient });
  name: string;
  version: string;
  client: AllyMailerClient;
  send(mail: any, callback: (err: Error | null, info?: any) => void): void;
}

declare global {
  namespace Express {
    interface Request {
      allymailer?: AllyMailerClient;
    }
  }
}
