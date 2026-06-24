import type { VercelRequest, VercelResponse } from "@vercel/node";

const NOTION_DB_ID = "f9b46a82-4664-469f-a451-dfdeec884584";
const ALLOWED_ORIGINS = [
  "https://geldopc.github.io",
  "http://localhost:5175",
  "http://localhost:3000",
];

function setCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin ?? "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function repoFromGitHubUrl(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/github\.com\/[^/]+\/([^/]+)/);
  return match ? match[1] : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const token = process.env.NOTION_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "NOTION_TOKEN not configured" });
  }

  const response = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page_size: 100 }),
    }
  );

  if (!response.ok) {
    return res.status(502).json({ error: "Notion API error" });
  }

  const json = await response.json();

  const projects = json.results
    .map((page: Record<string, unknown>) => {
      const props = page.properties as Record<string, Record<string, unknown>>;
      const githubUrl =
        (props["GitHub URL"]?.url as string | null) ?? null;
      const repo = repoFromGitHubUrl(githubUrl);
      if (!repo) return null;

      const dateStart = (d: string) =>
        (props[d]?.date as { start: string } | null)?.start ?? null;

      return {
        repo,
        pageId: (page as Record<string, string>).id,
        status: (props["Status"]?.select as { name: string } | null)?.name ?? "Planning",
        progress: (props["Progress"]?.number as number | null) ?? 0,
        type: (props["Type"]?.select as { name: string } | null)?.name ?? "other",
        startDate: dateStart("Start Date") ?? dateStart("Início") ?? dateStart("Data de início"),
        endDate: dateStart("End Date") ?? dateStart("Fim") ?? dateStart("Data de conclusão"),
      };
    })
    .filter(Boolean);

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
  return res.status(200).json(projects);
}
