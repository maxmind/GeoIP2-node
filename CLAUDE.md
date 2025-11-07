# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GeoIP2-node** is MaxMind's official Node.js/TypeScript client library for:
- **GeoIP2/GeoLite2 Web Services**: Country, City, and Insights endpoints
- **GeoIP2/GeoLite2 Databases**: Local MMDB file reading for various database types (City, Country, ASN, Anonymous IP, Anonymous Plus, ISP, etc.)

The library provides both web service clients and database readers that return strongly-typed model objects containing geographic, ISP, anonymizer, and other IP-related data.

**Key Technologies:**
- TypeScript with strict type checking
- Node.js 18+ (targets active LTS versions)
- maxmind (node-maxmind) for MMDB database reading
- Jest for testing
- ESLint + Prettier for code quality
- TypeDoc for API documentation

## Code Architecture

### Package Structure

```
src/
├── models/              # Response models (City, Country, AnonymousIP, etc.)
├── records.ts           # TypeScript interfaces for data records
├── reader.ts            # Database file reader
├── readerModel.ts       # Database lookup methods
├── webServiceClient.ts  # HTTP client for MaxMind web services
├── utils.ts             # Utility functions (camelCase conversion, CIDR)
├── errors.ts            # Custom error classes
└── types.ts             # Type definitions
```

### Key Design Patterns

#### 1. **snake_case to camelCase Conversion**

API responses and database data use `snake_case`, but the library exposes `camelCase` properties:

```typescript
// API returns: { network_last_seen: "2025-04-14" }
// Model exposes: anonymousPlus.networkLastSeen

constructor(response: mmdb.AnonymousPlusResponse) {
  this.networkLastSeen = response.network_last_seen;
}
```

The `camelcaseKeys()` utility in `utils.ts` handles deep conversion for web service responses. Database models handle conversion in constructors.

#### 2. **Model Inheritance Hierarchy**

Models follow clear inheritance patterns:
- `Country` → base model with country/continent/traits data
- `City` extends `Country` → adds city, location, postal, subdivisions
- `Insights` extends `City` → adds web service-specific fields
- `Enterprise` extends `City` → adds enterprise database fields

#### 3. **Constructor Parameter Pattern**

Models are constructed from raw response data with optional IP address and network:

```typescript
public constructor(
  response: ResponseType,
  ipAddress?: string,
  network?: string
) {
  // Handle data transformation
  this.traits.ipAddress ??= ipAddress;
  this.traits.network ??= network;
}
```

#### 4. **Boolean Field Normalization**

Boolean traits are normalized to `false` when missing (never undefined):

```typescript
private setBooleanTraits(traits: any) {
  const booleanTraits = [
    'isAnonymous',
    'isAnonymousProxy',
    // ...
  ];

  booleanTraits.forEach((trait) => {
    traits[trait] = !!traits[trait];
  });

  return traits as records.TraitsRecord;
}
```

#### 5. **Reader Pattern (Database Access)**

Database access uses a two-step pattern:
1. `Reader.open(path)` or `Reader.openBuffer(buffer)` → returns `ReaderModel`
2. `readerModel.city(ip)` / `readerModel.anonymousPlus(ip)` → returns model

The `ReaderModel` wraps the underlying `node-maxmind` reader and provides typed lookup methods.

#### 6. **Web Service Client Pattern**

Web service access uses direct methods on `WebServiceClient`:

```typescript
const client = new WebServiceClient(accountID, licenseKey, { host, timeout });
const response = await client.city('1.2.3.4');
```

## Testing Conventions

### Running Tests

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npx jest src/readerModel.spec.ts
```

### Linting and Building

```bash
# Lint code (ESLint)
npm run lint

# Format code (Prettier)
npm run prettier:ts

# Build TypeScript
npm run build

# Build and deploy documentation
npm run build:docs
npm run deploy:docs
```

### Test Structure

Tests use `.spec.ts` files co-located with source:
- `src/readerModel.spec.ts` - Database reader tests
- `src/webServiceClient.spec.ts` - Web service client tests
- `src/reader.spec.ts` - Reader initialization tests
- `src/utils.spec.ts` - Utility function tests

Additional integration tests in `test/` and `e2e/` directories.

### Test Patterns

When adding new fields to models:
1. Update test fixtures/mocks to include the new field
2. Add assertions to verify the field is properly mapped
3. Test both presence and absence (undefined handling)
4. Verify camelCase conversion if from snake_case source

Example:
```typescript
const response = {
  anonymizer_confidence: 99,
  network_last_seen: '2025-04-14',
  provider_name: 'FooBar VPN',
};

const model = new AnonymousPlus(response, '1.2.3.4');

