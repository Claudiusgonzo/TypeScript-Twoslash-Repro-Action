### TypeScript Repro Bot

The TypeScript repro 'bot' is really just a daily automated GitHub Action run. 

It builds on [Twoslash code markup](https://www.npmjs.com/package/@typescript/twoslash) to make verifiable code samples which can be tested against different versions of TypeScript. How it works is that the bot:

- Looks through all issues which have the label "Has Repro"
- Extracts code samples in each issue from the body and comments, repros are codeblocks like:
  ```
  `'`ts repro
  const hello = "world"
  `'`
  ```

- Loops through the code samples with trying the latest nightly TypeScript, and for the first time it is seen the last 5 versions of TypeScript
- Leave / Updates a comment on the state of all the different results from the twoslash run

### How can you make a repro?

We have a fork of the TypeScript Playground which is built just for this purpose: https://www.staging-typescript.org/dev/bug-workbench/

It has all you should need to make repros in your browser which you can post as new issues or comments.
