// Nimicode Interactive Terminal Simulator

const SCENARIOS = [
  {
    tabName: "Refactor to async/await",
    command: "nimicode agent -p \"refactor src/tools/fs.ts to use async/await\"",
    events: [
      {
        type: "think",
        header: "Thinking",
        message: "Analyzing src/tools/fs.ts file structure and sync call dependencies..."
      },
      {
        type: "tool-start",
        header: "Tool Call: read_file",
        message: "Reading file src/tools/fs.ts"
      },
      {
        type: "tool-success",
        header: "Tool Success: read_file",
        html: `
          <div class="terminal-file-card">
            <div class="file-card-header">
              <span>src/tools/fs.ts</span>
              <span>1.2 KB</span>
            </div>
            <div class="file-card-body">
              <span class="diff-line">import * as fs from 'fs';</span>
              <span class="diff-line"></span>
              <span class="diff-line">export function readConfig(path: string) {</span>
              <span class="diff-line">  return fs.readFileSync(path, 'utf8');</span>
              <span class="diff-line">}</span>
            </div>
          </div>
        `
      },
      {
        type: "think",
        header: "Thinking",
        message: "Replacing fs.readFileSync with promises.readFile. Adjusting exporting function to async..."
      },
      {
        type: "tool-start",
        header: "Tool Call: write_file",
        message: "Writing refactored contents to src/tools/fs.ts"
      },
      {
        type: "tool-success",
        header: "Tool Success: write_file",
        html: `
          <div class="terminal-file-card">
            <div class="file-card-header">
              <span>src/tools/fs.ts (diff)</span>
              <span>+6 lines</span>
            </div>
            <div class="file-card-body">
              <span class="diff-line deletion">-export function readConfig(path: string) {</span>
              <span class="diff-line deletion">-  return fs.readFileSync(path, 'utf8');</span>
              <span class="diff-line deletion">-}</span>
              <span class="diff-line addition">+export async function readConfig(path: string): Promise&lt;string&gt; {</span>
              <span class="diff-line addition">+  return await fs.promises.readFile(path, 'utf8');</span>
              <span class="diff-line addition">+}</span>
            </div>
          </div>
        `
      },
      {
        type: "summary",
        header: "Nimicode Summary",
        message: "Refactored src/tools/fs.ts to use async/await promises API. Modified signature of readConfig to return Promise<string>."
      }
    ]
  },
  {
    tabName: "Fix Failing Test",
    command: "nimicode agent -p \"fix failing test in test/db.test.ts\"",
    events: [
      {
        type: "think",
        header: "Thinking",
        message: "Running test runner command to locate failing assertion..."
      },
      {
        type: "tool-start",
        header: "Tool Call: execute_command",
        message: "Running: bun test test/db.test.ts"
      },
      {
        type: "tool-success",
        header: "Tool Success: execute_command",
        html: `
          <div class="terminal-file-card">
            <div class="file-card-header">
              <span>stdout (bun test)</span>
              <span>1 failed</span>
            </div>
            <div class="file-card-body" style="color: #FF5F56;">
              FAIL: test/db.test.ts &gt; should resolve mock db connection
              TypeError: Cannot read properties of undefined (reading 'connect')
                 at test/db.test.ts:18:22
            </div>
          </div>
        `
      },
      {
        type: "think",
        header: "Thinking",
        message: "Examining test/db.test.ts around line 18 where client setup fails..."
      },
      {
        type: "tool-start",
        header: "Tool Call: read_file",
        message: "Reading test/db.test.ts"
      },
      {
        type: "tool-success",
        header: "Tool Success: read_file",
        html: `
          <div class="terminal-file-card">
            <div class="file-card-header">
              <span>test/db.test.ts</span>
              <span>800 B</span>
            </div>
            <div class="file-card-body">
              <span class="diff-line">17: const db = new DatabaseClient();</span>
              <span class="diff-line">18: await db.client.connect(); // db.client is undefined here</span>
            </div>
          </div>
        `
      },
      {
        type: "think",
        header: "Thinking",
        message: "DatabaseClient does not initialize the client object implicitly. Initializing in test setup..."
      },
      {
        type: "tool-start",
        header: "Tool Call: write_file",
        message: "Updating test/db.test.ts setup mock"
      },
      {
        type: "tool-success",
        header: "Tool Success: write_file",
        html: `
          <div class="terminal-file-card">
            <div class="file-card-header">
              <span>test/db.test.ts (diff)</span>
              <span>+3 lines</span>
            </div>
            <div class="file-card-body">
              <span class="diff-line addition">+const db = new DatabaseClient({ autoInit: true });</span>
              <span class="diff-line deletion">-const db = new DatabaseClient();</span>
            </div>
          </div>
        `
      },
      {
        type: "think",
        header: "Thinking",
        message: "Re-verifying test suite correctness..."
      },
      {
        type: "tool-start",
        header: "Tool Call: execute_command",
        message: "Running: bun test test/db.test.ts"
      },
      {
        type: "tool-success",
        header: "Tool Success: execute_command",
        html: `
          <div class="terminal-file-card">
            <div class="file-card-header">
              <span>stdout (bun test)</span>
              <span>1 passed</span>
            </div>
            <div class="file-card-body" style="color: var(--color-primary);">
              PASS: test/db.test.ts
              ✓ should resolve mock db connection (4ms)
            </div>
          </div>
        `
      },
      {
        type: "summary",
        header: "Nimicode Summary",
        message: "Resolved TypeError in test/db.test.ts by initializing DatabaseClient client config with { autoInit: true }. Verified all tests now pass successfully."
      }
    ]
  },
  {
    tabName: "Add Docs README",
    command: "nimicode agent -p \"generate a readme explaining the providers system\"",
    events: [
      {
        type: "think",
        header: "Thinking",
        message: "Analyzing providers directory to read implementation details..."
      },
      {
        type: "tool-start",
        header: "Tool Call: read_file",
        message: "Reading src/providers/index.ts"
      },
      {
        type: "tool-success",
        header: "Tool Success: read_file",
        html: `
          <div class="terminal-file-card">
            <div class="file-card-header">
              <span>src/providers/index.ts</span>
              <span>540 B</span>
            </div>
            <div class="file-card-body">
              <span class="diff-line">export interface PluggableProvider {</span>
              <span class="diff-line">  id: string;</span>
              <span class="diff-line">  name: string;</span>
              <span class="diff-line">  chat(messages: Message[]): Promise&lt;Response&gt;;</span>
              <span class="diff-line">}</span>
            </div>
          </div>
        `
      },
      {
        type: "think",
        header: "Thinking",
        message: "Found PluggableProvider interface. Generating comprehensive documentation for providers..."
      },
      {
        type: "tool-start",
        header: "Tool Call: write_file",
        message: "Writing new file PROVIDERS.md"
      },
      {
        type: "tool-success",
        header: "Tool Success: write_file",
        html: `
          <div class="terminal-file-card">
            <div class="file-card-header">
              <span>PROVIDERS.md [NEW]</span>
              <span>1.5 KB</span>
            </div>
            <div class="file-card-body">
              <span class="diff-line addition"># Nimicode Pluggable Providers</span>
              <span class="diff-line addition"></span>
              <span class="diff-line addition">Configure providers with the CLI:</span>
              <span class="diff-line addition">&#96;nimicode providers set deepseek&#96;</span>
            </div>
          </div>
        `
      },
      {
        type: "summary",
        header: "Nimicode Summary",
        message: "Generated PROVIDERS.md file documenting the pluggable providers system, including the interface contracts and configuration command commands."
      }
    ]
  }
];

