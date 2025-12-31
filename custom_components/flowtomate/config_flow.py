"""Config flow for FlowTomate integration."""
import logging

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


class FlowTomateConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for FlowTomate."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        errors = {}

        # Check if already configured
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            # Create the entry
            return self.async_create_entry(
                title="FlowTomate",
                data={},
            )

        # Show form
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({}),
            errors=errors,
        )

    async def async_step_import(self, import_config):
        """Handle import from configuration.yaml."""
        # Check if already configured
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        
        return self.async_create_entry(
            title="FlowTomate",
            data={},
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        """Get the options flow for this handler."""
        return FlowTomateOptionsFlowHandler(config_entry)


class FlowTomateOptionsFlowHandler(config_entries.OptionsFlow):
    """Handle options flow for FlowTomate."""

    def __init__(self, config_entry):
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(self, user_input=None):
        """Manage the options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({}),
        )
