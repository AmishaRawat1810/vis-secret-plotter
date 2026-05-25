async function render(fileName) {
  const response = await fetch(fileName);
  const spec = await response.json();
  await vegaEmbed("#vis", spec, { actions: false });
}

render("spec1.json").catch(console.error);
