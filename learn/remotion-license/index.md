# Is Remotion free? Remotion's licence explained · ultrafast

> Remotion is free for individuals, teams of up to 3 and non-profits. From 4 people, $25 a seat or $0.01 a render ($100 minimum). Its rules, quoted and dated.

URL: https://ultrafast.mov/learn/remotion-license/

# Is Remotion free?

For individuals, companies of up to 3 people and non-profits, yes, commercial use included. A company of 4 or more needs a Company License, even if only one person makes videos: $25 a month per seat to make videos, or $0.01 a render, at least $100 a month, to automate them.

Updated 26 November 2026, for Remotion 4.0 (4.0.547 is the latest release). ultrafast wrote this page and competes with Remotion, so every rule here quotes Remotion's licence, FAQ, pricing or terms, linked under Sources. Remotion's own pages decide: read them before you buy or rely on this one.

## Who uses it for free.

The Free License has every feature: “There is no difference in functionality between the Free License and Company License.” It needs no account and no sign-up.

### Individuals

“an individual, whether for personal or commercial use.” Selling the videos is allowed.

### Teams of up to 3

“an organization or team of individuals with up to 3 people.” A company qualifies, incorporated or not, as long as its total headcount is 3 or less.

### Non-profits

Of any size, if formed and run mainly for charitable, educational, scientific, artistic or similar purposes, without distributing profits. Government bodies, educational institutions, commercial subsidiaries and trade associations need Remotion's written permission first.

### Anyone evaluating

“evaluating whether the Remotion Software is a good fit, and are not yet using it in a commercial way.” Because of this, Remotion gives no refunds on paid licences.

Free users can also run automations, launch a SaaS and render on servers without paying per render: the Automators plan below “only applies to the Company License.”

## What the Company License costs.

From Remotion's pricing page and licence FAQ, checked 26 November 2026. Which plan applies depends on what the code does: owning code that calls a render API or embeds the Player counts as an automation.

Plan| For| Price| What is counted  
---|---|---|---  
Remotion for Creators| making videos by hand: writing the code, prompting an AI agent or editing in Remotion Studio| $25 a month per seat| one seat per person who has the project on their machine and makes videos with it. AI agents, reviewers and people who only receive the videos need no seat.  
Remotion for Automators| code that renders on its own: `renderMedia()`, `renderStill()`, the Lambda, Cloud Run and Vercel renderers, `renderMediaOnWeb()`, `npx remotion render`, or the `<Player>`| $0.01 a render, at least $100 a month| each video, audio file, GIF or image sequence is 1 render. Stills stopped counting in November 2026, and previews in Remotion Studio or the Player don't count.  
Enterprise License| signed agreements, vendor and compliance forms, a private support channel, a monthly consulting session| the same rates, at least $500 a month| as above; Remotion may quote more when the requirements are larger.  
  
Creators and Automators can be combined, with one $100 minimum between them. Developers who build an automation need no Creators seat. A paid licence unlocks no extra features; it brings priority support and a customers' channel on Discord.

## Who counts toward the 4.

The whole company, not only the people who make videos. Asked whether a 20-person company where one person uses Remotion needs a Company License, the FAQ answers: “Yes, unless a Free License exemption applies. Eligibility depends on your company's total headcount.” Without an automation, that company needs one Creators seat.

### An agency that delivers files

If the client only receives finished videos and never gets the project or runs Remotion, only the agency's headcount counts. An agency of 3 or fewer stays on the Free License.

### A client who owns the project

If the client will own, run or keep developing the Remotion code, or works on the same project, both companies' headcounts are added together. The owner of the project's IP buys the licence.

### Contractors and other studios

Freelancers, studios or consultants brought in to work on the same Remotion project add their headcount to yours.

## What no licence allows.

These hold for everyone, on the Free License or a paid one.

### Not allowed

  * Selling Remotion itself: “It is not allowed to copy or modify Remotion code for the purpose of selling, renting, licensing, relicensing, or sublicensing your own derivate of Remotion.”
  * A rendering service where users bring their own code: “it is not allowed to let users bring or upload their own Remotion code to your service for rendering.”

### Allowed

  * Letting users render personalised videos from your Remotion template.
  * A service where an LLM writes Remotion code and renders it, including for business customers, who don't need a licence of their own.
  * Letting users edit code that your service generated.

No Remotion licence covers codec patents: it “does not include a license to third-party patents, such as patents relating to codecs like H.264/AVC, HEVC or AAC.” Open-source licences such as Apache-2.0 and MIT, ultrafast's included, don't license third-party codec patents either.

## What Remotion reports back.

Telemetry is how Remotion counts renders for licensing. It sends the licence key if one is set, the IP address of the machine that renders and whether the render was production or development; from a browser, also the page's domain and whether the render succeeded. “No content or metadata of the video rendered, or any user data is collected.”

### In the browser

`renderMediaOnWeb()` sends an event “even if no licenseKey is set,” and the FAQ says this telemetry “cannot be disabled.” The end user's IP address goes to Remotion, which Remotion's docs say an app's privacy policy should reflect.

### On a server

Only when a licence key is set, and only for successful renders. Before Remotion 5.0, setting a key is voluntary.

### From Remotion 5.0

Companies on Remotion for Automators must set a licence key and opt into telemetry, or send Remotion a monthly report it can verify. For the Free License and Remotion for Creators it stays voluntary.

## What changes in Remotion 5.0.

Remotion 5.0 isn't out yet. Its licence is in a pull request open since April 2024, and its terms are on the docs site as an “Upcoming document” that “will take effect upon the release of Remotion 5.0.” Besides telemetry, four changes stand out.

