# Med-Match Backend

## Database Seeding

The application includes scripts to help populate the database with sample data for development and testing purposes.

### Seeding the Database

To seed the database with sample data:

```bash
# Run normal seeding (will skip if entries exist)
node utils/seedData.js

# Force seeding (will clear collections and add entries even if data exists)
node utils/seedData.js --force
```

The `--force` flag will delete existing entries in the Bulletin and Contact collections before adding new ones. This is useful when you need to reset these collections or when the script incorrectly detects existing entries.

### Checking Database Content

To check what's actually in your database:

```bash
node utils/checkDbContent.js
```

This will print information about:
- Number of documents in each collection
- Most recent bulletin entries
- Most recent contact requests
- All collection names in the database

## API Endpoints

### Bulletin Board

- `GET /api/bulletin` - Get bulletin board entries
  - Query parameters:
    - `messageType` - Filter by message type (Information, Angebot, Gesuch)
    - `limit` - Limit number of results
    - `sort` - Sort by field (e.g., `-timestamp` for newest first)

- `POST /api/bulletin` - Create a new bulletin entry

### Contacts

- `GET /api/contacts` - Get contact requests
- `POST /api/contacts` - Create a new contact request

### Users

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user 