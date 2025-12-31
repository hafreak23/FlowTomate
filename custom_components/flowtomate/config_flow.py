"""Config flow for FlowTomate integration."""
import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResult

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


class FlowTomateConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for FlowTomate."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        # Check if already configured
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is None:
            return self.async_show_form(
                step_id="user",
                data_schema=vol.Schema({}),
                description_placeholders={
                    "docs_url": "https://github.com/hafreak23/FlowTomate"
                },
            )

        # Create the entry
        return self.async_create_entry(
            title="FlowTomate",
            data={},
        )

    async def async_step_import(self, import_config):
        """Handle import from configuration.yaml."""
        return await self.async_step_user(None)
EOF

# Create translations/en.json
echo "Creating translations/en.json..."
cat > translations/en.json << 'EOF'
{
  "config": {
    "step": {
      "user": {
        "title": "Set up FlowTomate",
        "description": "FlowTomate provides a visual flow editor for your Home Assistant automations.\n\nClick Submit to add FlowTomate to your Home Assistant.",
        "data": {}
      }
    },
    "abort": {
      "single_instance_allowed": "FlowTomate is already configured. Only one instance is allowed."
    }
  }
}
