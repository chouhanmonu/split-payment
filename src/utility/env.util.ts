export function getEnvironment(): string {
  return process.env.NODE_ENV || 'development';
}

export function isProduction(): boolean {
  return getEnvironment() === 'production';
}
