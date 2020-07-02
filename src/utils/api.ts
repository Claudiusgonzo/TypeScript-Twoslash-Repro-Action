import { getOctokit } from "@actions/github";
import { Context } from "../getContext";

const addComment = `mutation($input: AddCommentInput!) { addComment(input: $input) { clientMutationId } }`;
const deleteComment = `mutation($input: DeleteIssueCommentInput!) { deleteIssueComment(input: $input) { clientMutationId } }`;
const editComment = `mutation($input: UpdateIssueCommentInput!) { updateIssueComment(input: $input) { clientMutationId } }`;


export type API = ReturnType<typeof createAPI>

export const createAPI = (ctx: Context) => {
  const octokit = getOctokit(ctx.token)
  
  return {
    editOrCreateComment: async (issueID:string,  _commentID: string | undefined, body: string) => {
      await octokit.graphql(addComment, { input: { subjectId: issueID, body: body }})
    }
  }
}
