export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const normalizeImagePath = (relativePath: string) => (process.env.IMAGES_DIRECTORY as string) + (relativePath)