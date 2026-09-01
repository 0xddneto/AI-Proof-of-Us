# Blind Conformance Protocol

This protocol is for evaluating whether two independent implementations reach
the same result on synthetic conformance cases. It is deliberately narrower
than certification, runtime integration, useful-work proof, reward approval,
or adoption.

## Why opaque IDs are not enough

Renaming a public fixture case does not make it blind when its authority,
work, or other payload bytes can be joined to a public corpus that carries an
expected verdict. A predictor could look up the case rather than exercise its
implementation. A matching table would then prove only that the lookup path
worked.

## Required procedure

1. The fixture author creates fresh synthetic payloads for every run. Do not
   reuse fact IDs, subjects, addresses, nonces, signatures, timestamps, or
   other case bodies from a public expected-case corpus.
2. The author creates a blind bundle containing opaque case IDs and only the
   data needed by a verifier. It contains no expected verdicts, assertions,
   mutation labels, or provenance that resolves a case to an earlier public
   fixture.
3. Before distributing the blind bundle, the author publishes a SHA-256
   commitment to the canonical mapping of opaque ID to expected verdict. The
   mapping itself remains unavailable until every declared evaluator has
   posted its table.
4. The author publishes the blind-bundle digest and the number of cases, but
   keeps the mapping outside any repository tree or artifact set that exposes
   public expected payloads. Vary case count and pass/fail distribution across
   runs when practical.
   Before calling the bundle sealed, the author also measures and publishes
   how many verdicts are recoverable from public bytes alone. A seal is not a
   claim about the bundle's difficulty.
5. Each evaluator records the blind-bundle digest, runs only its own
   implementation, and publishes an ordered opaque-ID-to-verdict table plus a
   SHA-256 digest of that compact canonical table before the mapping opens.
6. The author releases the mapping and canonicalization rule. Everyone checks
   its prior commitment, compares every prediction, and publishes both
   agreements and disagreements.

## Mutation and detector discipline

Negative cases must use plausible in-domain values. A mutation should differ
from its valid control in exactly the property under test: for example, a
well-formed but wrong digest, a valid-length signature over a wrong preimage,
or an unregistered scheme name that is otherwise ordinary. Do not use sentinel
strings, conspicuous hexadecimal words, malformed lengths, or version numbers
that reveal a verdict without running a verifier.

When an evaluator also publishes a marker detector, it must commit the
detector and marker list by SHA-256 before the blind bundle is released, then
report its result even when the result is null or unhelpful. A detector written
after reading the prediction tables can expose a possible leak, but it does
not independently measure the sealed corpus.

## Result language

Call the result an **independent blind conformance run** only when the
procedure above was followed and no participant identifies a public join path
from blind payloads to expected outcomes. If the blind corpus can be joined to
public expected cases, mark the run **invalidated by corpus leakage** and do
not use its agreement rate as evidence of semantic convergence.

An ordinary reproducible fixture suite remains valuable: it shows that an
implementation accepts and rejects the published cases as specified. It does
not, by itself, establish independent evaluation or external adoption.
