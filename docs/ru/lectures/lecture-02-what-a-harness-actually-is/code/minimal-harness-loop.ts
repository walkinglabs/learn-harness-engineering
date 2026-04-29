type Message = {
  role: "user" | "assistant";
  content: string;
};

type ToolResult = {
  ok: boolean;
  output: string;
};

function runTool(name: string, input: string): ToolResult {
  if (name === "read_file") {
    return { ok: true, output: `contents of ${input}` };
  }

  return { ok: false, output: `unknown tool: ${name}` };
}

export function minimalHarness(messages: Message[]) {
  const nextAction = {
    tool: "read_file",
    input: "README.md"
  };

  const result = runTool(nextAction.tool, nextAction.input);

  return {
    messages: [
      ...messages,
      {
        role: "assistant",
        content: `Tool ${nextAction.tool} returned: ${result.output}`
      }
    ]
  };
}
