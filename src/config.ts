import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import * as dotenv from 'dotenv'
import { Static, Type } from '@sinclair/typebox'

dotenv.config()

const Config = Type.Object({
  port: Type.Number(),
  log_level: Type.String(),
  jwtSecret: Type.String()
})
type ConfigType = Static<typeof Config>

const validateConfig = (): ConfigType => {
  const data: ConfigType = {
    port: Number(process.env.PORT),
    log_level: process.env.LOG_LEVEL || 'debug',
    jwtSecret: process.env.JWT_SECRET
  }

  const ajv = addFormats(new Ajv({}), [
    'date-time',
    'time',
    'date',
    'email',
    'hostname',
    'ipv4',
    'ipv6',
    'uri',
    'uri-reference',
    'uuid',
    'uri-template',
    'json-pointer',
    'relative-json-pointer',
    'regex'
  ])
    .addKeyword('kind')
    .addKeyword('modifier')
  const validate = ajv.compile(Config)

  if (!validate(data)) {
    throw new TypeError(
      `Config does not match JSON schema ${JSON.stringify(validate.errors)}`
    )
  }

  return data
}

export { ConfigType }
export default validateConfig()
