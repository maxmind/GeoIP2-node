Steps for releasing:

1. Review open issues and PRs to see if any can easily be fixed, closed, or merged.
2. Bump copyright year in `README.md`, if necessary.
3. Review `CHANGELOG.md` for completeness and correctness. Update its release date.
4. Create a release PR containing the updates relating to any of the steps above.
5. Ensure that the release PR is merged into master.
6. With `master` checked out, run `yarn run release`. This will generate the docs, deploy docs, tag the release, push it to origin, create a GitHub release, and version the package on NPM.
7. Verify the release on [GitHub](https://github.com/maxmind/GeoIP2-node/releases)
   and [NPM](https://npmjs.com/package/@maxmind/geoip2-node).
8. Manually edit the release on GitHub to include the release-specific notes found in `CHANGELOG.md`.
