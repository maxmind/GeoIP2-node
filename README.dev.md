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
7. Verify the release on [npm](https://npmjs.com/package/@maxmind/geoip2-node).

Note: Publishing is done via GitHub Actions using npm Trusted Publishing
(OIDC). Manual `npm publish` is not supported.

## Set up Precious to tidy and lint

1. Run `mkdir -p local && ./bin/install-precious local` to set up Precious locally
2. Run `./git/setup.sh` to set up pre-commit hook that invokes Precious
