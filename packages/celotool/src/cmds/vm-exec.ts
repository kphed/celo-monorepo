import {
  addCeloEnvMiddleware,
  CeloEnvArgv,
  envVar,
  failIfNotVmBased,
  fetchEnv,
} from 'src/lib/env-utils'
import { execCmd } from 'src/lib/utils'
import { getNodeVmName, getVmSshCommand } from 'src/lib/vm-testnet-utils'
import yargs from 'yargs'

export const command = 'vm-exec'

export const describe = 'SSH and exec commands on all or individual nodes in a VM-based env'

interface ValidatorsExecArgv extends CeloEnvArgv {
  nodeType: string
  docker: string
  cmd: string
  only: number
}

export const builder = (argv: yargs.Argv) => {
  return addCeloEnvMiddleware(argv)
    .option('nodeType', {
      describe: 'Type of node',
      choices: ['validator', 'tx-node', 'bootnode', 'proxy'],
      type: 'string',
    })
    .option('docker', {
      type: 'string',
      description: 'Operation to run on the docker container {start|stop|restart}',
      default: 'restart',
    })
    .option('cmd', {
      type: 'string',
      description: 'Arbitrary command to exec',
      default: null,
    })
    .option('only', {
      type: 'number',
      description: 'Index of the only node to exec on',
      default: null,
    })
}

export const handler = async (argv: ValidatorsExecArgv) => {
  failIfNotVmBased()

  const project = fetchEnv(envVar.TESTNET_PROJECT_NAME)
  const zone = fetchEnv(envVar.KUBERNETES_CLUSTER_ZONE)

  const cmd = argv.cmd === null ? `sudo docker ${argv.docker} geth` : argv.cmd

  console.info(
    `Running on validators.\n` +
      `Cmd: ${cmd}\n` +
      `Env: ${argv.celoEnv}\n` +
      `Project: ${project}\n` +
      `Zone: ${zone}\n` +
      `Node Type: ${argv.nodeType}`
  )

  // For proxy / tx-nodes that have random suffixes, we are forced to run a
  // gcloud command and await it in order to get the full instance name.
  // Because of this, we end up calling the SSH command, and then moving on to get the
  // next instance name, which takes time, so the previous SSH command is nearly finished.
  // By doing this in two steps, we more closely make the exec across all instances
  // happen in parallel
  const instanceNames = []
  if (argv.only === null) {
    const nodeCount = getNodeCount(argv.nodeType)
    console.info(`Node Count: ${nodeCount}`)
    for (let i = 0; i < nodeCount; i++) {
      const instanceName = await getNodeVmName(argv.celoEnv, argv.nodeType, i)
      instanceNames.push(instanceName)
    }
  } else {
    console.info(`Only Index: ${argv.only}`)
    const instanceName = await getNodeVmName(argv.celoEnv, argv.nodeType, argv.only)
    instanceNames.push(instanceName)
  }

  const runCmds = []
  for (const instanceName of instanceNames) {
    runCmds.push(runSshCommand(instanceName, cmd))
  }

  await Promise.all(runCmds)

  console.info('Done.')
}

async function runSshCommand(instanceName: string, cmd: string) {
  const bareSshCmd = getVmSshCommand(instanceName)
  const fullCmd = `${bareSshCmd} --command "${cmd}"`
  console.info(`Running ${fullCmd}`)
  return execCmd(fullCmd, {}, false, true)
}

function getNodeCount(nodeType: string) {
  switch (nodeType) {
    case 'validator':
      return fetchEnv(envVar.VALIDATORS)
    case 'tx-node':
      return fetchEnv(envVar.TX_NODES)
    case 'bootnode':
      return 1
    case 'proxy':
      return fetchEnv(envVar.PROXIED_VALIDATORS)
    default:
      throw new Error('Invalid node type')
  }
}
