const shell = require("shelljs");
const fs = require("fs");

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const PASSWORD = ""
const WALLET_AMOUNT = 10;

(async function () {
    for (let i = 1; i <= WALLET_AMOUNT; i++) {
        const cmdCreateWallet = `echo -e "${PASSWORD}\\n${PASSWORD}\\n" | injectived keys add wallet${i} --keyring-backend os`;
        const createWallet = shell.exec(cmdCreateWallet, { shell: '/bin/bash', silent: true });

        await sleep(100)

        const createWalletOutput = createWallet.stdout + createWallet.stderr;

        const addressWithExtra = createWalletOutput.split('\n')[0];
        const address = addressWithExtra.replace('- address: ', '').trim();
        const mnemonic = createWalletOutput.split('\n')[10]

        if (address && mnemonic) {

            fs.appendFileSync("data/address.txt", address + '\n');
            fs.appendFileSync("data/seed.txt", mnemonic + '\n');
        } else {
            console.error('Failed to parse the wallet creation output.');
        }

        console.log(createWallet.stdout + createWallet.stderr);

        await sleep(100);
    }
})();