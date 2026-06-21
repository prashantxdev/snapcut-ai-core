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
  const apiKey = process.env.REMOVEBG_API_KEY;
  if (!apiKey) {
    throw new Error(
      "REMOVEBG_API_KEY is not configured. Add it via Lovable Cloud secrets to enable background removal."
    );
  }

  const form = new FormData();
  form.append("size", "auto");
  form.append(
    "image_file",
    new Blob([input.bytes as BlobPart], { type: input.contentType }),
    input.filename,
  );

  const res = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": apiKey },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Remove.bg API error ${res.status}: ${text.slice(0, 300)}`);
  }

  const buf = new Uint8Array(await res.arrayBuffer());
  return { bytes: buf, contentType: "image/png" };
}