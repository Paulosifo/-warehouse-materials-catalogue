# Materials data structure

`materials.json` is a list. Each item in the list is one material.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Stable, unique catalogue ID (e.g. `MAT-0001`). Never changed or reused. |
| `name` | string | yes | Display name. |
| `partNumber` | string or `null` | no | `null` means unknown. Never invent one. |
| `category` | string | yes | Used to build the category filter buttons. |
| `description` | string | yes | Short, approved text. |
| `specifications` | list of `{label, value}` | yes | Empty list `[]` if none are confirmed. Never invent any. |
| `images` | list of `{src, alt}` | yes | May be empty (a placeholder is shown). Several identical items may share one representative photo, once their identity is confirmed. |

## Example

```json
{
  "id": "MAT-0002",
  "name": "Gate Valve",
  "partNumber": "GV-2040",
  "category": "Valves",
  "description": "Manual gate valve with handwheel.",
  "specifications": [{ "label": "Operation", "value": "Handwheel" }],
  "images": [{ "src": "images/materials/mat-0002-1.jpg", "alt": "Gate valve with a handwheel" }]
}
```

## Deliberately NOT in this public data

The following may be confidential and must not be added to this file:

- Client or company names
- Project names
- Ownership (for example, warehouse-owned or client-owned)
- Quantities
- Storage locations

In a future backend (FastAPI + database) these belong in a separate,
access-controlled layer, shown only to authorised staff.

## Mapping to a future database (idea)

- `materials` table: `id` (primary key), `name`, `part_number`, `category`, `description`
- `specifications` table: `material_id`, `label`, `value`
- `images` table: `material_id`, `src`, `alt`
