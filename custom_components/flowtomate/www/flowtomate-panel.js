// FlowTomate Panel - Visual Flow Editor for Home Assistant
// Version: 1.0.0

class FlowTomatePanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass = null;
    this._initialized = false;
    this._selectedAutomation = null;
  }

  set hass(hass) {
    this._hass = hass;
    
    if (!this._initialized) {
      this._initialized = true;
      this._initialize();
    } else {
      this._updateAutomationList();
    }
  }

  _initialize() {
    this.shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :host {
          display: block;
          height: 100vh;
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .flowtomate-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #0d1117;
          color: #e6edf3;
        }

        .flowtomate-header {
          background: #161b22;
          padding: 16px 24px;
          border-bottom: 1px solid #30363d;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .flowtomate-header h1 {
          font-size: 20px;
          font-weight: 600;
          color: #e6edf3;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .automation-select {
          background: #21262d;
          color: #e6edf3;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 14px;
          min-width: 300px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .automation-select:hover {
          background: #30363d;
          border-color: #484f58;
        }

        .automation-select:focus {
          outline: 2px solid #1f6feb;
          outline-offset: 2px;
        }

        .btn {
          background: #238636;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn:hover {
          background: #2ea043;
        }

        .btn-secondary {
          background: #21262d;
          border: 1px solid #30363d;
        }

        .btn-secondary:hover {
          background: #30363d;
        }

        .flowtomate-content {
          flex: 1;
          overflow: auto;
          padding: 24px;
          background: #0d1117;
        }

        .empty-state {
          text-align: center;
          padding: 64px 24px;
          color: #7d8590;
        }

        .empty-state h2 {
          font-size: 24px;
          color: #e6edf3;
          margin-bottom: 12px;
        }

        .empty-state p {
          font-size: 16px;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        .automation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .automation-card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;
          cursor: pointer;
        }

        .automation-card:hover {
          border-color: #484f58;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .automation-card h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #e6edf3;
        }

        .automation-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .automation-state {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          gap: 4px;
        }

        .state-on {
          background: #238636;
          color: white;
        }

        .state-off {
          background: #da3633;
          color: white;
        }

        .automation-id {
          font-size: 12px;
          color: #7d8590;
          font-family: 'Consolas', 'Monaco', monospace;
        }

        .info-box {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 20px;
        }

        .info-box h3 {
          font-size: 18px;
          margin-bottom: 12px;
          color: #e6edf3;
        }

        .info-box p {
          color: #7d8590;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .info-box ul {
          list-style: none;
          padding-left: 0;
        }

        .info-box li {
          color: #7d8590;
          padding: 6px 0;
          padding-left: 24px;
          position: relative;
        }

        .info-box li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: #58a6ff;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }

        .status-on {
          background: #3fb950;
        }

        .status-off {
          background: #f85149;
        }

        @media (max-width: 768px) {
          .flowtomate-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-left,
          .header-right {
            width: 100%;
          }

          .automation-select {
            width: 100%;
            min-width: unset;
          }

          .automation-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <div class="flowtomate-container">
        <div class="flowtomate-header">
          <div class="header-left">
            <h1>🔀 FlowTomate</h1>
          </div>
          <div class="header-right">
            <select class="automation-select" id="automation-selector">
              <option value="">Select an automation to edit...</option>
            </select>
            <button class="btn btn-secondary" id="refresh-btn">
              ↻ Refresh
            </button>
            <button class="btn" id="new-btn">
              + New Automation
            </button>
          </div>
        </div>

        <div class="flowtomate-content" id="content">
          <!-- Content will be injected here -->
        </div>
      </div>
    `;

    this._attachEventListeners();
    this._renderContent();
  }

  _attachEventListeners() {
    const selector = this.shadowRoot.querySelector('#automation-selector');
    const refreshBtn = this.shadowRoot.querySelector('#refresh-btn');
    const newBtn = this.shadowRoot.querySelector('#new-btn');

    if (selector) {
      selector.addEventListener('change', (e) => {
        this._selectedAutomation = e.target.value;
        this._renderContent();
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this._updateAutomationList();
        this._renderContent();
      });
    }

    if (newBtn) {
      newBtn.addEventListener('click', () => {
        alert('Create new automation - Coming soon!');
      });
    }
  }

  _getAutomations() {
    if (!this._hass) return [];
    
    const automations = [];
    for (let entityId in this._hass.states) {
      if (entityId.startsWith('automation.')) {
        const entity = this._hass.states[entityId];
        automations.push({
          id: entity.attributes.id || entityId.replace('automation.', ''),
          entityId: entityId,
          name: entity.attributes.friendly_name || entityId,
          state: entity.state,
          lastTriggered: entity.attributes.last_triggered
        });
      }
    }
    return automations.sort((a, b) => a.name.localeCompare(b.name));
  }

  _updateAutomationList() {
    const selector = this.shadowRoot.querySelector('#automation-selector');
    if (!selector) return;

    const automations = this._getAutomations();
    const currentValue = selector.value;

    selector.innerHTML = '<option value="">Select an automation to edit...</option>';
    
    automations.forEach(auto => {
      const option = document.createElement('option');
      option.value = auto.entityId;
      option.textContent = `${auto.name} (${auto.state})`;
      selector.appendChild(option);
    });

    // Restore selection if it still exists
    if (currentValue && automations.find(a => a.entityId === currentValue)) {
      selector.value = currentValue;
    }
  }

  _renderContent() {
    const content = this.shadowRoot.querySelector('#content');
    if (!content) return;

    const automations = this._getAutomations();

    if (this._selectedAutomation) {
      // Show flow editor for selected automation
      content.innerHTML = this._renderFlowEditor(this._selectedAutomation);
    } else if (automations.length === 0) {
      // No automations
      content.innerHTML = `
        <div class="empty-state">
          <h2>No Automations Found</h2>
          <p>Create your first automation in Home Assistant, then come back here to edit it visually!</p>
        </div>
      `;
    } else {
      // Show automation list
      content.innerHTML = `
        <div class="automation-grid">
          ${automations.map(auto => `
            <div class="automation-card" data-entity="${auto.entityId}">
              <h3>${auto.name}</h3>
              <div class="automation-meta">
                <span class="automation-state state-${auto.state}">
                  <span class="status-indicator status-${auto.state}"></span>
                  ${auto.state.toUpperCase()}
                </span>
              </div>
              <div class="automation-id">${auto.entityId}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="info-box">
          <h3>🚀 Getting Started with FlowTomate</h3>
          <p>FlowTomate is a visual automation editor for Home Assistant. Here's what you can do:</p>
          <ul>
            <li>Select an automation from the dropdown above to edit it visually</li>
            <li>Drag and drop nodes to create your automation flow</li>
            <li>Connect triggers, conditions, and actions with visual wires</li>
            <li>Export your flow as Home Assistant YAML</li>
          </ul>
          <p style="margin-top: 16px;"><strong>Note:</strong> The visual flow editor is currently in development. For now, you can browse your automations and the editor interface will be integrated soon.</p>
        </div>
      `;

      // Add click handlers to cards
      const cards = content.querySelectorAll('.automation-card');
      cards.forEach(card => {
        card.addEventListener('click', () => {
          const entityId = card.getAttribute('data-entity');
          this._selectedAutomation = entityId;
          const selector = this.shadowRoot.querySelector('#automation-selector');
          if (selector) selector.value = entityId;
          this._renderContent();
        });
      });
    }
  }

  _renderFlowEditor(entityId) {
    const automation = this._hass.states[entityId];
    
    return `
      <div class="info-box" style="margin-bottom: 16px;">
        <h3>Editing: ${automation.attributes.friendly_name || entityId}</h3>
        <p><strong>Entity ID:</strong> ${entityId}</p>
        <p><strong>State:</strong> <span class="automation-state state-${automation.state}">${automation.state}</span></p>
        <button class="btn btn-secondary" onclick="this.getRootNode().host._selectedAutomation = null; this.getRootNode().host._renderContent();">
          ← Back to List
        </button>
      </div>

      <div class="info-box">
        <h3>Visual Flow Editor</h3>
        <p>The visual flow editor component will be integrated here.</p>
        <p>This is where you'll be able to:</p>
        <ul>
          <li>View the automation as a visual flow diagram</li>
          <li>Add new triggers, conditions, and actions by dragging nodes</li>
          <li>Connect nodes with wires to define the flow</li>
          <li>Edit node properties in the sidebar</li>
          <li>Export the complete flow as YAML</li>
        </ul>
        <p style="margin-top: 16px;"><strong>Next step:</strong> Integrate the React flow editor component from the previous development work.</p>
      </div>
    `;
  }
}

customElements.define('flowtomate-panel', FlowTomatePanel);
