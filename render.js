async function render(fileName) {
  const response = await fetch(fileName);
  const spec = await response.json();
  await vegaEmbed("#vis", spec, { actions: true });
}

// render("spec.json").catch(console.error);
// render("movies_spec2.json").catch(console.error);
// render("movies_spec3.json").catch(console.error);
// render("anime_specs_genres.json").catch(console.error);
// render("anime_specs_season.json").catch(console.error);
// render("anime_specs_gross.json").catch(console.error);
// render("anime_specs_studios.json").catch(console.error);
