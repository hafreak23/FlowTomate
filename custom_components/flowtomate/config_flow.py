"""FlowTomate - Visual Flow Editor for Home Assistant Automations."""
import logging
import os

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.components import frontend

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the FlowTomate component from YAML (for backwards compatibility)."""
    # If there's YAML config, trigger import flow
    if DOMAIN in config:
        hass.async_create_task(
            hass.config_entries.flow.async_init(
                DOMAIN, context={"source": "import"}, data={}
            )
        )
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up FlowTomate from a config entry (UI installation)."""
    
    # Get the path to this integration's directory
    integration_dir = os.path.dirname(__file__)
    
    # Register the panel - Call frontend directly, not through hass.components
    await frontend.async_register_built_in_panel(
        hass,  # Pass hass as first argument
        component_name="custom",
        sidebar_title="FlowTomate",
        sidebar_icon="mdi:vector-polyline",
        frontend_url_path="flowtomate",
        config={
            "_panel_custom": {
                "name": "flowtomate-panel",
                "module_url": "/flowtomate_static/flowtomate-panel.js",
            }
        },
        require_admin=True,
    )
    
    # Register static path - Use hass.http directly
    www_dir = os.path.join(integration_dir, "www")
    hass.http.register_static_path(
        "/flowtomate_static",
        www_dir,
        cache_headers=False
    )
    
    _LOGGER.info("FlowTomate integration loaded successfully")
    
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    _LOGGER.info("FlowTomate integration unloaded")
    return True


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle removal of an entry."""
    _LOGGER.info("FlowTomate integration removed")
