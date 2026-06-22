#!/usr/bin/env node
/**
 * Notion helper for hub dev loop.
 * Usage:
 *   node scripts/notion.js list          — list all Backlog stories
 *   node scripts/notion.js next          — show next story to implement
 *   node scripts/notion.js done "title"  — mark story as Done
 *
 * Requires NOTION_TOKEN in .env.local
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local
try {
  const env = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of env.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
} catch {
  // .env.local not found — rely on process.env
}

const TOKEN = process.env.NOTION_TOKEN;
const DB_ID = "bbc22d27-c822-41d3-8a7c-8d8b9d4c2476";

if (!TOKEN) {
  console.error("❌  NOTION_TOKEN not set. Add it to .env.local");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
};

async function queryBacklog(filterStatus = "Backlog") {
  const res = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      filter: { property: "Status", select: { equals: filterStatus } },
      sorts: [
        { property: "Epic", direction: "ascending" },
        { property: "Priority", direction: "ascending" },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("❌  Notion API error:", data.message);
    process.exit(1);
  }
  return data.results;
}

async function markDone(title) {
  // Find the page by title
  const pages = await queryBacklog("Backlog");
  const page = pages.find(
    (p) => p.properties.Story?.title?.[0]?.plain_text?.toLowerCase() === title.toLowerCase()
  );

  if (!page) {
    // Try In Progress too
    const inProgress = await queryBacklog("In Progress");
    const p2 = inProgress.find(
      (p) => p.properties.Story?.title?.[0]?.plain_text?.toLowerCase() === title.toLowerCase()
    );
    if (!p2) {
      console.error(`❌  Story not found: "${title}"`);
      process.exit(1);
    }
    return markPageDone(p2.id, title);
  }
  return markPageDone(page.id, title);
}

async function markPageDone(pageId, title) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      properties: { Status: { select: { name: "Done" } } },
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    console.error("❌  Failed to update:", data.message);
    process.exit(1);
  }
  console.log(`✅  Marked as Done: "${title}"`);
}

function formatStory(page) {
  const props = page.properties;
  const title = props.Story?.title?.[0]?.plain_text ?? "(untitled)";
  const epic = props.Epic?.select?.name ?? "—";
  const size = props.Size?.select?.name ?? "?";
  const priority = props.Priority?.select?.name ?? "?";
  const hours = props.Hours?.number ?? "?";
  return { title, epic, size, priority, hours };
}

const [, , command, ...args] = process.argv;

if (command === "list") {
  const pages = await queryBacklog();
  if (!pages.length) {
    console.log("🎉  No stories left in Backlog!");
    process.exit(0);
  }
  console.log(`\n📋  Backlog (${pages.length} stories)\n`);
  let currentEpic = "";
  for (const page of pages) {
    const s = formatStory(page);
    if (s.epic !== currentEpic) {
      console.log(`\n  ${s.epic}`);
      currentEpic = s.epic;
    }
    console.log(`    [ ] ${s.title} — ${s.size} — ${s.priority} (${s.hours}h)`);
  }
  console.log("");
} else if (command === "next") {
  const pages = await queryBacklog();
  if (!pages.length) {
    console.log("🎉  All stories done! Nothing left in Backlog.");
    process.exit(0);
  }
  const s = formatStory(pages[0]);
  console.log(`\n📌  Next story\n`);
  console.log(`  Title:    ${s.title}`);
  console.log(`  Epic:     ${s.epic}`);
  console.log(`  Size:     ${s.size} (~${s.hours}h)`);
  console.log(`  Priority: ${s.priority}\n`);
} else if (command === "done") {
  const title = args.join(" ");
  if (!title) {
    console.error('Usage: node scripts/notion.js done "Story title"');
    process.exit(1);
  }
  await markDone(title);
} else {
  console.log("Usage:");
  console.log("  node scripts/notion.js list");
  console.log("  node scripts/notion.js next");
  console.log('  node scripts/notion.js done "Story title"');
}
