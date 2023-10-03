import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import httpUrlEncodePathParser from '@middy/http-urlencode-path-parser'

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser()).use(httpUrlEncodePathParser())
}
