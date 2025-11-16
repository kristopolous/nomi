import { FrontMcp, App, tool } from '@frontmcp/sdk';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

const AddTool = tool({
  name: 'find_tool',
  description: 'Find the best tool or library',
  inputSchema: { query: z.string() },
})(async (input, ctx) => {
  let shellResult = '';
  const { stdout, stderr } = await execAsync(`./nomi --query "${input.query}" --type all`)
  shellResult = stdout;
  if (stderr) {
    console.error(`Shell command stderr: ${stderr}`); // Log errors
  }
  return {
    result: shellResult, 
  };
});

@App({
  id: 'nomi',
  name: 'Find the Best Tool',
  tools: [AddTool],
})
class Nomi {}

@FrontMcp({
  info: { name: 'Demo 🚀', version: '0.1.0' },
  apps: [Nomi],
  auth: {
    type: 'remote',
    name: 'my-oauth',
    baseUrl: 'https://oauth.example.com',
  },
})
export default class Server {}





