export function setHighScore(key: string, value: any): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getHighScore(key: string): any {
  const storedValue = window.localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
}
