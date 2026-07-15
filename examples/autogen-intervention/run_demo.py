import asyncio
import json

from autogen_core import AgentId, CancellationToken, FunctionCall, MessageContext
from autogen_core.tool_agent import ToolException

from aipou_intervention import AipouToolInterventionHandler, InMemoryAuthorityPolicy, parse_denial


def context(message_id: str) -> MessageContext:
    return MessageContext(
        sender=None,
        topic_id=None,
        is_rpc=True,
        cancellation_token=CancellationToken(),
        message_id=message_id,
    )


async def evaluate(handler: AipouToolInterventionHandler, call: FunctionCall) -> dict[str, object]:
    try:
        await handler.on_send(
            call,
            message_context=context(f"message-{call.id}"),
            recipient=AgentId("tool_executor_agent", "default"),
        )
        return {"action": call.name, "code": "AIPOU_AUTHORITY_ACCEPTED", "outcome": "allowed"}
    except ToolException as error:
        return {"action": call.name, "outcome": "denied", **parse_denial(error)}


async def main() -> None:
    policy = InMemoryAuthorityPolicy(permanently_forbidden_tools={"delete_production"})
    handler = AipouToolInterventionHandler(policy.decide)
    recoverable = FunctionCall(id="demo-1", name="write_file", arguments='{"path":"fixture.txt"}')
    forbidden = FunctionCall(id="demo-2", name="delete_production", arguments="{}")

    print(json.dumps(await evaluate(handler, recoverable), sort_keys=True))
    policy.grant(policy.action_ref(recoverable), "0x" + "33" * 32)
    print(json.dumps(await evaluate(handler, recoverable), sort_keys=True))
    print(json.dumps(await evaluate(handler, forbidden), sort_keys=True))


if __name__ == "__main__":
    asyncio.run(main())
