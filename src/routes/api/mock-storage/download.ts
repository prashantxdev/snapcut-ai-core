import { createFileRoute } from '@tanstack/react-router';
import { mockStorage } from '@/integrations/supabase/mock-client';

export const Route = createFileRoute('/api/mock-storage/download')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const path = url.searchParams.get("path");
        if (!path) {
          return new Response("Missing path", { status: 400 });
        }

        const file = await mockStorage.get(path);
        if (!file) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(file.bytes, {
          headers: {
            "Content-Type": file.contentType,
            "Content-Length": file.bytes.length.toString(),
            "Cache-Control": "public, max-age=3600",
            "Access-Control-Allow-Origin": "*",
          },
        });
      },
    },
  },
});
