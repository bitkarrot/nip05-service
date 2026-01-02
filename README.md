# NIP-05 Automated PR Service

Automates NIP-05 identifier registration via pull requests. Users submit their Nostr pubkey through a web form, and the system automatically creates a PR to add them to the `nostr.json` file.

## For Users

Visit the registration form to request your NIP-05 identifier. Once your PR is approved and merged, your identifier will be active.

## Architecture

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│   Web Form      │────▶│  Express Server      │────▶│  GitHub Actions     │
│ (add-nip05.html)│     │  (/api/submit-nip05) │     │  (add-nip05.yml)    │
└─────────────────┘     └──────────────────────┘     └─────────────────────┘
                                                               │
                                                               ▼
                                                      ┌─────────────────────┐
                                                      │  Pull Request       │
                                                      │  (nostr.json)       │
                                                      └─────────────────────┘
```


1. User submits username + pubkey via the web form
2. Express server validates input and triggers a GitHub `repository_dispatch` event
3. GitHub Actions workflow updates `nostr.json` and creates a PR using `peter-evans/create-pull-request`
4. Repository owner reviews and merges the PR

## Setup Instructions

### 0. Fork this repo

Clone the repository in your github by forking this repository.
If you have already forked this repo, you can skip this step.

### 1. Create a GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens](https://github.com/settings/tokens?type=beta)
2. Create a new token with:
   - **Repository access**: Only select this repository
   - **Permissions**:
     - **Actions**: Read and write (required to trigger `repository_dispatch`)
     - **Contents**: Read and write
     - **Metadata**: Read-only (auto-granted)
     - **Pull requests**: Read and write
3. Copy the token (starts with `github_pat_`)

### 2. Enable GitHub Actions Workflow Permissions

1. Go to your repository's **Settings** → **Actions** → **General**
2. Scroll to **"Workflow permissions"**
3. Select **"Read and write permissions"**
4. Check **"Allow GitHub Actions to create and approve pull requests"**
5. Click **Save**

### 3. Deploy to Zeabur

1. Go to [Zeabur Dashboard](https://zeabur.com)
2. Create a new project or select an existing one
3. Click **Add Service** and select **Git**
4. Connect your GitHub repository (bitkarrot/nip05-service)
5. Zeabur will automatically detect the Dockerfile and deploy

### 4. Set Environment Variables in Zeabur

In your Zeabur service settings, add these environment variables:

- **`GITHUB_TOKEN`**: Your GitHub personal access token (required)
- **`GITHUB_OWNER`**: Your GitHub username (default: `bitkarrot`)
- **`GITHUB_REPO`**: Your repository name (default: `nip05-service`)
- **`ALLOWED_ORIGIN`**: CORS origin (default: `*`)

### 5. Configure Your Domain (Optional)

In Zeabur service settings, add a custom domain under **Domains** section. The service will be accessible at the provided URL.

### 6. Configure Repository (For Forks)

If you fork this repository, update the environment variables in Zeabur:
- `GITHUB_OWNER`: Your GitHub username
- `GITHUB_REPO`: Your repository name

## Files

- **`.well-known/nostr.json`** - The NIP-05 identifier mapping
- **`add-nip05.html`** - User-facing registration form
- **`api/submit-nip05.js`** - API handler for form submissions
- **`server.js`** - Express server entry point
- **`Dockerfile`** - Container configuration for Zeabur
- **`.github/workflows/add-nip05.yml`** - GitHub Actions workflow

## Security Notes

- The GitHub token is stored as a Zeabur environment variable, never exposed to users
- Input validation happens both client-side and server-side
- The workflow validates username and pubkey format before making changes
- PRs require manual approval before merging

## NIP-05 Format

Once registered, users can set their NIP-05 identifier in their Nostr profile as:

```
username@yourdomain.com
```

For the root identifier `_`, it displays as just the domain.

## License

MIT
