# Investigation: Issue #815 - fs.openAsBlob() for Memory Mapping

## Executive Summary

**Conclusion: NOT feasible without upstream library changes**

Implementing `fs.openAsBlob()` as described in issue #815 cannot be done without modifying the upstream libraries (`maxmind` and `mmdb-lib`). The fundamental incompatibility between the Blob API and the Buffer-dependent architecture, combined with the lack of true memory-mapping in `fs.openAsBlob()`, makes this enhancement impossible at the GeoIP2-node wrapper level.

## Issue Overview

Issue #815 proposes using Node.js's `fs.openAsBlob()` API to achieve memory-mapping capabilities similar to the Go implementation, with the goal of reducing memory consumption.

## Current Architecture

### Stack Overview
```
GeoIP2-node (wrapper)
    ↓
maxmind (v5.0.1) - file loading & caching
    ↓
mmdb-lib (v3.0.1) - MMDB parsing & data access
```

### Current File Loading (maxmind/lib/index.js:56-69)

The `maxmind` library currently loads files entirely into memory:

```javascript
const readFile = async (filepath) => {
    const fstat = await fs.stat(filepath);
    return fstat.size < LARGE_FILE_THRESHOLD
        ? fs.readFile(filepath)
        : readLargeFile(filepath, fstat.size);
};

const open = async (filepath, opts, cb) => {
    const database = await readFile(filepath);  // Entire file loaded
    const reader = new mmdb_lib.Reader(database, { cache });
    // ...
};
```

- Files < 512MB: Loaded with `fs.readFile()`
- Files ≥ 512MB: Streamed in 8MB chunks into a pre-allocated Buffer
- Result: Entire database in memory as a Buffer

### Buffer Dependency in mmdb-lib

The `mmdb-lib.Reader` is deeply integrated with Node.js Buffer:

**Type signature (mmdb-lib/lib/index.d.ts:11):**
```typescript
constructor(db: Buffer, opts?: ReaderOptions);
```

**Strict validation (mmdb-lib/lib/index.js:32-34):**
```javascript
if (!Buffer.isBuffer(db)) {
    throw new Error(`mmdb-lib expects an instance of Buffer, got: ${typeof db}`);
}
```

**Heavy Buffer method usage:**

1. **Walker (mmdb-lib/lib/reader/walker.js):**
   - `db.readUIntBE(offset, length)` - Reading unsigned big-endian integers
   - `db.readUInt32BE(offset)` - Reading 32-bit values
   - `db[offset]` - Direct byte access

2. **Decoder (mmdb-lib/lib/decoder.js):**
   - `this.db[offset]` - Direct byte array access throughout
   - `this.db.slice()` - Buffer slicing for string decoding
   - Various other Buffer-specific methods

The entire library assumes random-access byte array operations that are Buffer-specific.

## Understanding fs.openAsBlob()

### What It Actually Does

Based on Node.js documentation and implementation discussions:

**Status:** Experimental (Stability: 1) as of Node.js v22.x

**Memory Characteristics:**
- Returns a `Blob` object (NOT a Buffer)
- Uses lazy loading initially - doesn't read content into memory on creation
- **Critical limitation:** When first read, the blob is materialized into memory
- After first read, becomes an in-memory blob to maintain immutability

**From Node.js Issue #45188:**
> "a stream-based `Blob` will transition into an in-memory blob following that first read"

### Why It's Not Memory-Mapping

Despite being file-backed, `fs.openAsBlob()` is **NOT memory-mapped**:

1. **No mmap usage:** Implementation uses file descriptors and regular I/O
2. **Lazy loading ≠ memory mapping:** It delays reading, but still reads into memory
3. **True mmap in Node.js:** Requires third-party packages like `mmap-io` or `node-mmap`

### Blob vs Buffer Incompatibility

**Blob API (Web Standard):**
```javascript
const blob = await fs.openAsBlob('file.mmdb');
// Methods: arrayBuffer(), text(), stream(), slice()
// No direct byte access
// No Buffer methods
```

**What mmdb-lib needs:**
```javascript
const buffer = Buffer.from(...);
buffer.readUInt32BE(offset);     // ✗ Not available on Blob
buffer[offset];                   // ✗ Not available on Blob
buffer.slice(start, end);         // ✗ Different semantics
```

## Could We Convert Blob to Buffer?

### The Conversion Path

