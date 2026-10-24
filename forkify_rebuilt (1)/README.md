# Forkify rebuilt from the supplied starter

## Run locally
1. Install Node.js (LTS).
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm start`.
5. Open the local URL Parcel prints in the terminal.

## Notes
- This is a reconstructed learning version based on the supplied starter HTML/assets and the project code previously shared.
- `src/js/config.js` leaves `KEY` empty. The public Forkify API may support reads without a key depending on the endpoint/account; uploading user-created recipes generally requires a valid API key. If the API requires a key, set `KEY` in `config.js`.
- Do not commit private API keys. If you use a private key, move it to a local `.env` file and configure Parcel accordingly.
