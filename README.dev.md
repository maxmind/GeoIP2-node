## Steps for releasing:

1. Review open issues and PRs to see if any can easily be fixed, closed, or
   merged.
2. Bump copyright year in `README.md`, if necessary.
3. Consider whether any dependencies need to be updated.
4. Review `CHANGELOG.md` for completeness and correctness. Update its
   release date to today.
5. Run `./dev-bin/release.sh`. This will:
   - Validate you're not on the main branch
   - Validate your branch is up to date with origin/main
   - Extract the version and date from `CHANGELOG.md`
   - Update the version in `package.json`
   - Build and test
   - Commit changes and push
   - Create a GitHub release (which triggers the npm publish workflow)
6. Merge the release PR after the workflow succeeds.
7. Verify the release on [npm](https://www.npmjs.com/package/@maxmind/geoip2-node).

Note: Publishing is done via GitHub Actions using npm Trusted Publishing
(OIDC). Manual `npm publish` is not supported.

## Development setup

Dependencies are managed with pnpm, pinned in `mise.toml`. Run `mise install`
to get it, then `pnpm install`. Do not use npm or corepack: the repo is a pnpm
workspace (`e2e/js` and `e2e/ts` are members) with a single root
`pnpm-lock.yaml`, and npm cannot resolve their `workspace:*` dependency.

Publishing is the one exception. `release.yml` calls `npm publish --provenance`.
pnpm 11 supports OIDC trusted publishing, but that change will be made in a
future issue.

## Supported development platforms

Linux on x64 and arm64, Apple Silicon macOS on arm64, and Windows on x64.
**Intel macOS and Windows ARM64 are not supported.** Intel macOS in particular
cannot be: pnpm 11.0.5 and later ship no `darwin-x64` binary, so there is
nothing for mise to install. `mise.toml` restricts `lockfile_platforms`
accordingly, but note that `mise lock` always locks whichever platform it runs
on -- so if you regenerate `mise.lock`, verify `grep -c source-maps mise.lock`
prints 0 before committing.

## Set up Precious to tidy and lint

1. Run `mkdir -p local && ./bin/install-precious local` to set up Precious locally
2. Run `./git/setup.sh` to set up pre-commit hook that invokes Precious
