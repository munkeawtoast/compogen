declare module 'cloudflare:test' {
  interface ProvidedEnv extends Env {}
}

declare interface Env {
  KV_NAMESPACE: KVNamespace;
}