```javascript
const blob = await fs.openAsBlob('file.mmdb');
const arrayBuffer = await blob.arrayBuffer();  // Loads entire file into memory
const buffer = Buffer.from(arrayBuffer);        // Creates Buffer from memory
```

### Why This Defeats the Purpose

1. **`blob.arrayBuffer()` is not zero-copy:** It reads the entire file into memory
2. **No memory savings:** Results in the same memory usage as `fs.readFile()`
3. **Performance penalty:** Extra conversion step adds overhead
4. **No mmap benefits:** Still using regular heap allocation

This approach provides **no advantage** over the current implementation and actually adds complexity.

## What Would Be Needed for True Memory-Mapping?

### Option 1: Use Third-Party mmap Package

Packages like `mmap-io` provide true memory-mapping:

```javascript
const mmap = require('mmap-io');

// Map file to memory
const fd = fs.openSync('file.mmdb', 'r');
const stats = fs.fstatSync(fd);
const mappedBuffer = mmap.map(stats.size, mmap.PROT_READ, mmap.MAP_SHARED, fd, 0);

// mappedBuffer behaves like a Buffer
const reader = new mmdb.Reader(mappedBuffer);
```

**Requirements:**
- Modify `maxmind` library to support mmap option
- Handle platform-specific differences (Linux, macOS, Windows)
- Manage file descriptor lifecycle
- Deal with potential mmap limitations (address space on 32-bit systems)

### Option 2: Refactor mmdb-lib for Abstract Data Access

Create an abstraction layer that doesn't require Buffer:

```typescript
interface DataAccess {
    readUInt32BE(offset: number): number;
    readUIntBE(offset: number, length: number): number;
    readByte(offset: number): number;
    // ...
}
```

Then implement:
- `BufferDataAccess` - Current Buffer-based implementation
- `MmapDataAccess` - Memory-mapped implementation
- `BlobDataAccess` - Blob-based (though still not true mmap)

**Requirements:**
- Major refactoring of `mmdb-lib`
- Breaking changes to the API
- Significant testing effort
- Maintenance burden

## Comparison with Go Implementation

The Go implementation uses `mmap` system call directly:

```go
// github.com/oschwald/maxminddb-golang
mmap.Map(f, mmap.RDONLY, 0)
```

This provides true memory-mapping where:
- Pages are loaded on-demand from disk
- OS manages memory pressure
- Multiple processes can share the same mapped region
- No heap allocation for database content

**Node.js does not provide this capability natively.**

## Recommendations

### Short Term: Not Feasible at GeoIP2-node Level

The changes required are in upstream libraries:
1. `mmdb-lib` would need to support non-Buffer data sources
2. `maxmind` would need mmap integration

**GeoIP2-node cannot implement this enhancement alone.**

### Medium Term: Feature Request to Upstream

If memory-mapping is desired:
1. Open feature request on `maxmind` repository (runk/node-maxmind)
2. Discuss with maintainers about mmap integration
3. Consider using `mmap-io` or similar package
4. Would be a significant breaking change requiring careful design

### Long Term: Wait for Node.js Native Support

There's an open feature request (nodejs/node#41069) for native memory-mapped file support. If Node.js adds first-class mmap support:
1. Would provide cross-platform API
2. Could potentially be integrated into Buffer
3. Would make this enhancement more feasible

## Alternative Approaches

If memory consumption is the primary concern:

### 1. Database Splitting
Split large databases into smaller regional files to reduce per-process memory.

### 2. External Cache/Service
Use a separate GeoIP service (Redis, standalone process) that multiple applications query.

### 3. Lazy Loading Wrapper
Implement application-level lazy loading where the database is only loaded when needed and can be unloaded during idle periods.

### 4. Use Go Implementation
If memory mapping is critical, consider using the Go implementation via:
- Microservice architecture
- FFI/native bindings
- Child process with IPC

## Conclusion

**Issue #815 cannot be implemented without upstream library changes** for the following reasons:

1. ✗ `fs.openAsBlob()` does not provide true memory-mapping
2. ✗ Blob API is incompatible with Buffer-dependent mmdb-lib
3. ✗ Converting Blob→Buffer loads entire file into memory
4. ✗ No memory savings compared to current implementation
5. ✗ Adds complexity without benefits

**True memory-mapping requires:**
- Upstream library refactoring (mmdb-lib)
- Integration with mmap libraries (mmap-io)
- Or waiting for native Node.js mmap support

The issue should remain open as a "future enhancement" pending upstream changes, but it cannot be implemented at the GeoIP2-node wrapper level.
