from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any, Callable

from autogen_core import AgentId, DefaultInterventionHandler, DropMessage, FunctionCall, MessageContext
from autogen_core.tool_agent import ToolException


@dataclass(frozen=True)
class AuthorityDecision:
    allowed: bool
    code: str
    message: str
    action_ref: str
    can_request_authority: bool


class InMemoryAuthorityPolicy:
    """Synthetic policy store for a reproducible fixture, not a production validator."""

    def __init__(self, permanently_forbidden_tools: set[str] | None = None) -> None:
        self._permanently_forbidden_tools = permanently_forbidden_tools or set()
        self._authority_by_action: dict[str, str] = {}

    @staticmethod
    def action_ref(call: FunctionCall) -> str:
        return f"autogen:tool:{call.name}:{call.id}"

    def grant(self, action_ref: str, authority_receipt_id: str) -> None:
        self._authority_by_action[action_ref] = authority_receipt_id

    def decide(self, call: FunctionCall) -> AuthorityDecision:
        action_ref = self.action_ref(call)
        if call.name in self._permanently_forbidden_tools:
            return AuthorityDecision(
                allowed=False,
                code="AIPOU_ACTION_FORBIDDEN",
                message="Tool action is permanently forbidden by orchestrator policy.",
                action_ref=action_ref,
                can_request_authority=False,
            )
        if action_ref not in self._authority_by_action:
            return AuthorityDecision(
                allowed=False,
                code="AIPOU_AUTHORITY_REQUIRED",
                message="Matching pre-action authority is required before tool execution.",
                action_ref=action_ref,
                can_request_authority=True,
            )
        return AuthorityDecision(
            allowed=True,
            code="AIPOU_AUTHORITY_ACCEPTED",
            message="Matching pre-action authority is present.",
            action_ref=action_ref,
            can_request_authority=False,
        )


class AipouToolInterventionHandler(DefaultInterventionHandler):
    """Intercept AutoGen FunctionCall messages before ToolAgent execution."""

    def __init__(self, policy: Callable[[FunctionCall], AuthorityDecision]) -> None:
        self._policy = policy

    async def on_send(
        self,
        message: Any,
        *,
        message_context: MessageContext,
        recipient: AgentId,
    ) -> Any | type[DropMessage]:
        if not isinstance(message, FunctionCall):
            return message

        decision = self._policy(message)
        if decision.allowed:
            return message

        denial = {
            "actionRef": decision.action_ref,
            "canRequestAuthority": decision.can_request_authority,
            "code": decision.code,
            "enforcementPointKind": "orchestrator_policy",
            "message": decision.message,
        }
        raise ToolException(
            call_id=message.id,
            content=json.dumps(denial, separators=(",", ":"), sort_keys=True),
            name=message.name,
        )


def parse_denial(error: ToolException) -> dict[str, Any]:
    return json.loads(error.content)
