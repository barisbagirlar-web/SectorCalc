import { getFirebaseAuth } from '../auth/firebase-app.js';
import type { EngineResponse, ToolContract, ToolId } from './types.js';

const DEFAULT_BASE_URL = 'https://us-central1-sectorcalc-prod.cloudfunctions.net/engineApi/v1';

function apiBaseUrl(): string {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return (env?.VITE_ENGINE_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
}

export class EngineApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly requestId?: string
  ) {
    super(message);
    this.name = 'EngineApiError';
  }
}

export async function calculateTool<T extends ToolId>(
  toolId: T,
  input: ToolContract[T]['input'],
  options: { signal?: AbortSignal } = {}
): Promise<EngineResponse<ToolContract[T]['result']>> {
  const auth = getFirebaseAuth();
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user) throw new EngineApiError(401, 'NOT_AUTHENTICATED', 'Sign in to calculate.');

  const token = await user.getIdToken();
  const response = await fetch(`${apiBaseUrl()}/tools/${toolId}/calculate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ input }),
    signal: options.signal
  });

  const payload = (await response.json().catch(() => null)) as
    | (Partial<EngineResponse<ToolContract[T]['result']>> & {
        error?: { code?: string; message?: string } | string;
      })
    | null;
  if (!response.ok) {
    const error = payload?.error;
    const code = typeof error === 'object' ? error?.code : undefined;
    const message = typeof error === 'object' ? error?.message : error;
    throw new EngineApiError(
      response.status,
      code || `HTTP_${response.status}`,
      message || 'Calculation failed. Please try again.',
      payload?.requestId
    );
  }
  if (!payload?.result || !payload.engineVersion || !payload.requestId) {
    throw new EngineApiError(
      502,
      'INVALID_RESPONSE',
      'The calculation service returned an invalid response.'
    );
  }
  return payload as EngineResponse<ToolContract[T]['result']>;
}

export class LatestCalculation {
  private sequence = 0;
  private controller: AbortController | null = null;

  async run<T extends ToolId>(
    toolId: T,
    input: ToolContract[T]['input']
  ): Promise<EngineResponse<ToolContract[T]['result']> | null> {
    const sequence = ++this.sequence;
    this.controller?.abort();
    this.controller = new AbortController();
    try {
      const response = await calculateTool(toolId, input, { signal: this.controller.signal });
      return sequence === this.sequence ? response : null;
    } catch (error) {
      if (
        sequence !== this.sequence ||
        (error instanceof DOMException && error.name === 'AbortError')
      ) {
        return null;
      }
      throw error;
    }
  }

  cancel(): void {
    this.sequence += 1;
    this.controller?.abort();
    this.controller = null;
  }
}

export function engineErrorMessage(error: unknown): string {
  if (error instanceof EngineApiError) return error.message;
  return error instanceof Error ? error.message : 'Calculation failed. Please try again.';
}
