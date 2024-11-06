## Steps for releasing:

1. Review open issues and PRs to see if any can easily be fixed, closed, or
   merged.
2. Bump copyright year in `README.md`, if necessary.
3. Consider whether any dependencies need to be updated.
4. Review `CHANGELOG.md` for completeness and correctness. Update its
   release date.
5. Set the new version in `package.json`.
6. Run `npm publish`. You can do this from the release branch. This will
   generate the docs, deploy docs, and publish the module to NPM.
7. Create a release PR containing the updates relating to any of the steps
   above.
8. Tag the release, e.g. `git tag -a v1.2.3 -m v1.2.3`
9. Push the tag: `git push --tags`
10. Create the release on GitHub. You can use the web interface.
11. Verify the release on
    [NPM](https://npmjs.com/package/@maxmind/geoip2-node).

## Set up Precious to tidy and lint

1. Run `mkdir -p local && ./bin/install-precious local` to set up Precious locally
2. Run `./git/setup.sh` to set up pre-commit hook that invokes Precious
