# Homepage production redeploy

- Trigger date: 2026-07-15
- Reason: The proportional homepage implementation was merged to `main` at `f3cb5c4e15cbeaf481a4dc9637370cf59598b39e`, but the public Firebase endpoint continued serving the previous homepage.
- Required release source: `main`
- Verification contract: Firebase deploy must publish a new immutable `release.json` SHA and the live homepage must contain `Know the cost. See the risk. Make the call.`
