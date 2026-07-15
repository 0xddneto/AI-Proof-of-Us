# AutoGen Intervention Fixture

This example uses the real `autogen-core` `DefaultInterventionHandler` and `FunctionCall` types to enforce AIPOU-style pre-action authority at the tool execution boundary.

It is deliberately small and synthetic:

- no model or API key;
- no Docker;
- no wallet, claim, or funds;
- no raw prompt or tool output storage;
- no claim that AutoGen ships or endorses AIPOU.

## Run in under a minute

```powershell
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -m unittest -v
.venv\Scripts\python run_demo.py
```

On macOS or Linux, replace `.venv\Scripts\python` with `.venv/bin/python`.

## Expected policy states

| State | Code | `canRequestAuthority` | Tool reaches executor |
|---|---|---:|---:|
| Missing authority | `AIPOU_AUTHORITY_REQUIRED` | `true` | No |
| Matching authority | `AIPOU_AUTHORITY_ACCEPTED` | n/a | Yes |
| Permanently forbidden | `AIPOU_ACTION_FORBIDDEN` | `false` | No |

The denial is serialized into `ToolException.content` as compact JSON so an agent loop can distinguish a recoverable authorization requirement from a permanent policy prohibition. The fixture never includes raw tool arguments in the denial payload.

`InMemoryAuthorityPolicy` is only a deterministic test store. A production adapter must replace it with its validator or authority registry and must bind the later tool result to post-call evidence separately.

Reference pattern: [AutoGen user approval with an intervention handler](https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/cookbook/tool-use-with-intervention.html).

Both this fixture and the framework-neutral lifecycle suite run in `.github/workflows/interop-fixtures.yml` on every relevant pull request and `main` update.