class TerminalSimulator {
  constructor(containerId, tabsContainerId) {
    this.container = document.getElementById(containerId);
    this.tabsContainer = document.getElementById(tabsContainerId);
    this.activeScenarioIndex = 0;
    this.animationTimer = null;
    this.loopTimer = null;
    this.isUserInterrupted = false;
    this.isTypingPrompt = false;

    this.init();
  }

  init() {
    if (!this.container || !this.tabsContainer) return;
    
    // Render tabs
    this.tabsContainer.innerHTML = "";
    SCENARIOS.forEach((scenario, index) => {
      const tabButton = document.createElement("button");
      tabButton.className = `terminal-tab ${index === 0 ? "active" : ""}`;
      tabButton.innerText = scenario.tabName;
      tabButton.setAttribute("role", "tab");
      tabButton.setAttribute("aria-selected", index === 0 ? "true" : "false");
      tabButton.addEventListener("click", () => this.handleTabClick(index));
      this.tabsContainer.appendChild(tabButton);
    });

    // Start initial simulation
    this.startSimulation(0);
  }

  handleTabClick(index) {
    this.isUserInterrupted = true; // Stop auto loop
    this.startSimulation(index);
  }

  stopAllTimers() {
    if (this.animationTimer) clearTimeout(this.animationTimer);
    if (this.loopTimer) clearTimeout(this.loopTimer);
  }

