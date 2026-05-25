Generate a scaffold for a vega lite app that will contain:

- spec.json (a vega lite spec)
- index.html (the html that will render the vega lite spec)
- render.js (contains the js that will do the rendering)

Vega Lite will be served from CDN. Use version 6

This will be used as follows:

- Dev starts live server in VSCode
- Dev modifies spec
- Observes change

Likely that the JSON change might not trigger a rerender, but we will deal with that later.