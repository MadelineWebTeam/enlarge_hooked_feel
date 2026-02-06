export function getStoragePathFromUrl(url: string) {
  const parts = url.split("/Madeline_Images/")
  if (parts.length !== 2) return null
  return parts[1]
}
