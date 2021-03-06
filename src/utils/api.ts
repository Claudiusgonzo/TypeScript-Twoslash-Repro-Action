import {getOctokit} from '@actions/github'
import {Context} from '../getContext'

const addComment = `mutation($input: AddCommentInput!) { addComment(input: $input) { clientMutationId } }`
const editComment = `mutation($input: UpdateIssueCommentInput!) { updateIssueComment(input: $input) { clientMutationId } }`

export type API = ReturnType<typeof createAPI>

export const createAPI = (ctx: Context) => {
  const octokit = getOctokit(ctx.token)

  return {
    editOrCreateComment: async (issueID: string, commentID: string | undefined, body: string) => {
      // https://regex101.com/r/ZORaaK/1
      const sanitizedBody = body.replace(/home\/runner\/work\/TypeScript-Twoslash-Repro-Action\/TypeScript-Twoslash-Repro-Action\/dist/g, "[root]")
      if (commentID) {
        await octokit.graphql(editComment, {input: {id: commentID, body: sanitizedBody}})
      } else {
        await octokit.graphql(addComment, {input: {subjectId: issueID, body: sanitizedBody}})
      }
    }
  }
}
