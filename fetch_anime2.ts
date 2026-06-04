// Helper function to handle API rate limits
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to parse strings like "1 hr 50 min" or "24 min per ep" into integers
function parseDuration(durationStr: string): number {
  if (!durationStr || durationStr === "Unknown") return 0;

  let totalMinutes = 0;
  const hrMatch = durationStr.match(/(\d+)\s*hr/);
  const minMatch = durationStr.match(/(\d+)\s*min/);

  if (hrMatch) totalMinutes += parseInt(hrMatch[1], 10) * 60;
  if (minMatch) totalMinutes += parseInt(minMatch[1], 10);

  return totalMinutes;
}

async function fetchDetailedAnimeData(startYear = 1990, endYear = 2026) {
  const formattedData = [];

  for (let year = startYear; year <= endYear; year++) {
    console.log(`Fetching detailed data for ${year}...`);

    // Using Jikan API
    const url = `https://api.jikan.moe/v4/anime?start_date=${year}-01-01&end_date=${year}-12-31&order_by=members&sort=desc&limit=25`;

    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP Error! Status: ${response.status}`);

      const data = await response.json();
      const animeList = data.data || [];

      for (const anime of animeList) {
        const episodes = anime.episodes || 1;
        const durationMins = parseDuration(anime.duration);

        // Calculate Total Hours (Episodes * Runtimes)
        const totalHours = Number(((episodes * durationMins) / 60).toFixed(2));

        // Extract genres as an array
        const genres = anime.genres ? anime.genres.map((g: any) => g.name) : [];

        const entry = {
          Title: anime.title_english || anime.title,
          Year: year,
          Format: anime.type || "Unknown",
          Genres: genres, // Array of genres for dynamic filtering
          "Number of Episodes": episodes,
          "Episode Duration (mins)": durationMins,
          "Total Hours": totalHours,
          "Average Rating": anime.score || null,
        };

        formattedData.push(entry);
      }

      // Strict 1.5s delay to prevent API bans
      await delay(1500);
    } catch (error) {
      console.error(`Error fetching data for ${year}:`, error.message);
    }
  }

  // Save the transformed dataset
  const fileName = "anime_duration_dataset.json";
  await Deno.writeTextFile(fileName, JSON.stringify(formattedData, null, 2));
  console.log(
    `\nSuccess! Saved ${formattedData.length} entries to '${fileName}'.`,
  );
}

await fetchDetailedAnimeData();
