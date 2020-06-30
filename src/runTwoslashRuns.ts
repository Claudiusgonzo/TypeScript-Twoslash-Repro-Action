import { TwoslashRun } from "./issuesToTwoslashRuns";
import { twoslasher } from "@typescript/twoslash"
import { readdirSync } from "fs";
import { join } from "path";
import { Issue } from "./getIssues";
import { getPreviousRunInfo } from "./utils/getPreviousRunInfo";

export type TwoslashResults = {
  assertions: string[]
  fails: string[]
  emit?: string
  time: number
  exception?: string,
  label: string
  commentID?: string
}

export function runTwoslashRuns(issue: Issue, runs: TwoslashRun): TwoslashResults[] {
  const oldResults = getPreviousRunInfo(issue)
  let latestRuns = runs.codeBlocksToRun.map(runTwoSlash("Nightly"))

  if (!oldResults) {
    const olderRuns = runs.codeBlocksToRun.map(runTwoSlashOnOlderVersions).flat()
    return [...olderRuns, ...latestRuns]
  } else {
    const withoutLatest = oldResults.filter(f => f.label !== "Nightly")
    return [...withoutLatest, ...latestRuns]
  }
}

export const runTwoSlashOnOlderVersions = (run: TwoslashRun["codeBlocksToRun"][number]) => {
  const tsVersions = readdirSync(join(__dirname, "..", "ts")).filter(f => f.split(".").length !== 2)
  return tsVersions.map(tsVersion => {
    const ts = require(join(__dirname, "..", "ts", tsVersion))
    return runTwoSlash(tsVersion)(run, ts)
  });
}

// TODO: Timeouts?
//
export const runTwoSlash = (label: string) =>  (run: TwoslashRun["codeBlocksToRun"][number], ts?: any): TwoslashResults => {
  let result: ReturnType<typeof twoslasher>
  const start = new Date()
  const getTime = () => Math.round(((new Date()).getTime() - start.getTime()) )

  try {
    result = twoslasher(run.block.content, run.block.lang, ts)
  } catch (error) {

    return {
      assertions: [],
      fails: [],
      exception: error.name + " - " + error.message,
      time: getTime(),
      label,
      commentID: run.commentID
    }
  }

  const fails = result.errors.map(e => e.renderedMessage)
  
  const returnResults: TwoslashResults = {
    fails,
    assertions: result.queries.map(q => q.text || q.completions!.map(q => q.name).join(", ")),
    emit: result.code,
    time: getTime(),
    label,
    commentID: run.commentID
  }
  
  const showEmit = run.block.content.includes("// @showEmit") || run.block.content.includes("// @showEmit")
  if (!showEmit) delete returnResults["emit"]
  
  return returnResults
} 

