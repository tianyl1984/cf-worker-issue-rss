# cf-worker-issue-rss

## Introduction

**cf-worker-issue-rss** is an open-source tool that converts GitHub repository issues into an RSS feed. This tool is designed to be deployed on Cloudflare Workers, requiring no additional storage or server resources.

## Features

- Converts GitHub repository issues into an RSS feed.
- Deployed on Cloudflare Workers.
- Lightweight and storage-free.
- Supports custom sorting and filtering of issues.

## Deployment Guide

### Prerequisites

1. **GitHub Personal Access Token**:  
   Create a personal access token on GitHub by following the [official documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

2. **Cloudflare Worker**:  
   - Create a new worker on Cloudflare.  
   - Configure the worker's environment variables:  
     - `GITHUB_TOKEN`: Your GitHub personal access token.  
     - `TOKEN` (optional): A custom token to prevent unauthorized use of your RSS feed URL.

3. **Cloudflare API Token** (for GitHub Actions deployment):  
   Create an API token on Cloudflare to enable GitHub Actions for automatic deployment. Follow the [official documentation](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/).

### Steps to Deploy

1. **Fork the Repository**:  
   Clone this repository and modify the `wrangler.toml` file. Update the `name` field with your desired worker name.

2. **Configure Secrets and Variables**:  
   - Add a repository secret in GitHub:  
     - Name: `CLOUDFLARE_API_TOKEN`  
     - Value: Your Cloudflare API token.  

3. **Deploy the Worker**:  
   Push your code changes to the repository. The GitHub Actions workflow will automatically deploy the worker.

## Usage

### Subscription URL

The RSS feed can be accessed using the following URL format:  
```
https://{worker_host}/{repo}?token={worker_token}&sort=created&direction=desc
```
- `worker_host`: The Cloudflare-provided host for your worker.  
- `repo`: The GitHub repository in `owner/repo` format.  
- `token`: The value of the `TOKEN` environment variable configured in your worker.  
- Additional parameters: These are directly passed to the [GitHub Issues API](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues).  

### Example

https://worker-name.username.workers.dev/ruanyf/weekly?token=your-token&sort=created&direction=desc

## License

This project is licensed under the MIT License. See the LICENSE file for details.