  updateTabsUI() {
    const tabs = this.tabsContainer.querySelectorAll(".terminal-tab");
    tabs.forEach((tab, index) => {
      if (index === this.activeScenarioIndex) {
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
      } else {
        tab.classList.remove("active");
        tab.setAttribute("aria-selected", "false");
      }
    });
  }

  startSimulation(index) {
    this.stopAllTimers();
    this.activeScenarioIndex = index;
    this.updateTabsUI();
    this.container.innerHTML = "";

    const scenario = SCENARIOS[index];
    
    // Create prompt line structure
    const promptLine = document.createElement("div");
    promptLine.className = "terminal-prompt-line";
    promptLine.innerHTML = `
      <span class="terminal-prompt-symbol">$</span>
      <span class="terminal-prompt-cmd font-mono"></span>
      <span class="cursor"></span>
    `;
    this.container.appendChild(promptLine);
    
    const cmdTextContainer = promptLine.querySelector(".terminal-prompt-cmd");
    const cursor = promptLine.querySelector(".cursor");

    // Phase 1: Typewriter prompt
    let charIndex = 0;
    this.isTypingPrompt = true;
    
    const typeCharacter = () => {
      if (charIndex < scenario.command.length) {
        cmdTextContainer.textContent += scenario.command[charIndex];
        charIndex++;
        this.animationTimer = setTimeout(typeCharacter, 30 + Math.random() * 20);
      } else {
        this.isTypingPrompt = false;
        // Wait briefly after typing command, then begin event loop
        this.animationTimer = setTimeout(() => {
          cursor.style.display = "none"; // Hide cursor when process running
          this.runEventSequence(scenario.events, 0);
        }, 600);
      }
    };

    typeCharacter();
  }

  runEventSequence(events, eventIndex) {
    if (eventIndex >= events.length) {
      // Finished scenario
      // Trigger auto-loop if user hasn't selected anything manually
      if (!this.isUserInterrupted) {
        this.loopTimer = setTimeout(() => {
          const nextIndex = (this.activeScenarioIndex + 1) % SCENARIOS.length;
          this.startSimulation(nextIndex);
        }, 5000); // Wait 5 seconds before cross-fading to next scenario
      }
      return;
    }

    const event = events[eventIndex];
    
    // Create event element
    const eventElement = document.createElement("div");
    eventElement.className = `agent-event ${event.type}`;
    
    const header = document.createElement("div");
    header.className = `event-header ${event.type}`;
    
    // Add spinner for think and tool-start states
    const statusIcon = (event.type === 'think' || event.type === 'tool-start') 
      ? '<span class="spinner"></span> ' 
      : '✓ ';
    
    header.innerHTML = `${statusIcon}${event.header}`;
    eventElement.appendChild(header);

    const content = document.createElement("div");
    content.className = "event-content";
    
    if (event.html) {
      content.innerHTML = event.html;
      eventElement.appendChild(content);
      this.container.appendChild(eventElement);
      this.scrollTerminal();
      
      // Delay before moving to the next event
      this.animationTimer = setTimeout(() => {
        this.runEventSequence(events, eventIndex + 1);
      }, 1000);
    } else {
      eventElement.appendChild(content);
      this.container.appendChild(eventElement);
      
      // Stream content for text-based messages
      let messageIndex = 0;
      const streamText = () => {
        if (messageIndex < event.message.length) {
          content.textContent += event.message[messageIndex];
          messageIndex++;
          this.scrollTerminal();
          this.animationTimer = setTimeout(streamText, 8 + Math.random() * 8);
        } else {
          // Finished text streaming, wait briefly and go to next
          this.animationTimer = setTimeout(() => {
            // Replace spinner with solid mark on success/done
            if (event.type === 'think' || event.type === 'tool-start') {
              header.innerHTML = `✓ ${event.header}`;
            }
            this.runEventSequence(events, eventIndex + 1);
          }, 800);
        }
      };
      
      streamText();
    }
  }

  scrollTerminal() {
    this.container.scrollTop = this.container.scrollHeight;
  }
}

// Initialise on load
document.addEventListener("DOMContentLoaded", () => {
  new TerminalSimulator("terminal-body", "terminal-tabs");
});
