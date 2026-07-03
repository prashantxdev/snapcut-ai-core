// Server-only background removal provider abstraction.
// Swap providers by changing PROVIDER below or via env.

export type RemoveBgResult = {
  bytes: Uint8Array;
  contentType: string;
};

export async function removeBackground(input: {
  bytes: Uint8Array;
  contentType: string;
  filename: string;
}): Promise<RemoveBgResult> {
  const res = await fetch("https://prashantxdev.app.n8n.cloud/webhook/remove-background", {
    method: "POST",
    headers: {
      "Content-Type": input.contentType,
    },
    body: new Blob([input.bytes as BlobPart]),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Webhook error ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = (await res.json()) as { url?: string };
  if (!data.url) {
    throw new Error("Webhook response did not contain a result URL.");
  }

  const imgRes = await fetch(data.url);
  if (!imgRes.ok) {
    throw new Error(`Failed to fetch processed image from URL: ${data.url}`);
  }

  const buf = new Uint8Array(await imgRes.arrayBuffer());
  const responseContentType = imgRes.headers.get("Content-Type") || "image/png";
  return { bytes: buf, contentType: responseContentType };
}