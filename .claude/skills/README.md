# Marketing skills

Twelve skills from [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (MIT, see `LICENSE-marketingskills`), release 2.14.0 at upstream commit `88c79f6`, copied here so Claude Code loads them in this repository. Each skill's `evals/` folder was left out; nothing else was changed.

Every skill reads `.agents/product-marketing.md` first. That file holds the site's positioning, audience, voice and hard constraints. Run `/product-marketing` to update it.

| Skill | Use it for |
|-------|-----------|
| `product-marketing` | Keep `.agents/product-marketing.md` current |
| `seo-audit` | Technical and on-page SEO checks |
| `ai-seo` | Being cited by ChatGPT, Perplexity, Gemini, Claude; `robots.txt` and `llms.txt` |
| `schema` | JSON-LD in `src/layouts/BaseLayout.astro` and the case studies |
| `site-architecture` | Page hierarchy, navigation, URLs, internal links |
| `copywriting` | New page copy (both languages) |
| `copy-editing` | Editing existing copy |
| `cro` | Making the contact action easier to take |
| `content-strategy` | Planning articles or new case studies |
| `link-building` | Earning links and mentions |
| `public-relations` | Press, podcasts, talks |
| `social` | LinkedIn posts |

Some references link to `../../tools/integrations/*.md` in the upstream repository; those files are not copied here. To pick up a newer release, or add one of the other 41 skills (ads, emails, launch, pricing …):

```bash
npx skills add coreyhaines31/marketingskills -a claude-code --skill <name>
```

The latest audit made with these skills is `.agents/marketing-audit-2026-11-04.md`.
