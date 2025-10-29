import SwaggerParser from '@apidevtools/swagger-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Parameter {
  name: string;
  in: string;
  required?: boolean;
  schema: any;
  description?: string;
}

interface Operation {
  operationId?: string;
  summary?: string;
  description?: string;
  parameters?: Parameter[];
  requestBody?: any;
  responses?: any;
  tags?: string[];
}

interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

// Helper to convert OpenAPI parameter to JSON Schema property
function parameterToProperty(param: Parameter): any {
  return {
    ...param.schema,
    description: param.description || param.schema.description,
  };
}

// Helper to generate operationId from method and path
function generateOperationId(method: string, path: string): string {
  // Remove leading slash and replace path parameters
  const cleanPath = path
    .replace(/^\//, '')
    .replace(/\{([^}]+)\}/g, 'By_$1')
    .replace(/\//g, '_')
    .replace(/-/g, '_');

  // Convert to camelCase
  const parts = cleanPath.split('_').filter(p => p.length > 0);
  const camelCase = parts
    .map((part, index) => {
      if (index === 0) return part.toLowerCase();
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');

  // Prefix with method
  const methodPrefix = method.toLowerCase();
  return `${methodPrefix}_${camelCase}`;
}

// Helper to build input schema from parameters and request body
function buildInputSchema(operation: Operation): any {
  const properties: Record<string, any> = {};
  const required: string[] = [];

  // Add path and query parameters
  if (operation.parameters) {
    for (const param of operation.parameters) {
      properties[param.name] = parameterToProperty(param);
      if (param.required) {
        required.push(param.name);
      }
    }
  }

  // Add request body properties
  if (operation.requestBody?.content?.['application/json']?.schema) {
    const bodySchema = operation.requestBody.content['application/json'].schema;

    if (bodySchema.properties) {
      // Flatten request body properties into the input schema
      Object.entries(bodySchema.properties).forEach(([key, value]) => {
        properties[key] = value;
      });

      // Add required fields from request body
      if (bodySchema.required) {
        required.push(...bodySchema.required);
      }
    }
  }

  // Add multipart/form-data for file uploads
  if (operation.requestBody?.content?.['multipart/form-data']?.schema) {
    const formSchema = operation.requestBody.content['multipart/form-data'].schema;

    if (formSchema.properties) {
      Object.entries(formSchema.properties).forEach(([key, value]) => {
        properties[key] = value;
      });

      if (formSchema.required) {
        required.push(...formSchema.required);
      }
    }
  }

  return {
    type: 'object',
    properties,
    ...(required.length > 0 && { required }),
  };
}

async function generateManifest() {
  console.log('Parsing OpenAPI specification...');

  const openapiPath = path.resolve(__dirname, '../../../openapi.yml');
  const doc = await SwaggerParser.parse(openapiPath) as any;

  console.log('Generating MCP tools from operations...');

  const tools: MCPTool[] = [];

  // Iterate through all paths
  for (const [pathPattern, pathItem] of Object.entries(doc.paths)) {
    // Iterate through HTTP methods
    for (const [method, operation] of Object.entries(pathItem as Record<string, Operation>)) {
      if (typeof operation !== 'object' || !operation) continue;

      const op = operation as Operation;

      // Generate operationId if not present
      const operationId = op.operationId || generateOperationId(method, pathPattern);

      const tool: MCPTool = {
        name: operationId,
        description: op.description || op.summary || `${method.toUpperCase()} ${pathPattern}`,
        inputSchema: buildInputSchema(op),
      };

      tools.push(tool);
      console.log(`✓ Added tool: ${tool.name}`);
    }
  }

  console.log(`\nGenerated ${tools.length} tools`);

  // Create manifest
  const manifest = {
    tools,
  };

  // Save manifest
  const outputPath = path.resolve(__dirname, '../manifest.json');
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));

  console.log(`\n✓ Manifest saved to: ${outputPath}`);

  // Print summary by tags
  console.log('\n=== Tool Summary ===');
  const toolsByPrefix: Record<string, number> = {};

  tools.forEach(tool => {
    const prefix = tool.name.split(/(?=[A-Z])/)[0];
    toolsByPrefix[prefix] = (toolsByPrefix[prefix] || 0) + 1;
  });

  Object.entries(toolsByPrefix).forEach(([prefix, count]) => {
    console.log(`${prefix}: ${count} tools`);
  });
}

generateManifest().catch(console.error);
