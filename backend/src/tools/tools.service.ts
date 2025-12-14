import { Injectable } from '@nestjs/common';
import { toolDefinition } from '@tanstack/ai';
import { z } from 'zod';

@Injectable()
export class ToolsService {
  // Get Weather Tool Definition
  private getWeatherDef = toolDefinition({
    name: 'getWeather',
    description: 'Get the current weather for a location',
    inputSchema: z.object({
      location: z.string().describe('The city and state, e.g. San Francisco, CA'),
      unit: z.enum(['celsius', 'fahrenheit']).optional().default('fahrenheit'),
    }),
  });

  // Search Products Tool Definition
  private searchProductsDef = toolDefinition({
    name: 'searchProducts',
    description: 'Search for products in the catalog',
    inputSchema: z.object({
      query: z.string().describe('The search query'),
      category: z.string().optional().describe('Filter by category'),
      maxResults: z.number().optional().default(5).describe('Maximum number of results'),
    }),
  });

  // Get Current Time Tool Definition
  private getCurrentTimeDef = toolDefinition({
    name: 'getCurrentTime',
    description: 'Get the current date and time',
    inputSchema: z.object({
      timezone: z.string().optional().default('UTC').describe('Timezone (e.g., America/New_York)'),
    }),
  });

  // Get all tools with server implementations
  getTools() {
    return [
      this.getWeatherDef.server(async ({ location, unit }) => {
        // Simulate weather API call
        const temp = unit === 'celsius' ? 22 : 72;
        const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)];
        
        return {
          location,
          temperature: temp,
          unit,
          conditions,
          humidity: Math.floor(Math.random() * 40) + 40,
          windSpeed: Math.floor(Math.random() * 20) + 5,
        };
      }),

      this.searchProductsDef.server(async ({ query, category, maxResults }) => {
        // Simulate product search
        const mockProducts = [
          { id: 1, name: `${query} Product 1`, price: 29.99, category: category || 'Electronics' },
          { id: 2, name: `${query} Product 2`, price: 49.99, category: category || 'Electronics' },
          { id: 3, name: `${query} Product 3`, price: 19.99, category: category || 'Home' },
          { id: 4, name: `${query} Product 4`, price: 99.99, category: category || 'Electronics' },
          { id: 5, name: `${query} Product 5`, price: 39.99, category: category || 'Fashion' },
        ];

        return {
          query,
          category,
          results: mockProducts.slice(0, maxResults),
          totalFound: mockProducts.length,
        };
      }),

      this.getCurrentTimeDef.server(async ({ timezone }) => {
        const now = new Date();
        
        return {
          timezone,
          datetime: now.toISOString(),
          formatted: now.toLocaleString('en-US', { timeZone: timezone }),
          timestamp: now.getTime(),
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          day: now.getDate(),
          hour: now.getHours(),
          minute: now.getMinutes(),
          second: now.getSeconds(),
        };
      }),
    ];
  }
}

