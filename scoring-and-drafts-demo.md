# Pipeline Demo — Run Against the 5 Sample Notes

This simulates exactly what the deployed pipeline does at each checkpoint (L3 draft → B1 scoring → B1 news angle),
run by hand against the five raw notes provided, using the Voice Skill above. This is the artifact you'd get back
in Telegram for each note.

---

## Note 01 — Batch 14 / supplier changed preservative blend

**Score: 9/10** — Specific, documented, has a number (pH drop of 0.4), and a generalizable lesson. Publishable as-is.

**Keywords extracted:** "cosmetic supplier spec sheet change," "certificate of analysis skincare," "preservative system reformulation"

**News angle found:**
> NEWS SOURCE: What Is Certificate of Analysis (COA) for Cosmetics In India
> FROM: cosmeticsregulatory.com · 2026
> LINK: https://cosmeticsregulatory.com/blog/what-is-certificate-of-analysis/
> ⚠ Check this before publishing — you are the author of this claim

**Draft LinkedIn post:**

> Batch fourteen came back from our contract manufacturer with pH data that didn't match our baseline. Not unsafe — off. The finished product had dropped about 0.4 pH units, enough to push it out of the optimal range for the emollient blend we'd formulated around.
>
> I went back to the supplier. Three months earlier, they'd changed the preservative system — the new blend is more acidic than the one we qualified against. They'd sent a revised spec sheet. It got buried on our end before it reached anyone who'd catch the implication.
>
> This is the part I want to be direct about: "same formula, reordered" is not a fact, it's an assumption. Suppliers requalify preservative systems, adjust sourcing, change processing conditions — often for reasons that have nothing to do with you, and often without flagging what changed downstream. The spec sheet update was real. The 0.4 pH shift it caused was not on anyone's radar until we tested for it.
>
> We're holding the batch. The texture is different enough that I think customers would notice, even though nothing in it is unsafe.
>
> If you're a brand working with a contract manufacturer: check the Certificate of Analysis against your own baseline every batch, not just at initial qualification. A CoA that "looks normal" against a spec is not the same as a CoA that matches what you tested and approved originally. The gap between those two things is exactly where batch fourteen went wrong.
>
> ─────────────────────────────
> NEWS SOURCE: What Is Certificate of Analysis (COA) for Cosmetics In India
> FROM: cosmeticsregulatory.com · 2026
> LINK: https://cosmeticsregulatory.com/blog/what-is-certificate-of-analysis/
> ⚠ Check this before publishing — you are the author of this claim
> ─────────────────────────────

---

## Note 02 — Customer serum/moisturiser layering complaint

**Score: 8/10** — Clear diagnostic story, common mistake, teaches a mechanism. Publishable.

**Keywords extracted:** "serum absorption layering order," "occlusive moisturiser silicone," "skincare product order actives"

**News angle found:** none genuinely relevant to a customer-service anecdote — omitted per instruction ("if it doesn't fit naturally, ignore it").

**Draft LinkedIn post:**

> A customer wrote in last week: her serum, four months in, had "stopped working" — poor absorption, more congestion than before she started. She hadn't changed the serum.
>
> She had changed her moisturiser two weeks earlier, to a heavier, occlusive one. And she was applying it before the serum.
>
> That's the entire diagnosis. The actives in the serum were landing on top of an occlusive barrier and sitting there rather than reaching the skin. The absorption problem wasn't the serum — it never changed. It was layering order.
>
> This mistake is common and almost invisible to the person experiencing it, because the product that "changed" in their routine (the moisturiser) isn't the one they blame. They blame the one that stayed the same. Order matters more than most routines account for: water-thin, active-carrying products go on first; heavier, occlusive, barrier-sealing products go last, because their job is to sit on top and lock everything underneath in.
>
> If something in your routine seems to have stopped working and you haven't changed it, check what you added around it first.

---

## Note 03 — "Cold-pressed" ingredient sourcing claim

**Score: 9/10** — Concrete sourcing/verification story with a clear before/after (we didn't use it). Publishable.

**Keywords extracted:** "cold-pressed ingredient verification," "cosmetic ingredient sourcing documentation," "supplier spec sheet mismatch"

**News angle found:**
> NEWS SOURCE: What Is Certificate of Analysis (COA) for Cosmetics In India
> FROM: cosmeticsregulatory.com · 2026
> LINK: https://cosmeticsregulatory.com/blog/what-is-certificate-of-analysis/
> ⚠ Check this before publishing — you are the author of this claim

**Draft LinkedIn post:**

> We were reviewing a new emollient ingredient. The spec sheet said cold-pressed — a temperature-controlled extraction, typically kept below 49°C, that preserves fatty acid profiles instead of degrading them with heat.
>
> I asked for the processing documentation. The production log that came back showed extraction temperatures of 70–85°C.
>
> That's not cold-pressing. That's standard heat processing wearing a cold-pressed label. Whether that was a labelling error on their end or something else, I don't know — I'm not going to guess at intent I can't verify. What I do know is we didn't use the ingredient, and we would have, on the strength of the spec sheet alone, if we hadn't asked for the log.
>
> The claim on a spec sheet is not the same as the process that actually happened. For any ingredient where the processing method is the reason you're paying more or trusting the marketing — cold-pressed, virgin, unrefined — ask for the documentation, not the description. If a supplier can't produce it, that's the answer.
>
> ─────────────────────────────
> NEWS SOURCE: What Is Certificate of Analysis (COA) for Cosmetics In India
> FROM: cosmeticsregulatory.com · 2026
> LINK: https://cosmeticsregulatory.com/blog/what-is-certificate-of-analysis/
> ⚠ Check this before publishing — you are the author of this claim
> ─────────────────────────────

---

## Note 04 — Skin barrier "brick and mortar" explanation

**Score: 6/10** — Real substance (barrier damage has different causes and different fixes), but the note trails off before landing the point — it's a thought in progress, not yet an argument. Passes the gate but is the weakest of the four; would benefit from Meera finishing the thought before it's drafted, which is disclosed rather than hidden.

**Rejection-adjacent flag sent alongside the draft:** "This one is thinner than your other notes this week — the distinction between exfoliation damage, lipid depletion, and genetic barrier issues isn't fully worked out yet in the fragment. Draft below follows only what's there; you may want to finish the thought before publishing."

*(Draft omitted here for brevity — same treatment as the others, built from newsletter_007's existing barrier-repair content as the closest voice match.)*

---

## Note 05 — "Clean beauty" as a term

**Score: 5/10 → NO DRAFT GENERATED**

**Rejection message sent to Telegram:**
> Scored 5/10 — no draft made. Reason: substantive point (ingredient blacklists don't address formulation quality), but you flagged yourself that you've made a version of this argument before and don't have a new angle. Publishing it as-is risks repeating newsletter_009 rather than adding to it. Worth revisiting once the new angle is clearer.

This is the check working as intended: a coherent, well-evidenced note that still gets held back because Meera's own note names the reason it isn't ready. The pipeline should be at least this cautious, not less — if every note in a batch scores above 6, the scoring prompt is too lenient (per the B1·1 checkpoint instruction).
