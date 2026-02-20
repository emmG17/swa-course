# Lumina

Lumina is a website used to host a course about software architecture. It serves course slides, documents, and resources built with SvelteKit and Slidev.

## Prerequisites

- [Bun](https://bun.sh/) (JavaScript runtime and package manager)

## Installation

```sh
bun install
```

## Development

Start a development server:

```sh
bun run dev
```

Or start the server and open the app in a new browser tab:

```sh
bun run dev -- --open
```

This command doesn't build the slide decks, so you can make changes to the Slidev source files and see them reflected in the browser without restarting the server. To build the slide decks, run:

```sh
bun run build:slides
```

If you need to watch the slide decks for changes, you can run:

```sh
bunx slidev slides/{slide-deck-name}
```
Substitute `{slide-deck-name}` with the name of the slide deck you want to watch. This will rebuild the slide deck whenever you make changes to the source files.

## Building

To create a production build:

```sh
bun run build
```

This builds the slide decks and then compiles the SvelteKit application.

You can preview the production build with:

```sh
bun run preview
```

## Linting and Type Checking

```sh
bun run lint
bun run check
```
