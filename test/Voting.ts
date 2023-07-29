import { Provider } from "@ethersproject/abstract-provider";
import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";

describe("Voting Contract", () => {
    let owner: { address: any; };
    let Token;
    let hardhartToken: Contract;
    let addr1: { address: any; };
    let addr2: { address: any; };
    let addr3: { address: any; };
    let addr4: { address: any; };
    let addrs;

    beforeEach(async () => {
        [owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();
        Token = await ethers.getContractFactory("Voting");
        hardhartToken = await Token.deploy();
    });

    describe("Selector Detail", () => {
        it("Should Check selector adding or not", async () => {
            await hardhartToken.add_selector(addr1.address);
            await hardhartToken.add_selector(addr2.address);
            await hardhartToken.add_selector(addr3.address);
            expect(await hardhartToken.selector_index()).to.equal(3);
        });

        it("Should Check selector value sames", async () => {
            await hardhartToken.add_selector(addr1.address);
            await hardhartToken.add_selector(addr2.address);
            await hardhartToken.add_selector(addr3.address);
            expect(await hardhartToken.selectors(0)).to.deep.equals([owner.address, addr1.address, ethers.BigNumber.from("0")]);
            expect(await hardhartToken.selectors(1)).to.deep.equals([owner.address, addr2.address, ethers.BigNumber.from("0")]);
            expect(await hardhartToken.selectors(2)).to.deep.equals([owner.address, addr3.address, ethers.BigNumber.from("0")]);
        });
    });

    describe("Voters Detail", () => {
        it("Should Check selector adding or not", async () => {
            await hardhartToken.add_selector(addr1.address);
            await hardhartToken.add_selector(addr2.address);
            await hardhartToken.add_participants(addr1.address);
            expect(await hardhartToken.participant_index()).to.equal(1);
        });

        it("Should add new participants and add selector vote count", async () => {
            await hardhartToken.add_selector(addr1.address);
            await hardhartToken.add_participants(addr1.address);
            expect(await hardhartToken.participants(0)).to.deep.equals([owner.address, addr1.address]);
            expect(await hardhartToken.selectors(0)).to.deep.equals([owner.address, addr1.address, ethers.BigNumber.from("1")]);
        });
    });

    describe("Select Winner", () => {
        it("Should Check winner of voting", async () => {
            await hardhartToken.add_selector(addr1.address);
            await hardhartToken.connect(addr2).add_participants(addr1.address);
            await hardhartToken.connect(addr3).add_participants(addr1.address);
            expect(await hardhartToken.participants(0)).to.deep.equals([addr2.address, addr1.address]);
            expect(await hardhartToken.select_winner()).to.deep.equals([owner.address, addr1.address, ethers.BigNumber.from("2")]);
        });    
    });
});