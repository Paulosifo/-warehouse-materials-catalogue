# Warehouse Materials Catalogue

A prototype visual catalogue for identifying materials held in an industrial warehouse.
Materials are shown for identification only and are not for sale. Item names come from
the earlier Google Sites prototype; details are still being confirmed. Pictures are
generic illustrations until real photographs are added.

## Features

- Search by name, catalogue ID, part number, or description
- Category filters (work together with search)
- "No results" message and a Reset filters button
- Details pop-up with a larger photo and specifications
- Missing information is shown as "Not provided", never invented
- Responsive layout and keyboard-friendly

## Run it locally

Browsers block loading the JSON file when you double-click `index.html`,
so use a tiny local server.

**Option 1 (VS Code):** install the *Live Server* extension, right-click
`index.html`, and choose *Open with Live Server*.

**Option 2 (Python):** in this folder run

```
python -m http.server 8000
```

then open <http://localhost:8000>.

## Project structure

```
index.html            the page
css/base.css          colours, fonts, spacing (change the look here)
css/layout.css        navbar, grid, footer
css/components.css    cards, buttons, filters, details pop-up
js/main.js            starts the app, connects everything
js/data.js            loads the JSON
js/filters.js         search and category logic
js/render.js          builds cards, filters and details
data/materials.json   the materials list
data/SCHEMA.md        documents every data field
images/illustrations/ generic drawings, used where there is no photo yet
images/materials/     put real photographs here
```

## Adding a real photograph

1. Put the photo in `images/materials/` (for example `mat-0001-1.jpg`).
2. In `data/materials.json`, change that material's `images` entry to point to it
   and write a descriptive `alt` text.

## Before real business use

This prototype is not ready for confidential or live data. A real version needs:

- Login and access control (who may see what)
- A backend and database (FastAPI is planned) so data is not public files
- Approval for the company's official name and branding
- Confirmed material identities, part numbers, and photographs
- A separate, protected place for client, project, ownership, quantity, and location data
