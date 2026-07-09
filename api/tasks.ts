import type { VercelRequest, VercelResponse } from "@vercel/node";

const TASKS_DB_ID = "3981d92d-dfd0-81a0-95fa-c1919bf9b101";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(req, res);

  if (req.method === "OPTIONS") return res.status(204).end();

  const token = process.env.NOTION_TOKEN;
  if (!token) return res.status(500).json({ error: "NOTION_TOKEN not configured" });

  const repo = req.query.repo as string | undefined;
  if (!repo) return res.status(200).json([]);

  const response = await fetch(
    `https://api.notion.com/v1/databases/${TASKS_DB_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_size: 100,
        filter: {
          property: "Project",
          select: { equals: repo },
        },
      }),
    }
  );

  if (!response.ok) {
    return res.status(502).json({ error: "Notion API error" });
  }

  const json = await response.json();

  const tasks = json.results.map((page: Record<string, unknown>) => {
    const props = page.properties as Record<string, Record<string, unknown>>;
    const createdTime = (page as Record<string, string>).created_time ?? null;

    const title = (props["Story"]?.title as Array<{ plain_text: string }> | null)?.[0]?.plain_text ?? null;
    const status = (props["Status"]?.select as { name: string } | null)?.name ?? null;
    const epic = (props["Epic"]?.select as { name: string } | null)?.name ?? null;

    return {
      id: (page as Record<string, string>).id,
      title,
      createdDate: createdTime ? createdTime.slice(0, 10) : null,
      status,
      epic,
    };
  });

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
  return res.status(200).json(tasks);
}