### Who counts

The free tier reads “an organization or team of individuals with up to 3 people,” where the 4.0 licence says “a for-profit organization with up to 3 employees.” The terms define headcount as “all personnel, regardless of whether they use the Remotion Software,” and add part-time staff, contractors and partners on the same project. Today's FAQ already counts this way.

### Binding terms

The licence itself says: “Users are required to accept the legally binding Terms and Conditions to use the Remotion Software.” The 4.0 terms are a shorter document that doesn't define headcount.

### Rendering services

The ban on services that render users' own Remotion code moves into the licence and applies “regardless of whether you are eligible for the Free License,” unless Remotion approves in writing.

### Desktop apps

An Electron or Tauri app built on Remotion must keep users from editing or uploading Remotion code. The terms require a Company License for as long as the app is distributed and for a year after its last published version.

## If the licence doesn't fit.

In Remotion's words, it “is source-available software, but it is not open source software according to the Open Source Initiative's Open Source Definition.” Tools under MIT or Apache-2.0 have no headcount limit, no seats and no per-render fee.

### Stay with Remotion when

  * You're 3 people or fewer, a non-profit, or the Company License is worth it to you.
  * Your team builds in React and wants to reuse its components, or you need a player embedded in a web page.
  * You want a project in development since 2020, with a large community and documentation.

### Look at open-source tools when

  * Your company has 4 or more people and its video work doesn't justify a licence.
  * You render on servers and want no per-render fee and no render reports.
  * You'd consider another way of writing video. Eight options, with licences, renderers and release dates, are on [Remotion alternatives](<https://ultrafast.mov/alternatives/remotion/>): Revideo, Motion Canvas, HyperFrames, Framefields, VideoFlow, Editly, Manim and ultrafast.

ultrafast is Apache-2.0 or MIT, with no licence key and no render reports. It renders a JSON document on your GPU, with no browser. It doesn't run React, so moving a Remotion project to it means rewriting the video; [ultrafast vs Remotion](<https://ultrafast.mov/compare/remotion/>) compares the two.

## Common questions.

Is Remotion free for commercial use?

Yes, for individuals, companies of up to 3 people, non-profits and anyone evaluating it. The Free License allows commercial use and has the same features as the paid one. A for-profit company of 4 or more needs a Company License (Remotion's licence and FAQ, checked 26 November 2026).

How much does a Remotion licence cost?

$25 a month per seat for Remotion for Creators, which covers making videos by hand, AI agents included, or $0.01 a render with a $100 monthly minimum for Remotion for Automators, which covers code that renders on its own and the embedded Player. The Enterprise License has the same rates with a $500 monthly minimum.

Do we need a Remotion licence if only one person in the company uses it?

Yes, if the company has 4 or more people. Remotion's FAQ says eligibility depends on the company's total headcount, not on how many people use Remotion. Without an automation, that is one Creators seat at $25 a month.

Do AI agents need a Remotion seat?

No. Under Remotion for Creators, only the people using the agents need a seat, according to Remotion's FAQ. People who only review or receive the finished videos don't need one either.

Does Remotion count still images as renders?

Not since November 2026, according to its FAQ. A video, audio file, GIF or image sequence counts as one render, and previews in Remotion Studio and the Player don't count.

Is Remotion open source?

No. Remotion's FAQ calls it source-available: the code is public on GitHub, but its use is governed by the Remotion License, which is not an OSI-approved open-source licence. Open-source tools under MIT or Apache-2.0 are compared on [Remotion alternatives](<https://ultrafast.mov/alternatives/remotion/>).

## Sources.

All read on 26 November 2026.

  * **Remotion's licence:** [LICENSE.md](<https://github.com/remotion-dev/remotion/blob/main/LICENSE.md>) (the 4.0 licence: eligibility, allowed and disallowed uses), [pull request #3750](<https://github.com/remotion-dev/remotion/pull/3750>) (the 5.0 licence).
  * **Remotion's docs:** [License & Pricing](<https://www.remotion.dev/docs/license/pricing>), [License FAQ](<https://www.remotion.dev/docs/license/faq>) (eligibility, the [20-person question](<https://www.remotion.dev/docs/license/faq#our-company-has-20-people-but-only-one-uses-remotion-do-we-need-a-company-license>), automations, seats, renders, agencies, LLM services, telemetry, open source, codec patents), [Telemetry](<https://www.remotion.dev/docs/telemetry>), [Terms and Conditions v5.0](<https://www.remotion.dev/docs/terms>) (upcoming: headcount, rendering services, desktop apps), [Terms and Conditions v4.0](<https://www.remotion.dev/docs/terms-4-0>).
  * **Releases:** [Remotion releases](<https://github.com/remotion-dev/remotion/releases>) (v4.0.547, 24 November 2026).
  * **ultrafast:** [repository](<https://github.com/ultrafastmov/ultrafast>) (LICENSE-APACHE, LICENSE-MIT), [Remotion alternatives](<https://ultrafast.mov/alternatives/remotion/>), [ultrafast vs Remotion](<https://ultrafast.mov/compare/remotion/>).

## Free at any company size.

ultrafast is Apache-2.0 or MIT. Install it and ask your agent for a video.

`curl -fsSL https://ultrafast.mov/install.sh | sh` [Read the quickstart](<https://ultrafast.mov/docs/>)

Want it hosted? [Join the ultrafast Cloud waitlist](<https://ultrafast.mov/cloud/>).
