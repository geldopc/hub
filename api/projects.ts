import type { VercelRequest, VercelResponse } from "@vercel/node";

const NOTION_DB_ID = "3981d92d-dfd0-8131-b1a7-dd6301c59f3f";
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

      const richText = (key: string) =>
        ((props[key]?.rich_text as Array<{ plain_text: string }> | null)?.[0]?.plain_text) ?? "";
      const dateStart = (key: string) =>
        (props[key]?.date as { start: string } | null)?.start ?? null;

      const repo =
        richText("Repo") ||
        repoFromGitHubUrl((props["GitHub URL"]?.url as string | null) ?? null);
      if (!repo) return null;

      return {
        repo,
        pageId: (page as Record<string, string>).id,
        name: (props["Name"]?.title as Array<{ plain_text: string }> | null)?.[0]?.plain_text ?? repo,
        description: richText("Description"),
        stack: richText("Stack"),
        demoUrl: (props["Demo URL"]?.url as string | null) ?? null,
        status: (props["Status"]?.select as { name: string } | null)?.name ?? "Planning",
        progress: Math.round(((props["Progress"]?.number as number | null) ?? 0) * 100),
        tasksTotal: (props["Tasks Total"]?.number as number | null) ?? 0,
        tasksDone: (props["Tasks Done"]?.number as number | null) ?? 0,
        startDate: dateStart("Start Date"),
        endDate: dateStart("End Date"),
      };
    })
    .filter(Boolean);

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
  return res.status(200).json(projects);
}
