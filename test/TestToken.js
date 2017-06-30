
var Token = artifacts.require('TestToken.sol');

contract('ERC20Token', async (accounts) => {
  var supply = 125000000; // 125m
  var owner = accounts[0];
  var dev1 = accounts[1];

  it('shall put 125m for creator', () => {
    var token;

    return Token.new('Farad', 'FRD', 8, supply).then((instance) => {
      token = instance;
      return token.balanceOf.call(owner);
    }).then((balance) => {
      assert.equal(balance.toNumber(), supply, "125m wasn't in the first account");
      return token.name.call();
    }).then((name) => {
      console.log('name:', name);
    });
  });

  it('shall show a correct balance', () => {
    // transfer 1000 to addr1
    var token;
    var tokenBalance;

    return Token.new('Farad', 'FRD', 8, supply).then((instance) => {
      token = instance;
      return token.balanceOf.call(accounts[0]);
    }).then((balance) => {
      tokenBalance = balance.toNumber();
    }).then(() => {
      assert.equal(tokenBalance, supply, "125m is expected");
    });
  });

  it('shall make a correct transfer', () => {
    var token;

    return Token.new('Farad', 'FRD', 8, supply).then((instance) => {
      token = instance;
      // get balance first. should be 100m
      return token.balanceOf.call(owner);
    }).then((balance) => {
      // balance should be 100m
      var actual = balance.toNumber();
      assert.equal(actual, supply, 'Expected 125m balance');
    }).then(() => {
      // make a transfer
      return token.transfer(dev1, 1000, {from: owner});
    }).then((result) => {
      // ok, transfer is successful!      
      // console.log('transfer result:', result);
      // get the balance
      return token.balanceOf.call(dev1);
    }).then((res) => {
      // dev1 balance should be 1000
      assert.equal(res.toNumber(), 1000, 'Expected balance of 1000');
    }).then(() => {
      // get the acc0 balance
      return token.balanceOf.call(owner);
    }).then((m_bal) => {
      // expect balance of account[0] to be 1000 less
      var bal = supply - 1000;
      var actual = m_bal.toNumber();      
      assert.equal(actual, bal, 'Expected to be 1000 less from 100m');
    }).catch((e) => {
      console.log('error: ', e);
    });
  });

  it('shall allow transfer from acc0 to dev1', () => {
    var token;

    return Token.new('Farad', 'FRD', 8, supply).then((instance) => {
      token = instance;

      // make a transfer
      return token.transfer(dev1, 1000, {from: owner});
    }).then((res) => {
      console.log('txHash:', res.receipt.transactionHash);
      // check the balance for dev1
      return token.balanceOf.call(dev1);
    }).then((res) => {
      assert.equal(res.toNumber(), 1000, 'Expected to be 1000');
    }).then(() => {
      // check balance of owner
      return token.balanceOf.call(owner);
    }).then((res) => {
      assert.equal(res.toNumber(), supply - 1000, 'Extected to be 1000 less');
    });
  });

  // it('shall allow dev1 to claim money', function() {
  //   var supply = 100000000; // 100m
  //   var token;
  //   var owner = accounts[0];
  //   var dev1 = 0x47204B7AF24dab0fd2d8E65Ed679612Ee45AC40B;

  //   return Token.new('Farad', 'FRD', 8, supply).then(function(instance) {
  //     token = instance;
  //   });

  // });  

});