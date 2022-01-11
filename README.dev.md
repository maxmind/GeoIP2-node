Steps for releasing:

1. Review open issues and PRs to see if any can easily be fixed, closed, or
   merged.
2. Bump copyright year in `README.md`, if necessary.
3. Review `CHANGELOG.md` for completeness and correctness. Update its
   release date.
4. Set the new version in `package.json`.
5. Create a release PR containing the updates relating to any of the steps
   above.
6. Ensure that the release PR is merged into `main`.
7. With `main` checked out, run `npm publish`. This will generate the docs,
   deploy the docs, and publish the package to NPM.
8. Verify the release on
   [NPM](https://npmjs.com/package/@maxmind/geoip2-node).
9. Tag the release, e.g. `git tag -a v1.2.3 -m v1.2.3`
10. Push the tag: `git push --tags`
11. Create the release on GitHub. You can use the web interface.
