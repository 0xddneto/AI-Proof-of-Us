# AIPOU-CREATIVE-VIDEO-001

Deliverable for issue #3: one original 6-second 16:9 MP4 loop showing an AI-work receipt moving from a human-agent task into a verified settlement record.

## Files

- `aipou-receipt-loop.mp4` - final MP4 deliverable.
- `aipou-receipt-loop-keyframe.png` - source keyframe artwork used to render the loop.

## Review Checklist

- 6-second MP4 loop: yes, rendered at 30 fps with a 6 second duration target.
- 16:9 and 1080p or higher: yes, rendered at 1920x1080.
- AI-work receipt moving from human-agent task into verified settlement record: yes, the scene flows left-to-right from human/AI collaboration, through a private receipt, into a verified archive/settlement node; animated light packets reinforce the movement.
- Seamless loop intent: yes, animation uses periodic sine/cosine movement and a 6 second cycle.
- No third-party watermark: yes.
- No token-price, investment-return, or guaranteed-reward implication: yes.
- No third-party logos or copyrighted characters: yes.

## Generation Notes

The artwork was generated as original keyframe art, then animated with ffmpeg using a 6 second periodic motion cycle. The loop adds subtle zoom, moving receipt particles, and verification pulses while preserving the original scene.

Source prompt summary:

```text
Create an original 16:9 illustration showing an AI-work receipt moving from a human-agent task into a verified settlement record. A human contributor and abstract AI assistant collaborate on the left, a glowing private cryptographic receipt forms in the center, and a verified settlement archive appears on the right. Use no third-party logos, copyrighted characters, watermarks, readable text, token-price charts, investment-return language, or guaranteed-reward implication.
```

Render command:

```bash
ffmpeg -loop 1 -i aipou-receipt-loop-keyframe.png \
  -filter_complex "<periodic 6-second animation and overlay filters>" \
  -c:v libx264 -pix_fmt yuv420p -profile:v high -crf 20 \
  -preset medium -movflags +faststart -r 30 aipou-receipt-loop.mp4
```

## Payout

Accepted offer: 150 AIPOU on Base after accepted delivery.

Payout address: `0x2f8081562ac67467d1cbd40ab3120849c1f587da`
