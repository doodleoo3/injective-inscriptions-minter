const shell = require("shelljs");
const fs = require("fs");

const PASSWORD = ''

const CHAIN_ID = 'injective-1'
const DENOM = 'inj'
const BINARY = 'injectived'
const MEMO = 'ZGF0YToseyJwIjoiaW5qcmMtMjAiLCJvcCI6Im1pbnQiLCJ0aWNrIjoiSU5KUyIsImFtdCI6IjIwMDAifQ=='

const RPC = 'https://injective-rpc.publicnode.com:443'
const GAS = '2000000'
const FEES = '2000000000000000'
const AMOUNT = "1"

function readFileLines(filename) {
    return fs.readFileSync(filename, 'utf-8').split('\n').filter(Boolean);
}

let addressLines = readFileLines('data/address.txt');
let addressIndex = 0;

(async function () {
    while (true) {
        const cmdGetHeight = `curl -s ${RPC}/block | jq -r .result.block.header.height`;
        const blockHeight = shell.exec(cmdGetHeight, { shell: '/bin/bash', silent: true });
        const blockNumber = Number(blockHeight.split('\n')[0])
        if ((blockNumber >= 55094800 - 100 && blockNumber <= 55096300 - 100) ||
            (blockNumber >= 55138000 - 100 && blockNumber <= 55139500 - 100) ||
            (blockNumber >= 55181200 - 100 && blockNumber <= 55182700 - 100) ||
            (blockNumber >= 55224400 - 100 && blockNumber <= 55225900 - 100) ||
            (blockNumber >= 55267600 - 100 && blockNumber <= 55269100 - 100) ||
            (blockNumber >= 55310800 - 100 && blockNumber <= 55312300 - 100) ||
            (blockNumber >= 55354000 - 100 && blockNumber <= 55355500 - 100)) {
            const WALLET = `wallet${addressIndex + 1}`
            const ADDRESS = addressLines[addressIndex].trim();

            console.log(`\n\nCurrent address - ${ADDRESS}. Current wallet - ${WALLET}\n`)

            const cmdSendTran = `echo -e "${PASSWORD}\\n${PASSWORD}\\n" | ${BINARY} tx bank send ${WALLET} ${ADDRESS} ${AMOUNT}${DENOM} --chain-id ${CHAIN_ID} --fees ${FEES}${DENOM} --node ${RPC} --note ${MEMO} --from ${WALLET} --gas ${GAS} -y`


            const sendTran = shell.exec(cmdSendTran, { shell: '/bin/bash', silent: true });
            console.log(sendTran.stdout + sendTran.stderr);

            addressIndex = (addressIndex + 1) % addressLines.length;

        } else {
            console.log(`Mint has not started yet.\nCurrent block - ${Number(blockHeight.split('\n')[0])}\n\n`);
        }
    }
})();