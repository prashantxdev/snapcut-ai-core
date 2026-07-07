// Nitro custom error handler to log and display full exception stack traces on Vercel.
import { defineErrorHandler } from "nitro";

export default defineErrorHandler((error, event) => {
  console.error("[Nitro Error Handler] Caught exception:", error);

  const errorName = error instanceof Error ? error.name : "Error";
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : "";

  const responseBody = `Nitro Server Error

Name: ${errorName}
Message: ${errorMessage}

Stack Trace:
${errorStack || "No stack trace available"}
`;

  return new Response(responseBody, {
    status: 500,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
});
