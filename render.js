async function render() {
  const response = await fetch("spec.json");
  const spec = await response.json();
  await vegaEmbed("#vis", spec, { actions: false });
}

render().catch(console.error);
