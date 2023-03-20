export async function tryImport<T>(files: string[]): Promise<T | null> {
  for (const file of files) {
    try {
      const module = await import(file);
      return module.default;
    } catch (error) {
      console.debug(`Failed to import module from ${file}:`, error);
    }
  }
  return null;
}
