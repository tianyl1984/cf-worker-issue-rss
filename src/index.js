
function _check_token(url, env) {
	if (!env.TOKEN) {
		return
	}
	const token = url.searchParams.get('token');
	if (token != env.TOKEN) {
		throw new Error('token error!');
	}
}

async function _query_issue(env, repo, url) {
	url.searchParams.delete('token');
	const api = `https://api.github.com/repos/${repo}/issues?${url.searchParams.toString()}`;
	return (await fetch(api, {
		method: 'GET',
		headers: {
			"Accept": "application/vnd.github.v3.html+json",
			"User-Agent": "cf-worker-issue-rss",
			"Authorization": `Bearer ${env.GITHUB_TOKEN}`
		}
	})).json();
}

function _convert_rss(repo, json) {
	const items = []
	for(const issue of json) {
		const item = `
		<item>
			<title>${issue.title}</title>
			<link>${issue.html_url}</link>
			<description><![CDATA[${issue.body_html}]]></description>
			<pubDate>${issue.created_at}</pubDate>
			<guid>${issue.html_url}</guid>
		</item>
		`
		items.push(item)
	}
	return `
	<rss version="2.0">
		<channel>
			<title>${repo}'s issues</title>
			<link>https://github.com/${repo}/issues</link>
			<description>${repo}'s issues</description>
			${items.join('\n')}
		</channel>
	</rss>
	`;
}

async function _handle(req, env, ctx) {
	const url = new URL(req.url);
	_check_token(url, env);
	const repo = url.pathname.substring(1);
	const json = await _query_issue(env, repo, url);
	const xml = _convert_rss(repo, json);
	const headers = new Headers();
    headers.append('Content-Type', 'application/xml; charset=utf-8');
	return new Response(xml, { headers });
}

export default {
	async fetch(request, env, ctx) {
		try {
			return await _handle(request, env, ctx);
		} catch (err) {
			console.error('Unhandled error:', err);
			return new Response(err.message, { status: 500 });
		}
	},
};
