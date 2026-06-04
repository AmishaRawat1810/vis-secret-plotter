// A simple helper function to pause execution (Rate Limiting)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchAnimeData(startYear = 1990, endYear = 2026) {
  const formattedData = [];

  for (let year = startYear; year <= endYear; year++) {
    console.log(`Fetching data for ${year}...`);

    // Jikan API endpoint for top 25 anime of a specific year
    const url = `https://api.jikan.moe/v4/anime?start_date=${year}-01-01&end_date=${year}-12-31&order_by=members&sort=desc&limit=25`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      const animeList = data.data || [];

      for (const anime of animeList) {
        // Extract arrays safely
        const genres = anime.genres ? anime.genres.map((g: any) => g.name) : [];
        const demographics = anime.demographics
          ? anime.demographics.map((d: any) => d.name)
          : [];
        const demographic = demographics.length > 0 ? demographics[0] : "None";

        const studios = anime.studios
          ? anime.studios.map((s: any) => s.name)
          : [];
        const studio = studios.length > 0 ? studios[0] : "Unknown";

        // Format dates safely
        const startDate =
          anime.aired && anime.aired.from
            ? anime.aired.from.split("T")[0]
            : null;
        const endDate =
          anime.aired && anime.aired.to ? anime.aired.to.split("T")[0] : null;

        // Format season capitalization safely
        const season = anime.season
          ? anime.season.charAt(0).toUpperCase() + anime.season.slice(1)
          : "Unknown";

        const entry = {
          Title: anime.title_english || anime.title,
          "Start Date": startDate,
          "End Date": endDate,
          "Broadcast Season": season,
          Format: anime.type || "Unknown",
          Genres: genres,
          Demographic: demographic,
          "Source Material": anime.source || "Unknown",
          "Animation Studio": studio,
          "Average Rating": anime.score || null,
          Popularity: anime.members || 0,
          "Number of Episodes": anime.episodes || null,
          Favorites: anime.favorites || 0,
          "Data Source": "Jikan API",
        };

        formattedData.push(entry);
      }

      // Wait for 1.5 seconds to respect Jikan's strict rate limits (1 req/sec)
      await delay(1500);
    } catch (error) {
      console.error(`Error fetching data for ${year}:`, error.message);
    }
  }

  // Write the collected data to a JSON file
  const fileName = "anime_dataset_1990_2026.json";
  await Deno.writeTextFile(fileName, JSON.stringify(formattedData, null, 2));

  console.log(
    `\nSuccess! Saved ${formattedData.length} anime entries to '${fileName}'.`,
  );
}

// Execute the function
await fetchAnimeData();
