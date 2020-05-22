# Introduction

`PreSWR` is a wrapper over [`swr`](https://swr.now.sh/) that keeps track of your calls and lets you preload its results. It's oriented as a tool to help with Server-Side Rendering, and quite suited for use with [`Next.js`](https://nextjs.org/), although its design is environment-agnostic.

```sh
$ yarn add preswr
```

```js
import usePreSWR, { preloaded } from "preswr"
import React from "react"

const FavouritePokemon = preloaded(({ name }) => {
  const { data } = usePreSWR(`https://pokeapi.co/api/v2/pokemon/${name}/`)
  return (
    <p>
      My favourite Pokémon is ${data.name}, of type ${data.types[0].type.name}
    </p>
  )
})

export default FavouritePokemon.Component

export const getStaticProps = async ({ params }) =>
  await FavouritePokemon.preloadData({ name: params.name })
```

## Usage

### `usePreSWR`

The default export is the hook function `usePreSWR`, which wraps `useSWR` with the preloading smarts. It has the same arguments.

It is allowed to mix `usePreSWR` calls and `useSWR` calls freely, but only the `usePreSWR` will be preloaded.

### `PreSWRConfig`

`usePreSWR` can't read the config from the `<SWRConfig>` provider. We export a `<PreSWRConfig>` that works for both.

### `preloaded`

It's a function which takes a `React` component and returns an object with two properties:

- `Component` is your original component, but it takes an extra prop with the preloaded data. You need to use this component in place of the original one to take advantage of the preloading.

- `preloadData()` takes the props you'd call your component with, preloads the data which it would request, and returns the props with an extra one which holds the preloaded data.

## Limitations

- It only works with ReactDOM, so no support for React Native (yet?)
- Make sure you follow the [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html)
- When `preloadData` is called, your React component is rendered in the background, which might invoke side-effects if your code uses them.
- Your `fetcher` functions must work in the context you're using `preloadData()`. You can provide an `initialData` config key in the call to bypass calling them.
- Your `key`s (or the value returned from `key` functions) must be able to be serialized to JSON (that means numbers, strings, null, arrays, and plain objects).

## TypeScript

This package is written in TypeScript, and [it exports a number of helpful types](./src/types.ts).

An especially useful type is `PreloaderProps<...>`, which returns the type of the props of the wrapped component, including the extra internal prop which holds the preloaded data.

```typescript
import { GetStaticProps } from "next"
import { preloaded, PreloaderProps } from "preswr"
import FooComponent from "./foo"

const PreloadedFoo = preloaded(FooComponent)

export default PreloadedFoo.Component

export const getStaticProps: GetStaticProps<PreloaderProps<
  typeof PreloadedFoo
>> = async ({ params }) =>
  await FavouritePokemon.preloadData({ name: params.name })
```