expect(model.anonymizerConfidence).toBe(99);
expect(model.networkLastSeen).toBe('2025-04-14');
expect(model.providerName).toBe('FooBar VPN');
```

## Working with This Codebase

### Adding New Fields to Existing Models

1. **Add the property** with proper type annotation:
   ```typescript
   /**
    * Description of the field, including availability (which endpoints/databases).
    */
   public fieldName?: Type;
   ```

2. **Update the constructor** to map from the response:
   ```typescript
   this.fieldName = response.field_name;
   ```

3. **For Country/City models using camelcaseKeys**, the conversion is automatic. For other models, handle snake_case explicitly.

4. **Update corresponding record interfaces** in `records.ts` if the field appears in a reusable record type (like `TraitsRecord`).

5. **Add tests** that verify the field mapping and type.

6. **Update CHANGELOG.md** with the change (see format below).

### Adding New Models

When creating a new model class:

1. **Determine the appropriate base class** (standalone, extends Country, extends City)
2. **Create the model file** in `src/models/YourModel.ts`
3. **Export from** `src/models/index.ts`
4. **Follow the constructor pattern** with response, ipAddress, network parameters
5. **Add corresponding method** in `readerModel.ts` or `webServiceClient.ts`
6. **Update type definitions** in `types.ts` if needed
7. **Add comprehensive tests**
8. **Update TypeDoc comments** for generated API documentation

### CHANGELOG.md Format

Always update `CHANGELOG.md` for user-facing changes.

**Important**: Do not add a date to changelog entries until release time.

- If the next version doesn't exist, create it as `X.Y.Z (unreleased)`
- If it already exists without a date (e.g., `6.3.0 (unreleased)`), add your changes there
- The release date will be added when the version is actually released

```markdown
6.3.0 (unreleased)
------------------

* A new `fieldName` property has been added to `ModelName`. This field
  provides information about... Available from [endpoint/database names].
* The `oldField` property in `ModelName` has been deprecated. Please use
  `newField` instead.
```

## Common Pitfalls and Solutions

### Problem: Incorrect snake_case to camelCase Mapping

Database responses use snake_case but must be exposed as camelCase.

**Solution**:
- For `Country` and `City` models: `camelcaseKeys()` handles this automatically
- For other models (e.g., `AnonymousPlus`): Manually map in constructor
  ```typescript
  this.networkLastSeen = response.network_last_seen;
  ```

### Problem: Boolean Fields Not Properly Normalized

Boolean traits should always be `false` when missing, never `undefined`.

**Solution**: Use the `setBooleanTraits()` pattern or explicit `!!` coercion:
```typescript
this.isAnonymous = !!response.is_anonymous;
```

### Problem: Missing IP Address or Network Fields

Models should include the IP address and network from lookups.

**Solution**: Always pass and set these optional parameters:
```typescript
this.traits.ipAddress ??= ipAddress;
this.traits.network ??= network;
```

### Problem: Type Mismatches with node-maxmind

The underlying `maxmind` package has its own types.

**Solution**: Import types from `maxmind` when needed:
```typescript
import * as mmdb from 'maxmind';

public constructor(response: mmdb.AnonymousPlusResponse) {
  // ...
}
```

## Code Style Requirements

- **TypeScript strict mode** - All files use strict type checking
- **ESLint** - Configured with TypeScript ESLint rules (see `eslint.config.mjs`)
- **Prettier** - Consistent formatting enforced
- **Prefer arrow callbacks** - Use arrow functions for callbacks
- **await-thenable** - Only await promises
- **No unused variables/imports** - Clean up unused code
- **TypeDoc comments** - Document public APIs with JSDoc-style comments

## Development Workflow

### Setup
```bash
npm install
```

### Before Committing
```bash
# Tidy code (auto-fix issues)
precious tidy -g

# Lint code (check for issues)
precious lint -g

# Run tests
npm test

# Build
npm run build
```

Note: Precious is already set up and handles code formatting and linting. Use `precious tidy -g` to automatically fix issues, and `precious lint -g` to check for remaining problems.

### Version Requirements
- **Node.js 18+** required (targets active LTS: 18, 20, 22)
- Uses Node.js built-in `fetch` (no external HTTP libraries)
- TypeScript 5.x

## Cross-Language Consistency

This library is part of MaxMind's multi-language client library ecosystem. When adding features:

- **Field names** should match other client libraries (PHP, Python, etc.) after camelCase conversion
- **Model structure** should parallel other implementations where possible
- **Error handling** patterns should be consistent
- **Documentation style** should follow established patterns

Refer to the GeoIP2-php implementation for guidance on new features (especially model/record additions).

## Additional Resources

- [API Documentation](https://maxmind.github.io/GeoIP2-node/)
- [GeoIP2 Web Services Docs](https://dev.maxmind.com/geoip/docs/web-services)
- [MaxMind DB Format](https://maxmind.github.io/MaxMind-DB/)
- [node-maxmind library](https://github.com/runk/node-maxmind)
- GitHub Issues: https://github.com/maxmind/GeoIP2-node/issues
