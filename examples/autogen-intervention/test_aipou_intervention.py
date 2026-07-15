import unittest

from autogen_core import AgentId, CancellationToken, FunctionCall, MessageContext
from autogen_core.tool_agent import ToolException

from aipou_intervention import AipouToolInterventionHandler, InMemoryAuthorityPolicy, parse_denial


def message_context() -> MessageContext:
    return MessageContext(
        sender=None,
        topic_id=None,
        is_rpc=True,
        cancellation_token=CancellationToken(),
        message_id="fixture-message",
    )


class AipouInterventionTests(unittest.IsolatedAsyncioTestCase):
    async def test_missing_authority_returns_recoverable_structured_denial(self) -> None:
        policy = InMemoryAuthorityPolicy()
        handler = AipouToolInterventionHandler(policy.decide)
        call = FunctionCall(id="call-1", name="write_file", arguments='{"path":"fixture.txt"}')

        with self.assertRaises(ToolException) as caught:
            await handler.on_send(
                call,
                message_context=message_context(),
                recipient=AgentId("tool_executor_agent", "default"),
            )

        denial = parse_denial(caught.exception)
        self.assertEqual(denial["code"], "AIPOU_AUTHORITY_REQUIRED")
        self.assertTrue(denial["canRequestAuthority"])
        self.assertEqual(denial["enforcementPointKind"], "orchestrator_policy")

    async def test_granted_authority_allows_the_original_function_call(self) -> None:
        policy = InMemoryAuthorityPolicy()
        handler = AipouToolInterventionHandler(policy.decide)
        call = FunctionCall(id="call-2", name="write_file", arguments='{"path":"fixture.txt"}')
        policy.grant(policy.action_ref(call), "0x" + "11" * 32)

        result = await handler.on_send(
            call,
            message_context=message_context(),
            recipient=AgentId("tool_executor_agent", "default"),
        )

        self.assertIs(result, call)

    async def test_permanent_denial_cannot_request_authority(self) -> None:
        policy = InMemoryAuthorityPolicy(permanently_forbidden_tools={"delete_production"})
        handler = AipouToolInterventionHandler(policy.decide)
        call = FunctionCall(id="call-3", name="delete_production", arguments="{}")
        policy.grant(policy.action_ref(call), "0x" + "22" * 32)

        with self.assertRaises(ToolException) as caught:
            await handler.on_send(
                call,
                message_context=message_context(),
                recipient=AgentId("tool_executor_agent", "default"),
            )

        denial = parse_denial(caught.exception)
        self.assertEqual(denial["code"], "AIPOU_ACTION_FORBIDDEN")
        self.assertFalse(denial["canRequestAuthority"])

    async def test_non_tool_messages_pass_through(self) -> None:
        policy = InMemoryAuthorityPolicy()
        handler = AipouToolInterventionHandler(policy.decide)
        message = {"kind": "status"}

        result = await handler.on_send(
            message,
            message_context=message_context(),
            recipient=AgentId("tool_executor_agent", "default"),
        )

        self.assertIs(result, message)


if __name__ == "__main__":
    unittest.main()
