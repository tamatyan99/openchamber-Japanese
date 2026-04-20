export function logEvent(name: string, payload: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ event: name, ts: new Date().toISOString(), ...payload }));
}
