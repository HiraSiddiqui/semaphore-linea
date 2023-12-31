import { poseidonContract } from "circomlibjs"
import { task, types } from "hardhat/config"

task("deploy:semaphore-whistleblowing", "Deploy a SemaphoreWhistleblowing contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }): Promise<any> => {
        const PairingFactory = await ethers.getContractFactory("Pairing")
        const pairing = await PairingFactory.deploy()

        await pairing.deployed()

        if (logs) {
            console.info(`Pairing library has been deployed to: ${pairing.address}`)
        }

        const SemaphoreVerifierFactory = await ethers.getContractFactory("SemaphoreVerifier", {
            libraries: {
                Pairing: pairing.address
            }
        })

        const semaphoreVerifier = await SemaphoreVerifierFactory.deploy()

        await semaphoreVerifier.deployed()

        if (logs) {
            console.info(`SemaphoreVerifier contract has been deployed to: ${semaphoreVerifier.address}`)
        }

        const poseidonABI = poseidonContract.generateABI(2)
        const poseidonBytecode = poseidonContract.createCode(2)

        const [signer] = await ethers.getSigners()

        const PoseidonFactory = new ethers.ContractFactory(poseidonABI, poseidonBytecode, signer)
        const poseidon = await PoseidonFactory.deploy()

        await poseidon.deployed()

        if (logs) {
            console.info(`Poseidon library has been deployed to: ${poseidon.address}`)
        }

        const IncrementalBinaryTreeFactory = await ethers.getContractFactory("IncrementalBinaryTree", {
            libraries: {
                PoseidonT3: poseidon.address
            }
        })
        const incrementalBinaryTree = await IncrementalBinaryTreeFactory.deploy()

        await incrementalBinaryTree.deployed()

        if (logs) {
            console.info(`IncrementalBinaryTree library has been deployed to: ${incrementalBinaryTree.address}`)
        }

        const SemaphoreWhistleblowingFactory = await ethers.getContractFactory("SemaphoreWhistleblowing", {
            libraries: {
                IncrementalBinaryTree: incrementalBinaryTree.address
            }
        })

        const semaphoreWhistleblowing = await SemaphoreWhistleblowingFactory.deploy(semaphoreVerifier.address)

        await semaphoreWhistleblowing.deployed()

        if (logs) {
            console.info(`SemaphoreWhistleblowing contract has been deployed to: ${semaphoreWhistleblowing.address}`)
        }

        return {
            semaphoreWhistleblowing,
            pairingAddress: pairing.address,
            semaphoreVerifierAddress: semaphoreVerifier.address,
            poseidonAddress: poseidon.address,
            incrementalBinaryTreeAddress: incrementalBinaryTree.address
        }
    })
