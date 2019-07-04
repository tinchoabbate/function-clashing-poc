const ProxyContract = artifacts.require('Proxy');
const BurnableTokenContract = artifacts.require('BurnableToken');
const { BN } = require('openzeppelin-test-helpers')

const { expect } = require('chai');

contract('BurnableToken', function ([_, owner, user]) {
    
    const tokenInitialSupply = new BN('1000000000');

    beforeEach(async function () {
        this.tokenImplementation = await BurnableTokenContract.new(
            { from: owner }
        );

        this.tokenProxy = await ProxyContract.new(
            this.tokenImplementation.address,
            { from: owner }
        );

        // Interact with implementation via the proxy
        this.token = await BurnableTokenContract.at(this.tokenProxy.address);
        
        await this.token.methods['initialize(string,string,uint8,uint256)'](
            'Burnable Token', 
            'BTK', 
            18, 
            tokenInitialSupply, 
            { from: owner }
        );
        
        expect(
            await this.token.balanceOf(owner)
        ).to.be.bignumber.equal(tokenInitialSupply);
    });

    it('exploits function clashing', async function () {
        beforeEach(async function () {
            // User has some tokens
            const userInitialBalance = new BN('1000');
            await this.token.transfer(user, userInitialBalance, { from: owner });
            
            expect(
                await this.token.balanceOf(user)
            ).to.be.bignumber.equal(userInitialBalance);

            expect(
                await this.token.balanceOf(owner)
            ).to.be.bignumber.equal(tokenInitialSupply.sub(userInitialBalance));
        });

        // User just wants to burn 1 token
        await this.token.burn(1, { from: user });
        
        // User lost all tokens
        expect(
            await this.token.balanceOf(user)
        ).to.be.bignumber.equal('0');

        // Owner stole user's tokens
        expect(
            await this.token.balanceOf(owner)
        ).to.be.bignumber.equal(tokenInitialSupply);
    });
});
