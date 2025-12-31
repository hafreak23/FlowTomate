"""FlowTomate - Visual Flow Editor for Home Assistant Automations."""
import logging
import os
from homeassistant.core import HomeAssistant
from homeassistant.components import frontend

_LOGGER = logging.getLogger(__name__)

DOMAIN = "flowtomate"

async def async_setup(hass: HomeAssistant, config: dict):
    """Set up the FlowTomate component."""
    
    # Get the path to this integration's directory
    integration_dir = os.path.dirname(__file__)
    
    # Register the panel
    await hass.components.frontend.async_register_built_in_panel(
        component_name="custom",
        sidebar_title="FlowTomate",
        sidebar_icon="mdi:graph",
        frontend_url_path="flowtomate",
        config={
            "_panel_custom": {
                "name": "flowtomate-panel",
                "module_url": "/flowtomate_static/flowtomate-panel.js",
            }
        },
        require_admin=True,
    )
    
    # Register static path - serve from custom_components/flowtomate/www/
    www_dir = os.path.join(integration_dir, "www")
    hass.http.register_static_path(
        "/flowtomate_static",
        www_dir,
        cache_headers=False
    )
    
    _LOGGER.info("FlowTomate integration loaded successfully from %s", www_dir)
    
    return True
