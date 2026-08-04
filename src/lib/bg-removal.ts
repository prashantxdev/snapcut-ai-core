// Direct background removal provider integration using ClipDrop API & Cloudinary.

export type RemoveBgResult = {
  bytes: Uint8Array;
  contentType: string;
  url?: string;
};

const DEFAULT_CLIPDROP_API_KEY =
  "0b96baa81349a0d887b432a6498f9df23bb5c90105f6ea45dcc86a588168d4bd1def64c167ac570fcf74665aa1742423";
const DEFAULT_CLOUDINARY_CLOUD_NAME = "df4zxvgfr";

function getEnv(key: string, fallback: string): string {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const env = import.meta.env as Record<string, string | undefined>;
    const val = env[key] || env[`VITE_${key}`];
    if (val) return val;
  }
  if (typeof process !== "undefined" && process.env) {
    const penv = process.env as Record<string, string | undefined>;
    const val = penv[key] || penv[`VITE_${key}`];
    if (val) return val;
  }
  return fallback;
}

export async function removeBackground(input: {
  bytes: Uint8Array;
  contentType: string;
  filename: string;
}): Promise<RemoveBgResult> {
  const clipdropApiKey = getEnv("CLIPDROP_API_KEY", DEFAULT_CLIPDROP_API_KEY);
  const cloudinaryCloudName = getEnv("CLOUDINARY_CLOUD_NAME", DEFAULT_CLOUDINARY_CLOUD_NAME);

  if (!clipdropApiKey) {
    throw new Error("ClipDrop API key is missing. Please configure CLIPDROP_API_KEY.");
  }

  // 1. Send image to ClipDrop Background Removal API
  const formData = new FormData();
  const inputBlob = new Blob([input.bytes as BlobPart], { type: input.contentType });
  formData.append("image_file", inputBlob, input.filename || "image.png");

  const clipdropRes = await fetch("https://clipdrop-api.co/remove-background/v1", {
    method: "POST",
    headers: {
      "x-api-key": clipdropApiKey,
    },
    body: formData,
  });

  if (!clipdropRes.ok) {
    const errText = await clipdropRes.text().catch(() => "");
    throw new Error(`ClipDrop API error (${clipdropRes.status}): ${errText.slice(0, 300) || clipdropRes.statusText}`);
  }

  const processedBuffer = await clipdropRes.arrayBuffer();
  const processedBytes = new Uint8Array(processedBuffer);
  const responseContentType = clipdropRes.headers.get("Content-Type") || "image/png";

  // 2. Upload processed image to Cloudinary
  let cloudinaryUrl: string | undefined;
  try {
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("upload_preset", "n8n direct upload");
    cloudinaryFormData.append("folder", "snapcut/uploads");
    cloudinaryFormData.append(
      "file",
      new Blob([processedBuffer], { type: responseContentType }),
      "output.png"
    );

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      }
    );

    if (cloudinaryRes.ok) {
      const cloudinaryData = (await cloudinaryRes.json()) as { secure_url?: string; url?: string };
      cloudinaryUrl = cloudinaryData.secure_url || cloudinaryData.url;
    } else {
      console.warn(`Cloudinary upload warning (${cloudinaryRes.status}):`, await cloudinaryRes.text().catch(() => ""));
    }
  } catch (cloudinaryErr) {
    console.warn("Cloudinary upload error:", cloudinaryErr);
  }

  return {
    bytes: processedBytes,
    contentType: responseContentType,
    url: cloudinaryUrl,
  };
}
