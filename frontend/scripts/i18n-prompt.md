COMPONENT AUTO-TRANSLATION PROMPT

IMPORTANT: When working with translations, DO NOT modify:

- CSS files
- HTML structure
- Component logic
  without explicit permission from the user.

Your role is to:

1. Create/update translation files
2. Help identify text that needs translation
3. Suggest translation keys
4. Guide on translation implementation

Given a component's files, create translations following this structure:

1. ANALYZE TEMPLATE

- Extract all text content from the template
- Identify text in attributes (labels, placeholders, etc.)
- Note any dynamic content that needs translation

2. CREATE I18N STRUCTURE
   Path: src/app/.../[component-name]/i18n/
   Files needed: en.json, fr.json

3. JSON STRUCTURE

```json
{
  "[componentNameCamelCase]": {
    // Keys should be camelCase
    // Values should be natural language
    // Group related translations
  }
}
```

4. COMMON TRANSLATIONS PATTERNS
   English -> French

- Buttons/Actions:

  - "Save" -> "Enregistrer"
  - "Delete" -> "Supprimer"
  - "Edit" -> "Modifier"
  - "Add" -> "Ajouter"
  - "Cancel" -> "Annuler"
  - "Close" -> "Fermer"

- Common UI Elements:

  - "Search" -> "Rechercher"
  - "Filter" -> "Filtrer"
  - "Sort by" -> "Trier par"
  - "Loading" -> "Chargement"

- Form Labels:

  - "Name" -> "Nom"
  - "Email" -> "E-mail"
  - "Password" -> "Mot de passe"
  - "Username" -> "Nom d'utilisateur"

- Status Messages:

  - "Success" -> "Succès"
  - "Error" -> "Erreur"
  - "Warning" -> "Avertissement"


5. IMPLEMENTATION STEPS
   a. Create i18n folder:

```bash
mkdir -p src/app/.../[component-name]/i18n
```

b. Add translation files:

- en.json with English text
- fr.json with French translations

c. Update component:

```typescript
import { TranslateModule } from "@ngx-translate/core";

@Component({
  // ...
  imports: [
    TranslateModule,
    // other imports
  ],
})
```

d. Update template:
Replace all hardcoded text with translation pipes, do not modify HTML structure:

```html
{{ "[componentNameCamelCase].[key]" | translate }}
```

6. QUALITY CHECKS

- Verify all text is externalized
- Check for proper nesting/namespacing
- Ensure consistent key naming
- Validate JSON syntax
- Test both languages
- Check for missing translations
- Verify placeholder handling

7. SPECIAL CASES

- Handle pluralization
- Consider gender-specific translations
- Account for different text lengths
- Manage dynamic content
- Handle formatting (dates, numbers, currency)

8. BEST PRACTICES

- Use semantic keys
- Group related translations
- Keep structure flat when possible
- Document special cases
- Use consistent naming
- Consider text expansion

9. FINAL STEPS

After completing the translations:

1. Run `make i18n-merge` to merge the new translations with existing ones
2. Run `make lint` to ensure code quality and formatting
