"""FlowTomate Integration."""
import logging
from homeassistant.core import HomeAssistant
from homeassistant.components import frontend

_LOGGER = logging.getLogger(__name__)

DOMAIN = "flowtomate"

async def async_setup(hass: HomeAssistant, config: dict):
    """Set up the FlowTomate component."""
    
    # Register the panel
    await hass.components.frontend.async_register_built_in_panel(
        component_name="custom",
        sidebar_title="FlowTomate",
        sidebar_icon="mdi:graph",
        frontend_url_path="flowtomate",
        config={
            "_panel_custom": {
                "name": "flowtomate-panel",
                "module_url": "/local/flowtomate/flowtomate-panel.js",
            }
        },
        require_admin=True,
    )
    
    # Register static path for our JS files
    hass.http.register_static_path(
        "/local/flowtomate",
        hass.config.path("www/flowtomate"),
        cache_headers=False
    )
    
    _LOGGER.info("FlowTomate integration loaded")
    
    return True
