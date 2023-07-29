# kokoustin²

Kokoustin is a FOSS tool for meeting notes/minutes, designed mainly for the use of [Jämsä's youth council](https://jamsa.fi/nuva).

This is version 2, built on top of Next.js 13, but not App Router (due to Mantine/remotion not supporting it).

## Why did I rewrite?

- The codebase was buggy, hard to maintain and pretty much spaghetti.
- Supabase's free plan isn't great if the program is only needed once a month
- Cloud saving was very buggy
- Some UI bugs (and it was pretty ugly!)
