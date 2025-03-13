# Vercel Deployment-Anleitung für MedMatch

Diese Anleitung beschreibt die Schritte, um das MedMatch-Projekt auf Vercel zu veröffentlichen.

## Voraussetzungen

- Ein Vercel-Konto (kostenlos erstellbar unter [vercel.com](https://vercel.com))
- Das Projekt ist bereits auf GitHub unter https://github.com/seppelz/arztvermittlung.git verfügbar

## Schritt-für-Schritt Anleitung

### 1. Bei Vercel anmelden

- Gehe zu [vercel.com](https://vercel.com) und melde dich an oder erstelle ein neues Konto
- Du kannst dich mit deinem GitHub-Konto anmelden, um den Prozess zu vereinfachen

### 2. Neues Projekt erstellen

- Klicke auf "Add New..." und wähle "Project"
- Verbinde dein GitHub-Konto, wenn noch nicht geschehen
- Wähle das Repository "seppelz/arztvermittlung" aus der Liste

### 3. Projekt konfigurieren

Die meisten Einstellungen werden automatisch erkannt, da wir bereits eine `vercel.json`-Datei im Projekt haben. Überprüfe die folgenden Einstellungen:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Umgebungsvariablen (falls erforderlich)

- Falls dein Projekt Umgebungsvariablen benötigt, füge diese unter dem Tab "Environment Variables" hinzu
- Für MedMatch sind derzeit keine Umgebungsvariablen erforderlich

### 5. Projekt deployen

- Klicke auf "Deploy"
- Vercel wird nun das Projekt bauen und veröffentlichen
- Nach erfolgreichem Deployment erhältst du eine URL (z.B. medmatch.vercel.app), unter der deine Anwendung erreichbar ist

### 6. Domain konfigurieren (optional)

- Wenn du eine benutzerdefinierte Domain verwenden möchtest, gehe zum Tab "Domains"
- Füge deine Domain hinzu und folge den Anweisungen zur DNS-Konfiguration

### 7. Continuous Deployment

- Vercel richtet automatisch Continuous Deployment ein
- Jeder Push in den `main`-Branch deines GitHub-Repositories wird automatisch auf Vercel deployed

## Problembehandlung

- **Build-Fehler**: Überprüfe die Build-Logs auf Vercel für detaillierte Fehlerinformationen
- **Routing-Probleme**: Stelle sicher, dass die `vercel.json`-Datei korrekt konfiguriert ist, um SPA-Routing zu unterstützen
- **Leistungsprobleme**: Nutze den "Analytics"-Tab auf Vercel, um die Leistung deiner Anwendung zu überwachen und zu optimieren

## Nächste Schritte nach dem Deployment

- Teste die Anwendung gründlich auf der Live-URL
- Nutze Vercel Analytics, um das Nutzerverhalten zu verstehen
- Richte automatische Previews für Pull Requests ein (in den Projekteinstellungen unter "Git") 