/**
 * Agent Gateway MCP Server
 *
 * This MCP server allows Claude and other AI assistants to interact with
 * the Agent Gateway API registry.
 *
 * Install: npm install @modelcontextprotocol/sdk
 *
 * Add to Claude config:
 * {
 *   "mcpServers": {
 *     "agent-gateway": {
 *       "command": "npx",
 *       "args": ["tsx", "mcp-server/index.ts"]
 *     }
 *   }
 * }
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const BASE_URL = "https://agent-gateway-zeta.vercel.app";

const server = new Server(
  {
    name: "agent-gateway",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_apis",
        description:
          "List all APIs in the Agent Gateway registry. Optionally filter by category.",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description:
                "Filter by category: research, market-data, image-gen, code, translation, summarization, embeddings, web-scraping, audio, video, other",
            },
            minQuality: {
              type: "number",
              description: "Minimum quality score (0-5)",
            },
            maxPrice: {
              type: "number",
              description: "Maximum price per request",
            },
          },
        },
      },
      {
        name: "get_api",
        description: "Get detailed information about a specific API by its ID",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The API identifier",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "route_to_provider",
        description:
          "Find the best API provider for a given capability based on quality, latency, and price preferences",
        inputSchema: {
          type: "object",
          properties: {
            capability: {
              type: "string",
              description:
                "The capability you need (e.g., research, market-data, summarization)",
            },
            max_latency_ms: {
              type: "number",
              description: "Maximum acceptable latency in milliseconds",
            },
            max_price: {
              type: "number",
              description: "Maximum price per request",
            },
            min_quality_score: {
              type: "number",
              description: "Minimum quality score (0-5)",
            },
          },
          required: ["capability"],
        },
      },
      {
        name: "list_capabilities",
        description:
          "List all available capabilities and how many providers offer each",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "register_api",
        description:
          "Register a new API in the marketplace (will be pending review)",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "API display name (3-100 characters)",
            },
            description: {
              type: "string",
              description: "What the API does",
            },
            endpoint: {
              type: "string",
              description: "Full HTTPS URL of the API endpoint",
            },
            category: {
              type: "string",
              description: "Category: research, market-data, image-gen, code, translation, summarization, embeddings, web-scraping, audio, video, other",
            },
            capabilities: {
              type: "array",
              items: { type: "string" },
              description: "List of capability tags",
            },
            pricing_model: {
              type: "string",
              description: "Pricing model: free, per_request, subscription, x402",
            },
            price: {
              type: "number",
              description: "Price per request or subscription price",
            },
            currency: {
              type: "string",
              description: "Currency: USD, USDC, ETH",
            },
            free_quota: {
              type: "number",
              description: "Free requests per day",
            },
            a2a_card: {
              type: "string",
              description: "URL to A2A agent card",
            },
            provider_wallet: {
              type: "string",
              description: "Wallet address for payments",
            },
          },
          required: ["name", "endpoint", "category", "pricing_model", "price"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_apis": {
        const params = new URLSearchParams();
        if (args?.category) params.set("category", String(args.category));
        if (args?.minQuality) params.set("minQuality", String(args.minQuality));
        if (args?.maxPrice) params.set("maxPrice", String(args.maxPrice));

        const url = `${BASE_URL}/api/v1/registry${params.toString() ? "?" + params : ""}`;
        const response = await fetch(url);
        const data = await response.json();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "get_api": {
        const response = await fetch(`${BASE_URL}/api/v1/registry/${args?.id}`);
        const data = await response.json();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "route_to_provider": {
        const body = {
          capability: args?.capability,
          preferences: {
            max_latency_ms: args?.max_latency_ms,
            max_price: args?.max_price,
            min_quality_score: args?.min_quality_score,
          },
        };

        const response = await fetch(`${BASE_URL}/api/v1/route`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "list_capabilities": {
        const response = await fetch(`${BASE_URL}/api/v1/capabilities`);
        const data = await response.json();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "register_api": {
        const body = {
          name: args?.name,
          description: args?.description,
          endpoint: args?.endpoint,
          category: args?.category,
          capabilities: args?.capabilities || [],
          pricing: {
            model: args?.pricing_model,
            price: args?.price,
            currency: args?.currency || "USD",
            freeQuota: args?.free_quota,
          },
          a2aCard: args?.a2a_card,
          providerWallet: args?.provider_wallet,
        };

        const response = await fetch(`${BASE_URL}/api/registry/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
      isError: true,
    };
  }
});

// List resources (the registry itself as a resource)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "agent-gateway://registry",
        name: "API Registry",
        description: "All registered APIs in the Agent Gateway",
        mimeType: "application/json",
      },
      {
        uri: "agent-gateway://capabilities",
        name: "Capabilities",
        description: "All available capabilities",
        mimeType: "application/json",
      },
    ],
  };
});

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === "agent-gateway://registry") {
    const response = await fetch(`${BASE_URL}/api/v1/registry`);
    const data = await response.json();
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  if (uri === "agent-gateway://capabilities") {
    const response = await fetch(`${BASE_URL}/api/v1/capabilities`);
    const data = await response.json();
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Agent Gateway MCP server running");
}

main().catch(console.error);
