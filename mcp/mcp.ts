import { FrontMcp, App, tool } from '@frontmcp/sdk';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

const key = {"keys": {
  "kty": "RSA",
  "d": "CeYsDh3cLgE0jvV7dLOruCnGtpS4JZca37m4sW9t39jG7QRg25Jdg0G6r7tg3Ptofs9WDusPKAnvwNlPY6k6fMFtLrXwoph6EYDB2dpkS6O_3PztdUWRS8mn_1FpzSoT-aykXCFMzY9HPZm61C4w0EFf4zw_QrW6N9_WrXAfbYmZfCzx-OP8DQOxl9pJm4HqCeaK2xTgW1Dp07vhzEuVkOBv7Pl91HyRxrPcn7cfRQu6L999Zeg_28s0zVAc3yl45_OMv2zWg3OdMEn5iXV6V8-aLbxJhzRQJ7yv2JttHdro16eqc9ckI9XJIvCWhOlYjawwgqFJMcA93nQWIZUdeQ",
  "e": "AQAB",
  "n": "rzKr4osdyXsG2wQ-7INhz9k1MCWFPa8ldVwu88WamcwQt0sANDX_soS7UESfB_gVK3kctTTA9RVZB1UejgrLht9vGz82KxPjGdf_EwdE7YtoPA_udDbuU5QjL95XJc63vR8ucRQLQk3mNHhSQyEu-ORs_vjp39ot4HquKl1jvFO3lUEicB0_gaCWvlU6yaKpwjL_yt9Fe-vwtsEoB-o_77pWopFsIxBAM5ccz25f4uIXFdCq0sLk6xEeCX2fz66mLHbMKJpDboiPaXyGt3IVbcy4jdyVIUsdZVNz3_65DwsYB_o5jMKykS_qg7iBMBCRa5PquJyIUfyrwtiatyyLjw"
}}

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
  info: { name: 'Nomi', version: '0.1.0' },
  apps: [Nomi],
  auth: {
    type: 'local',
    id: '123',
    jwks: key,
    name: 'my-oauth'
  },
})
export default class Server {}





