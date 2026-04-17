export async function loadJson(url = "/data.json") {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Помилка:", error);
  }
}
